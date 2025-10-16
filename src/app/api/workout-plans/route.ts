import { NextResponse } from 'next/server'
import { supabase } from 'lib/supabaseClient'

// GET /api/plans → List all workout plans
export async function GET() {
  const { data, error } = await supabase
    .from('workout_plans')
    .select(`
      plan_id,
      name,
      description,
      plan_days(day_number)
    `)

  if (error)
    return NextResponse.json({ message: 'Failed to fetch plans.', error: error.message }, { status: 500 })

  // Compute duration_days from plan_days
  const formatted = data.map(plan => ({
    plan_id: plan.plan_id,
    name: plan.name,
    description: plan.description,
    duration_days: plan.plan_days?.length
      ? Math.max(...plan.plan_days.map((d: any) => d.day_number))
      : 0
  }))

  return NextResponse.json(formatted, { status: 200 })
}
