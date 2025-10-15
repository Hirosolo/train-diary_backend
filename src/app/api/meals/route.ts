import { NextResponse } from 'next/server'
import { supabase } from 'lib/supabaseClient'

// Create a new meal (with optional food details)
export async function POST(req: Request) {
  const { user_id, meal_type, log_date, foods } = await req.json()
  // foods: [{ food_id, amount_grams }]

  if (!user_id || !meal_type || !log_date) {
    return NextResponse.json(
      { message: 'user_id, meal_type, and log_date are required.' },
      { status: 400 }
    )
  }

  // Insert meal record
  const { data: meal, error: mealError } = await supabase
    .from('user_meals')
    .insert([{ user_id, meal_type, log_date }])
    .select('meal_id')
    .single()

  if (mealError || !meal) {
    return NextResponse.json(
      { message: 'Failed to add meal.', error: mealError?.message },
      { status: 500 }
    )
  }

  // If foods array provided, insert meal details
  if (Array.isArray(foods) && foods.length > 0) {
    const details = foods.map((f: any) => ({
      meal_id: meal.meal_id,
      food_id: f.food_id,
      amount_grams: f.amount_grams,
    }))

    const { error: detailsError } = await supabase
      .from('user_meal_details')
      .insert(details)

    if (detailsError) {
      // Rollback meal if details fail
      await supabase.from('user_meals').delete().eq('meal_id', meal.meal_id)
      return NextResponse.json(
        { message: 'Failed to add meal details.', error: detailsError.message },
        { status: 500 }
      )
    }
  }

  return NextResponse.json(
    { meal_id: meal.meal_id, message: 'Meal created successfully.' },
    { status: 201 }
  )
}

// Get all meals (optionally filtered by user_id and/or date)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const user_id = searchParams.get('user_id')
  const log_date = searchParams.get('log_date')

  let query = supabase.from('user_meals').select('*').order('log_date', { ascending: false })

  if (user_id) query = query.eq('user_id', user_id)
  if (log_date) query = query.eq('log_date', log_date)

  const { data, error } = await query

  if (error) {
    return NextResponse.json(
      { message: 'Failed to fetch meals.', error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json(data, { status: 200 })
}
