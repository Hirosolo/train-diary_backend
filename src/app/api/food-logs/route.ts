import { NextResponse } from 'next/server';
import { supabase } from 'lib/supabaseClient';

/**
 * Food Logs API (CRUD)
 * - GET: fetch all logs or one by ?meal_id
 * - POST: create a new food log (meal + details)
 * - PUT: update a meal log and its foods
 * - DELETE: delete a meal log and its details
 */

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const mealId = searchParams.get('meal_id');

    let query = supabase
      .from('user_meals')
      .select(`
        meal_id,
        user_id,
        meal_type,
        log_date,
        user_meal_details(
          meal_detail_id,
          amount_grams,
          foods(name, calories_per_serving, protein_per_serving, carbs_per_serving, fat_per_serving)
        )
      `);

    if (mealId) query = query.eq('meal_id', mealId);

    const { data, error } = await query;

    if (error)
      return NextResponse.json({ error: 'Failed to fetch food logs.' }, { status: 500 });

    if (mealId && (!data || data.length === 0))
      return NextResponse.json({ error: 'Food log not found.' }, { status: 404 });

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: 'Unexpected error occurred while fetching food logs.' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user_id, meal_type, log_date, foods } = body;

    // Validate input
    if (!user_id || !meal_type || !log_date || !foods?.length) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id, meal_type, log_date, or foods.' },
        { status: 400 }
      );
    }

    // Check that user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('user_id')
      .eq('user_id', user_id)
      .maybeSingle();

    if (!existingUser)
      return NextResponse.json(
        { error: `User with ID ${user_id} does not exist.` },
        { status: 400 }
      );

    // Insert into user_meals
    const { data: meal, error: mealErr } = await supabase
      .from('user_meals')
      .insert([{ user_id, meal_type, log_date }])
      .select()
      .single();

    if (mealErr)
      return NextResponse.json({ error: 'Failed to create meal log.' }, { status: 500 });

    // Insert meal details
    const details = foods.map((f: any) => ({
      meal_id: meal.meal_id,
      food_id: f.food_id,
      amount_grams: f.amount_grams,
    }));

    const { error: detailsErr } = await supabase.from('user_meal_details').insert(details);
    if (detailsErr)
      return NextResponse.json({ error: 'Failed to add food details.' }, { status: 500 });

    return NextResponse.json(
      {
        message: 'Food log created successfully.',
        data: meal,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: 'Unexpected error occurred while creating food log.' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { meal_id, meal_type, log_date, foods } = body;

    if (!meal_id)
      return NextResponse.json({ error: 'Missing meal_id for update.' }, { status: 400 });

    // Check if meal exists
    const { data: existingMeal } = await supabase
      .from('user_meals')
      .select('meal_id')
      .eq('meal_id', meal_id)
      .maybeSingle();

    if (!existingMeal)
      return NextResponse.json({ error: 'Meal not found.' }, { status: 404 });

    //Update meal info
    const { error: mealErr } = await supabase
      .from('user_meals')
      .update({ meal_type, log_date })
      .eq('meal_id', meal_id);

    if (mealErr)
      return NextResponse.json({ error: 'Failed to update meal log.' }, { status: 500 });

    // Update food details if provided
    if (foods?.length) {
      await supabase.from('user_meal_details').delete().eq('meal_id', meal_id);
      const newDetails = foods.map((f: any) => ({
        meal_id,
        food_id: f.food_id,
        amount_grams: f.amount_grams,
      }));

      const { error: detailsErr } = await supabase.from('user_meal_details').insert(newDetails);
      if (detailsErr)
        return NextResponse.json({ error: 'Failed to update food details.' }, { status: 500 });
    }

    return NextResponse.json(
      { message: 'Food log updated successfully.' },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: 'Unexpected error occurred while updating food log.' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { meal_id } = body;

    if (!meal_id)
      return NextResponse.json({ error: 'Missing meal_id for delete.' }, { status: 400 });

    // Check if meal exists
    const { data: existingMeal } = await supabase
      .from('user_meals')
      .select('meal_id')
      .eq('meal_id', meal_id)
      .maybeSingle();

    if (!existingMeal)
      return NextResponse.json({ error: 'Meal not found.' }, { status: 404 });

    // Delete related details first
    await supabase.from('user_meal_details').delete().eq('meal_id', meal_id);

    // Delete main meal log
    const { error } = await supabase.from('user_meals').delete().eq('meal_id', meal_id);
    if (error)
      return NextResponse.json({ error: 'Failed to delete meal log.' }, { status: 500 });

    return NextResponse.json(
      { message: 'Food log deleted successfully.' },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: 'Unexpected error occurred while deleting food log.' },
      { status: 500 }
    );
  }
}
