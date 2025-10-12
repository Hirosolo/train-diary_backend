import { supabase } from 'lib/supabaseClient'
import { NextResponse } from 'next/server'

export async function GET() {
  const { data, error } = await supabase
    .from('workout_plans')
    .select('*, plan_days(*, plan_day_exercises(*, exercises(*)))')
    .order('name', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}