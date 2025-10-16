import { NextResponse } from 'next/server'
import { supabase } from 'lib/supabaseClient'

export async function POST(req: Request) {
  const { session_id } = await req.json()
  if (!session_id) return NextResponse.json({ message: 'session_id required.' }, { status: 400 })

  // delete exercise_logs → session_details → session
  const { data: details } = await supabase
    .from('session_details')
    .select('session_detail_id')
    .eq('session_id', session_id)

  if (details?.length) {
    const ids = details.map((d) => d.session_detail_id)
    await supabase.from('exercise_logs').delete().in('session_detail_id', ids)
  }

  await supabase.from('session_details').delete().eq('session_id', session_id)
  const { error } = await supabase.from('workout_sessions').delete().eq('session_id', session_id)

  if (error)
    return NextResponse.json({ message: 'Failed to delete session.', error: error.message }, { status: 500 })

  return NextResponse.json({ message: 'Session deleted.' }, { status: 200 })
}
