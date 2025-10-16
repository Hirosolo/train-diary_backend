import { NextResponse } from 'next/server'
import { supabase } from 'lib/supabaseClient'

export async function POST(req: Request) {
  const { session_id } = await req.json()
  if (!session_id) return NextResponse.json({ message: 'session_id required.' }, { status: 400 })

  const { data: details } = await supabase
    .from('session_details')
    .select('session_detail_id')
    .eq('session_id', session_id)

  if (!details?.length)
    return NextResponse.json({ message: 'No exercises in this session.' }, { status: 400 })

  for (const d of details) {
    const { data: logs } = await supabase
      .from('exercise_logs')
      .select('log_id')
      .eq('session_detail_id', d.session_detail_id)
      .limit(1)
    if (!logs?.length)
      return NextResponse.json({ message: 'All exercises must have at least one log.' }, { status: 400 })
  }

  const { error } = await supabase
    .from('workout_sessions')
    .update({ completed: true })
    .eq('session_id', session_id)

  if (error)
    return NextResponse.json({ message: 'Failed to mark session completed.', error: error.message }, { status: 500 })

  return NextResponse.json({ message: 'Session marked as completed.' }, { status: 200 })
}
