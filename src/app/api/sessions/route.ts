import { NextResponse } from 'next/server'
import { supabase } from 'lib/supabaseClient'

// Create a workout session
export async function POST(req: Request) {
  const { user_id, scheduled_date, type, notes } = await req.json()

  if (!user_id || !scheduled_date) {
    return NextResponse.json(
      { message: 'user_id and scheduled_date are required.' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('workout_sessions')
    .insert([{ user_id, scheduled_date, type: type || null, notes: notes || null }])
    .select('session_id')
    .single()

  if (error)
    return NextResponse.json({ message: 'Failed to create session.', error: error.message }, { status: 500 })

  return NextResponse.json({ session_id: data.session_id }, { status: 201 })
}

// Get all sessions for a user
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const user_id = searchParams.get('user_id')

  if (!user_id)
    return NextResponse.json({ message: 'user_id required' }, { status: 400 })

  const { data, error } = await supabase
    .from('workout_sessions')
    .select('*')
    .eq('user_id', user_id)
    .order('scheduled_date', { ascending: false })

  if (error)
    return NextResponse.json({ message: 'Failed to fetch sessions.', error: error.message }, { status: 500 })

  return NextResponse.json(data, { status: 200 })
}
