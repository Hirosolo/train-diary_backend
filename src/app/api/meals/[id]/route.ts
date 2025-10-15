import { NextResponse } from 'next/server'
import { supabase } from 'lib/supabaseClient'

// Get full meal details (with joined foods)
export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = params.id

  const { data, error } = await supabase
    .from('user_meal_details')
    .select(`
      meal_detail_id,
      amount_grams,
      foods (
        food_id,
        name,
        calories_per_serving,
        protein_per_serving,
        carbs_per_serving,
        fat_per_serving,
        serving_type,
        image
      )
    `)
    .eq('id', id)

  if (error) {
    return NextResponse.json(
      { message: 'Failed to fetch meal details.', error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json(data, { status: 200 })
}

// Delete a meal and its details
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const id = params.id

  // Delete details first
  const { error: detailError } = await supabase
    .from('user_meal_details')
    .delete()
    .eq('id', id)

  if (detailError) {
    return NextResponse.json(
      { message: 'Failed to delete meal details.', error: detailError.message },
      { status: 500 }
    )
  }

  // Delete meal
  const { error: mealError } = await supabase.from('user_meals').delete().eq('id', id)

  if (mealError) {
    return NextResponse.json(
      { message: 'Failed to delete meal.', error: mealError.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ message: 'Meal deleted successfully.' }, { status: 200 })
}
