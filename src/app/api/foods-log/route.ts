import { NextResponse } from 'next/server'
import { supabase } from 'lib/supabaseClient'

// POST - Create a meal log
export async function POST(req: Request) {
  const { user_id, meal_type, log_date, foods } = await req.json()
  if (!user_id || !meal_type || !log_date || !Array.isArray(foods) || foods.length === 0) {
    return NextResponse.json({ message: 'All fields and at least one food are required.' }, { status: 400 })
  }

  const { data: meal, error: mealError } = await supabase
    .from('user_meals')
    .insert([{ user_id, meal_type, log_date }])
    .select('meal_id')
    .single()

  if (mealError || !meal) {
    return NextResponse.json({ message: 'Failed to log meal.', error: mealError?.message }, { status: 500 })
  }

  const mealDetails = foods.map((f: any) => ({
    meal_id: meal.meal_id,
    food_id: f.food_id,
    amount_grams: f.amount_grams,
  }))

  const { error: detailError } = await supabase.from('user_meal_details').insert(mealDetails)
  if (detailError) {
    return NextResponse.json({ message: 'Failed to log meal details.', error: detailError.message }, { status: 500 })
  }

  return NextResponse.json({ meal_id: meal.meal_id, message: 'Meal logged.' }, { status: 201 })
}

// GET - Get meals (optionally by user_id/date)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const user_id = searchParams.get('user_id')
  const date = searchParams.get('date')

  if (!user_id) {
    return NextResponse.json({ message: 'user_id required' }, { status: 400 })
  }

  let query = supabase.from('user_meals').select('*').eq('user_id', user_id)
  if (date) query = query.eq('log_date', date)

  const { data, error } = await query.order('log_date', { ascending: false }).order('meal_type')

  if (error) {
    return NextResponse.json({ message: 'Failed to fetch meals', error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 200 })
}

// DELETE - Delete a meal and its details
export async function DELETE(req: Request) {
  const { meal_id } = await req.json()
  if (!meal_id) {
    return NextResponse.json({ message: 'meal_id required' }, { status: 400 })
  }

  const { error: detailErr } = await supabase.from('user_meal_details').delete().eq('meal_id', meal_id)
  const { error: mealErr } = await supabase.from('user_meals').delete().eq('meal_id', meal_id)

  if (detailErr || mealErr) {
    return NextResponse.json({
      message: 'Failed to delete meal.',
      error: detailErr?.message || mealErr?.message,
    }, { status: 500 })
  }

  return NextResponse.json({ message: 'Meal deleted.' })
}
