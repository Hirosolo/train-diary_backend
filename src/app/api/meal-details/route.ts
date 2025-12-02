import { NextResponse } from 'next/server';
import { supabase } from 'lib/supabaseClient';

interface MealDetailResponse {
  meal_detail_id: number;
  meal_id: number;
  amount_grams: number;
  foods: {
    food_id: number;
    name: string;
    calories_per_serving: number;
    protein_per_serving: number;
    carbs_per_serving: number;
    fat_per_serving: number;
    serving_type?: string;
    image?: string;
  }[];
  user_meals:
    | {
        user_id: number;
        meal_type: string;
        log_date: string;
      }
    | Array<{
    user_id: number;
    meal_type: string;
    log_date: string;
      }>;
}

interface MealDetailDTO {
  meal_detail_id: number;
  meal_id: number;
  amount_grams: number;
  food: {
    food_id?: number;
    name: string;
    calories_per_serving: number;
    protein_per_serving: number;
    carbs_per_serving: number;
    fat_per_serving: number;
    serving_type?: string;
    image?: string;
  };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const mealId = searchParams.get('meal_id');

    let query = supabase
      .from('user_meal_details')
      .select(
        `
        meal_detail_id,
        meal_id,
        amount_grams,
        foods(
          food_id,
          name,
          calories_per_serving,
          protein_per_serving,
          carbs_per_serving,
          fat_per_serving,
          serving_type,
          image
        )
      `
      )
      .eq('meal_id', mealId)
      .order('meal_detail_id', { ascending: true });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching meal details:', error.message);
      return NextResponse.json(
        { error: 'Failed to fetch meal details.' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json([], { status: 200 });
    }

    const normalized: MealDetailDTO[] = (data as MealDetailResponse[]).map(
      (detail) => {
        const foodEntity = Array.isArray(detail.foods)
          ? detail.foods[0]
          : detail.foods;
        const mealEntity = Array.isArray(detail.user_meals)
          ? detail.user_meals[0]
          : detail.user_meals;

        return {
          meal_detail_id: detail.meal_detail_id,
          meal_id: detail.meal_id,
          amount_grams: detail.amount_grams,
          food: {
            food_id: foodEntity?.food_id,
            name: foodEntity?.name || '',
            calories_per_serving: foodEntity?.calories_per_serving || 0,
            protein_per_serving: foodEntity?.protein_per_serving || 0,
            carbs_per_serving: foodEntity?.carbs_per_serving || 0,
            fat_per_serving: foodEntity?.fat_per_serving || 0,
            serving_type: foodEntity?.serving_type,
            image: foodEntity?.image,
          }
        };
      }
    );

    return NextResponse.json(normalized, { status: 200 });
  } catch (err) {
    console.error('Unexpected error fetching meal details:', err);
    return NextResponse.json(
      { error: 'Unexpected error occurred while fetching meal details.' },
      { status: 500 }
    );
  }
}

