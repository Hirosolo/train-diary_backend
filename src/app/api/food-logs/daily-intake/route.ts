import { NextResponse } from "next/server";
import { supabase } from "lib/supabaseClient";
import { Food } from "types/datatypes";

type MacroTotals = {
  meals_count: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

const initialTotals: MacroTotals = {
  meals_count: 0,
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
};

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("user_id");
    const date = url.searchParams.get("date");

    if (!userId || !date) {
      return NextResponse.json(
        { message: "user_id and date are required." },
        { status: 400 }
      );
    }

    const { data: meals, error } = await supabase
      .from("user_meals")
      .select(
        `
        meal_id,
        user_meal_details(
          amount_grams,
          foods(
            calories_per_serving,
            protein_per_serving,
            carbs_per_serving,
            fat_per_serving,
            serving_type
          )
        )
      `
      )
      .eq("user_id", userId)
      .eq("log_date", date);

    if (error) {
      console.error("Failed to fetch meals for daily intake:", error.message);
      return NextResponse.json(
        { message: "Failed to fetch meals." },
        { status: 500 }
      );
    }

    if (!meals?.length) {
      return NextResponse.json(
        {
          user_id: Number(userId),
          date,
          ...initialTotals,
        },
        { status: 200 }
      );
    }

    const totals = meals.reduce<MacroTotals>(
      (acc, meal) => {
        acc.meals_count += 1;
        const details = meal.user_meal_details ?? [];
        for (const detail of details) {
          const grams = Number(detail.amount_grams ?? 0);
          const food = Array.isArray(detail.foods)
            ? detail.foods[0]
            : detail.foods;
          if (!food) continue;

          // serving_type is a string like "100 g" → extract numeric part
          const servingText = (food as Food).serving_type as string | undefined;
          const servingSizeGrams = servingText
            ? Number(servingText.match(/\d+(\.\d+)?/)?.[0] ?? 0)
            : 0;

          // Fallback: if serving_size is invalid, treat 1 serving as 1 gram
          const safeServingSize = servingSizeGrams > 0 ? servingSizeGrams : 1;
          const servings = grams / safeServingSize;

          acc.calories += food.calories_per_serving * servings;
          acc.protein += food.protein_per_serving * servings;
          acc.carbs += food.carbs_per_serving * servings;
          acc.fat += food.fat_per_serving * servings;
        }
        return acc;
      },
      { ...initialTotals }
    );

    return NextResponse.json(
      {
        user_id: Number(userId),
        date,
        meals_count: totals.meals_count,
        calories: Math.round(totals.calories),
        protein: Math.round(totals.protein),
        carbs: Math.round(totals.carbs),
        fat: Math.round(totals.fat),
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Unexpected error fetching daily intake:", err);
    return NextResponse.json(
      { message: "Unexpected error occurred." },
      { status: 500 }
    );
  }
}

