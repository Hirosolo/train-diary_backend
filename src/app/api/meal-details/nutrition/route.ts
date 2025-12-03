import { NextResponse } from 'next/server';
import { supabase } from 'lib/supabaseClient';

interface MealNutritionResponse {
  meal_detail_id: number;
  amount_grams: number;
  foods: {
    food_id: number;
    name: string;
    calories_per_serving: number;
    protein_per_serving: number;
    carbs_per_serving: number;
    fat_per_serving: number;
    serving_type?: string;
  }[];
}

interface FoodNutrition {
  meal_detail_id: number;
  food_id: number;
  name: string;
  amount_grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving_type?: string;
}

/**
 * Calculate nutrition values based on amount_grams and serving information
 */
function calculateNutrition(
  amountGrams: number,
  caloriesPerServing: number,
  proteinPerServing: number,
  carbsPerServing: number,
  fatPerServing: number,
  servingType?: string
): { calories: number; protein: number; carbs: number; fat: number } {
  // Extract serving size from serving_type (e.g., "100 g" → 100)
  const servingText = servingType || '';
  const servingSizeGrams = servingText
    ? Number(servingText.match(/\d+(\.\d+)?/)?.[0] ?? 0)
    : 0;

  // Fallback: if serving_size is invalid, treat 1 serving as 1 gram
  const safeServingSize = servingSizeGrams > 0 ? servingSizeGrams : 1;
  const servings = amountGrams / safeServingSize;

  return {
    calories: caloriesPerServing * servings,
    protein: proteinPerServing * servings,
    carbs: carbsPerServing * servings,
    fat: fatPerServing * servings,
  };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const mealId = searchParams.get('meal_id');

    if (!mealId) {
      return NextResponse.json(
        { error: 'meal_id is required.' },
        { status: 400 }
      );
    }

    // Verify meal exists
    const { data: meal, error: mealError } = await supabase
      .from('user_meals')
      .select('meal_id')
      .eq('meal_id', mealId)
      .maybeSingle();

    if (mealError) {
      console.error('Error checking meal:', mealError.message);
      return NextResponse.json(
        { error: 'Failed to verify meal.' },
        { status: 500 }
      );
    }

    if (!meal) {
      return NextResponse.json(
        { error: 'Meal not found.' },
        { status: 404 }
      );
    }

    // Fetch meal details with food information
    const { data, error } = await supabase
      .from('user_meal_details')
      .select(
        `
        meal_detail_id,
        amount_grams,
        foods(
          food_id,
          name,
          calories_per_serving,
          protein_per_serving,
          carbs_per_serving,
          fat_per_serving,
          serving_type
        )
      `
      )
      .eq('meal_id', mealId)
      .order('meal_detail_id', { ascending: true });

    if (error) {
      console.error('Error fetching meal nutrition:', error.message);
      return NextResponse.json(
        { error: 'Failed to fetch meal nutrition.' },
        { status: 500 }
      );
    }

    if (!data || !Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { meal_id: Number(mealId), foods: [] },
        { status: 200 }
      );
    }

    // Calculate nutrition for each food
    const foodsWithNutrition: FoodNutrition[] = (
      data as MealNutritionResponse[]
    ).map((detail) => {
      const food = Array.isArray(detail.foods)
        ? detail.foods[0]
        : detail.foods;

      if (!food) {
        return {
          meal_detail_id: detail.meal_detail_id,
          food_id: 0,
          name: 'Unknown',
          amount_grams: detail.amount_grams,
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
        };
      }

      const nutrition = calculateNutrition(
        detail.amount_grams,
        food.calories_per_serving,
        food.protein_per_serving,
        food.carbs_per_serving,
        food.fat_per_serving,
        food.serving_type
      );

      return {
        meal_detail_id: detail.meal_detail_id,
        food_id: food.food_id,
        name: food.name,
        amount_grams: detail.amount_grams,
        calories: Math.round(nutrition.calories * 100) / 100, // Round to 2 decimal places
        protein: Math.round(nutrition.protein * 100) / 100,
        carbs: Math.round(nutrition.carbs * 100) / 100,
        fat: Math.round(nutrition.fat * 100) / 100,
        serving_type: food.serving_type,
      };
    });

    return NextResponse.json(
      {
        meal_id: Number(mealId),
        foods: foodsWithNutrition,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('Unexpected error fetching meal nutrition:', err);
    return NextResponse.json(
      { error: 'Unexpected error occurred while fetching meal nutrition.' },
      { status: 500 }
    );
  }
}

