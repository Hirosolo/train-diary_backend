import { NextResponse } from 'next/server'
import { supabase } from 'lib/supabaseClient'

export async function POST(req: Request) {
  const { user_id, plan_id, start_date } = await req.json()

  if (!user_id || !plan_id || !start_date) {
    return NextResponse.json(
      { message: 'user_id, plan_id, and start_date are required.' },
      { status: 400 }
    )
  }

  // Check if user exists
  const { data: user } = await supabase.from('users').select('user_id').eq('user_id', user_id).single()
  if (!user)
    return NextResponse.json({ message: 'Invalid user_id.' }, { status: 400 })

  // Get plan details
  const { data: planDays, error: planError } = await supabase
    .from('plan_days')
    .select(`
      day_number,
      plan_day_exercises(exercise_id, sets, reps)
    `)
    .eq('plan_id', plan_id)

  if (planError || !planDays?.length)
    return NextResponse.json({ message: 'Plan has no exercises.', error: planError?.message }, { status: 404 })

  const duration_days = Math.max(...planDays.map(d => d.day_number))

  // Create sessions and details
  for (let i = 1; i <= duration_days; i++) {
    const sessionDate = new Date(start_date)
    sessionDate.setDate(sessionDate.getDate() + i - 1)
    const dateStr = sessionDate.toISOString().slice(0, 10)

    const { data: session, error: sessionError } = await supabase
      .from('workout_sessions')
      .insert([{ user_id, scheduled_date: dateStr, notes: `Plan day ${i}` }])
      .select('session_id')
      .single()

    if (sessionError) {
      return NextResponse.json({ message: 'Failed to create session.', error: sessionError.message }, { status: 500 })
    }

    const exercises = planDays
      .filter(d => d.day_number === i)
      .flatMap(d => d.plan_day_exercises)

    if (exercises.length) {
      const insertDetails = exercises.map(ex => ({
        session_id: session.session_id,
        exercise_id: ex.exercise_id,
        planned_sets: ex.sets,
        planned_reps: ex.reps
      }))
      const { error: detailError } = await supabase.from('session_details').insert(insertDetails)
      if (detailError) {
        return NextResponse.json({ message: 'Failed to insert session details.', error: detailError.message }, { status: 500 })
      }
    }
  }

  return NextResponse.json({ message: 'Plan applied and sessions created.' }, { status: 201 })
}
