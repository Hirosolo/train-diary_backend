import { NextResponse } from 'next/server'
import { supabase } from 'lib/supabaseClient'

// Add new food
export async function POST(req: Request) {
  const {
    name,
    calories_per_serving,
    protein_per_serving,
    carbs_per_serving,
    fat_per_serving,
    serving_type,
    image,
  } = await req.json()

  if (!name) {
    return NextResponse.json({ message: 'Food name is required.' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('foods')
    .insert([
      {
        name,
        calories_per_serving: calories_per_serving || null,
        protein_per_serving: protein_per_serving || null,
        carbs_per_serving: carbs_per_serving || null,
        fat_per_serving: fat_per_serving || null,
        serving_type: serving_type || null,
        image: image || null,
      },
    ])
    .select('food_id') 
    .single() 

  if (error) {
    return NextResponse.json(
      { message: 'Failed to add food.', error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ food_id: data.food_id, message: 'Food added.' }, { status: 201 })
}

// Get all foods
export async function GET() {
  const { data, error } = await supabase.from('foods').select('*')

  if (error) {
    return NextResponse.json(
      { message: 'Failed to fetch foods.', error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json(data, { status: 200 })
}
