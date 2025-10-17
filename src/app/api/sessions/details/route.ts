import { NextResponse } from 'next/server'
import { supabase } from 'lib/supabaseClient'

interface ExerciseInput {
  exercise_id: number
  planned_sets: number
  planned_reps: number
}

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url)
  const sessionId = Number(searchParams.get('session_id'))

  const { exercises }: { exercises: ExerciseInput[] } = await req.json()

  if (!sessionId || !Array.isArray(exercises) || exercises.length === 0) {
    return NextResponse.json(
      { message: 'session_id and exercises required.' },
      { status: 400 }
    )
  }

  const formatted = exercises.map((ex) => ({
    session_id: sessionId,
    exercise_id: ex.exercise_id,
    planned_sets: ex.planned_sets,
    planned_reps: ex.planned_reps,
  }))

  const { error } = await supabase.from('session_details').insert(formatted)

  if (error) {
    return NextResponse.json(
      { message: 'Failed to add exercises.', error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ message: 'Exercises added.' }, { status: 201 })
}

// Get exercises for a session
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const sessionId = Number(searchParams.get('session_id'))

  if (!sessionId) {
    return NextResponse.json(
      { message: 'session_id required.' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('session_details')
    .select(`
      session_detail_id,
      planned_sets,
      planned_reps,
      exercises (
        exercise_id,
        name,
        category,
        description
      )
    `)
    .eq('session_id', sessionId)

  if (error) {
    return NextResponse.json(
      { message: 'Failed to fetch details.', error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json(data, { status: 200 })
}
