import { NextResponse } from 'next/server'
import { supabase } from 'lib/supabaseClient'


// add exercise
export async function POST(req: Request) {
  const { name, category, default_sets, default_reps, description } = await req.json()

  if (!name) {
    return NextResponse.json({ message: 'Exercise name is required.' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('exercises')
    .insert([
      {
        name,
        category: category || null,
        default_sets: default_sets || null,
        default_reps: default_reps || null,
        description: description || null,
      },
    ])
    .select()
    .single()

  if (error) {
    return NextResponse.json(
      { message: 'Failed to add exercise.', error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ exercise_id: data.exercise_id, message: 'Exercise added.' }, { status: 201 })
}

// get all exercises
export async function GET() {
  const { data, error } = await supabase.from('exercises').select('*')

  if (error) {
    return NextResponse.json(
      { message: 'Failed to fetch exercises.', error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json(data, { status: 200 })
}
