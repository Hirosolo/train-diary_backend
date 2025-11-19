import { NextResponse } from 'next/server';
import { supabase } from 'lib/supabaseClient';

/** ---------- Type Definitions ---------- **/

interface Exercise {
  exercise_id: number;
  name: string;
  category: string;
  description: string;
}

interface PlanDayExercise {
  plan_day_exercise_id?: number;
  exercise_id: number;
  sets: number | null;
  reps: number | null;
  exercises?: Exercise;
}

interface PlanDay {
  plan_day_id: number;
  day_number: number;
  day_type?: string | null;
  plan_day_exercises?: PlanDayExercise[];
}

interface WorkoutPlan {
  plan_id: number;
  name: string;
  description: string;
  plan_days?: PlanDay[];
}

/** ---------- GET: list all plans or get details by plan_id ---------- **/

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const planId = searchParams.get('plan_id');

    if (!planId) {
      const { data, error } = await supabase
        .from('workout_plans')
        .select('plan_id, name, description, plan_days(day_number)')
        .order('plan_id', { ascending: true })
        .returns<
          {
            plan_id: number;
            name: string;
            description: string;
            plan_days: { day_number: number }[] | null;
          }[]
        >();

      if (error)
        return NextResponse.json({ error: 'Failed to fetch plans.' }, { status: 500 });

      const plans = data.map((plan) => {
        const duration =
          plan.plan_days && plan.plan_days.length
            ? Math.max(...plan.plan_days.map((d) => d.day_number))
            : 0;

        return {
          plan_id: plan.plan_id,
          name: plan.name,
          description: plan.description,
          duration_days: duration,
        };
      });

      return NextResponse.json(plans, { status: 200 });
    }

    // Get single plan details
    const { data: plan, error: planErr } = await supabase
      .from('workout_plans')
      .select(
        `
        plan_id,
        name,
        description,
        plan_days(
          plan_day_id,
          day_number,
          day_type,
          plan_day_exercises(
            plan_day_exercise_id,
            sets,
            reps,
            exercises(
              exercise_id,
              name,
              category,
              description
            )
          )
        )
      `
      )
      .eq('plan_id', planId)
      .maybeSingle()
      .returns<WorkoutPlan>();

    if (planErr)
      return NextResponse.json({ error: 'Failed to fetch plan details.' }, { status: 500 });

    if (!plan)
      return NextResponse.json({ error: 'Plan not found.' }, { status: 404 });

    const duration_days =
      plan.plan_days && plan.plan_days.length
        ? Math.max(...plan.plan_days.map((d) => d.day_number))
        : 0;

    return NextResponse.json({ ...plan, duration_days }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: 'Unexpected error occurred while fetching plans.' },
      { status: 500 }
    );
  }
}

/** ---------- POST: apply a plan for a user ---------- **/

interface ApplyPlanRequest {
  user_id: number;
  plan_id: number;
  start_date: string;
}

export async function POST(req: Request) {
  try {
    const body: ApplyPlanRequest = await req.json();
    const { user_id, plan_id, start_date } = body;

    if (!user_id || !plan_id || !start_date) {
      return NextResponse.json(
        { error: 'user_id, plan_id, and start_date are required.' },
        { status: 400 }
      );
    }

    // Validate user
    const { data: user } = await supabase
      .from('users')
      .select('user_id')
      .eq('user_id', user_id)
      .maybeSingle();

    if (!user)
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });

    // Validate plan
    const { data: plan } = await supabase
      .from('workout_plans')
      .select('plan_id')
      .eq('plan_id', plan_id)
      .maybeSingle();

    if (!plan)
      return NextResponse.json({ error: 'Plan not found.' }, { status: 404 });

    // Fetch plan days + exercises
    const { data: planDays, error: daysErr } = await supabase
      .from('plan_days')
      .select(
        `
        plan_day_id,
        day_number,
        plan_day_exercises(
          exercise_id,
          sets,
          reps
        )
      `
      )
      .eq('plan_id', plan_id)
      .order('day_number', { ascending: true })
      .returns<
        {
          plan_day_id: number;
          day_number: number;
          plan_day_exercises: {
            exercise_id: number;
            sets: number | null;
            reps: number | null;
          }[];
        }[]
      >();

    if (daysErr)
      return NextResponse.json({ error: 'Failed to fetch plan days.' }, { status: 500 });

    if (!planDays || planDays.length === 0)
      return NextResponse.json({ error: 'Plan has no exercises.' }, { status: 404 });

    // Create sessions & details
    const duration_days = Math.max(...planDays.map((d) => d.day_number));

    for (let dayNum = 1; dayNum <= duration_days; dayNum++) {
      const sessionDate = new Date(start_date);
      sessionDate.setDate(sessionDate.getDate() + dayNum - 1);

      const { data: session, error: sessionErr } = await supabase
        .from('workout_sessions')
        .insert([
          {
            user_id,
            scheduled_date: sessionDate.toISOString().split('T')[0],
            notes: `Plan day ${dayNum}`,
          },
        ])
        .select()
        .single<{ session_id: number }>();

      if (sessionErr)
        return NextResponse.json(
          { error: `Failed to create session for day ${dayNum}.` },
          { status: 500 }
        );

      const exercises =
        planDays.find((d) => d.day_number === dayNum)?.plan_day_exercises || [];

      for (const ex of exercises) {
        const { error: exErr } = await supabase
          .from('session_details')
          .insert([
            {
              session_id: session.session_id,
              exercise_id: ex.exercise_id,
              planned_sets: ex.sets,
              planned_reps: ex.reps,
            },
          ]);

        if (exErr)
          return NextResponse.json(
            { error: `Failed to add exercise for day ${dayNum}.` },
            { status: 500 }
          );
      }
    }

    return NextResponse.json(
      { message: 'Plan applied successfully. Workout sessions created.' },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Unexpected error occurred while applying plan.' },
      { status: 500 }
    );
  }
}
