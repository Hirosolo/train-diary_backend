import { NextResponse } from 'next/server'
import { supabase } from 'lib/supabaseClient'

interface exerciseInformation{
  name: string;
  category: string;
  default_sets: number;
  default_reps: number;
  description: string;
}

// get all exercises
export async function GET() {
  const { data, error } = await supabase.from('exercises').select('*')

  if (error) {
    return NextResponse.json(
      { data: [], message: 'Failed to fetch exercises.', error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json(data, { status: 200 })
}

// add exercise
export async function POST(req: Request) {
  const newExercise:exerciseInformation = await req.json()

  if (!newExercise.name) {
    return NextResponse.json({ message: 'Exercise name is required.' }, { status: 400 })
  }

  const { data:existingExercise } = await supabase
    .from('exercises')
    .select('*')
    .eq('name', newExercise.name)
    .single()

  if (existingExercise) {
    return NextResponse.json({ message: 'Exercise with this name already exists.' }, { status: 409 })
  }

  const { data, error } = await supabase
    .from('exercises')
    .insert([
      {
        name: newExercise.name,
        category: newExercise.category || null,
        default_sets: newExercise.default_sets || null,
        default_reps: newExercise.default_reps || null,
        description: newExercise.description || null,
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

// delete exercise by id
export async function DELETE(req: Request) {
  const exercise_id = await req.json();
  if (!exercise_id) {
    return NextResponse.json({ message: 'Exercise ID is required.' }, { status: 400 })
  }

  const { data:existingExercise, error: fetchError } = await supabase
  .from('exercises')
  .select('*')
  .eq('exercise_id', exercise_id)
  .single()

  if (!existingExercise) {
    return NextResponse.json({ message: 'Exercise not found.' }, { status: 404 })
  }

  const { error } = await supabase
    .from('exercises')
    .delete()
    .eq('exercise_id', exercise_id)
  if (error) {
    return NextResponse.json(
      { message: 'Failed to delete exercise.', error: error.message },
      { status: 500 }
    )
  }
  return NextResponse.json({ message: 'Exercise deleted.' }, { status: 200 })
}