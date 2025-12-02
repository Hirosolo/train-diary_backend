import { NextResponse } from 'next/server';
import { supabase } from 'lib/supabaseClient';
import { calculateSessionGR } from 'app/utils/grCalculator';
import type {
  WorkoutSession,
  ExerciseLog,
  WorkoutByDate,
} from 'types/datatypes';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const userIdParam = url.searchParams.get('user_id');
  const yearParam = url.searchParams.get('year');
  const monthParam = url.searchParams.get('month'); // 1-12

  // If all params for daily GR are present, return GR scores per day for that month
  if (userIdParam && yearParam && monthParam) {
    const user_id = Number(userIdParam);
    const year = Number(yearParam);
    const month = Number(monthParam);

    if (!Number.isInteger(user_id) || !Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
      return NextResponse.json(
        { message: 'Invalid user_id, year, or month. Month should be 1-12.' },
        { status: 400 }
      );
    }

    try {
      // Check if user exists
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('user_id')
        .eq('user_id', user_id)
        .single();

      if (userError || !user) {
        return NextResponse.json(
          { message: 'User not found.' },
          { status: 404 }
        );
      }

      // Compute month date range
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 1);

      const startISO = startDate.toISOString().split('T')[0];
      const endISO = endDate.toISOString().split('T')[0];

      // Fetch completed workouts for that month
      const { data: workoutsRaw, error: workoutsErr } = await supabase
        .from('workout_sessions')
        .select(`
          session_id,
          scheduled_date,
          type,
          session_details (
            session_detail_id,
            exercise_id,
            exercises!inner (
              exercise_id,
              name,
              category
            ),
            exercise_logs (
              log_id,
              actual_sets,
              actual_reps,
              weight_kg,
              duration_seconds
            )
          )
        `)
        .eq('user_id', user_id)
        .eq('completed', true)
        .gte('scheduled_date', startISO)
        .lt('scheduled_date', endISO)
        .order('scheduled_date', { ascending: true });

      if (workoutsErr) {
        return NextResponse.json(
          { message: 'Failed to fetch workouts.', error: workoutsErr.message },
          { status: 500 }
        );
      }

      const sessions = (workoutsRaw as unknown as WorkoutSession[]) ?? [];
      const workoutsByDate: Record<string, WorkoutByDate> = {};

      for (const s of sessions) {
        const dateStr =
          typeof s.scheduled_date === 'string'
            ? s.scheduled_date.split('T')[0]
            : (s.scheduled_date as unknown as Date).toISOString().split('T')[0];

        if (!workoutsByDate[dateStr]) {
          workoutsByDate[dateStr] = { type: s.type ?? null, exercises: [] };
        }

        const details = s.session_details ?? [];
        for (const sd of details) {
          const logs = sd.exercise_logs ?? [];
          for (const el of logs) {
            workoutsByDate[dateStr].exercises.push({
              exercise_name: sd.exercises?.name ?? null,
              exercise_category: sd.exercises?.category ?? null,
              actual_sets: el.actual_sets,
              actual_reps: el.actual_reps,
              weight_kg: el.weight_kg,
              duration_seconds: el.duration_seconds,
              log_id: el.log_id,
            } as ExerciseLog);
          }
        }
      }

      // Calculate GR score per day in the month
      const dailyGrScores: { date: string; gr_score: number }[] = [];

      for (let d = new Date(startDate); d < endDate; d.setDate(d.getDate() + 1)) {
        const iso = d.toISOString().split('T')[0];
        const workoutForDay = workoutsByDate[iso];

        let grScore = 0;
        if (workoutForDay && workoutForDay.exercises.length > 0) {
          grScore = calculateSessionGR(
            workoutForDay.exercises.map((ex) => ({
              actual_sets: ex.actual_sets,
              actual_reps: ex.actual_reps,
              weight_kg: ex.weight_kg ?? 0,
              exercise_category: ex.exercise_category ?? 'unknown',
            }))
          );
        }

        // Only include days that have a non-zero GR score
        if (grScore > 0) {
          dailyGrScores.push({
            date: iso,
            gr_score: Math.round(grScore),
          });
        }
      }

      return NextResponse.json(
        dailyGrScores,
        { status: 200 }
      );
    } catch (err) {
      return NextResponse.json(
        { message: 'Failed to calculate daily GR scores.', error: (err as Error).message },
        { status: 500 }
      );
    }
  }

  // Default behavior: return all progress summaries
  const { data, error } = await supabase
    .from('user_progress_summary')
    .select('*')
    .order('period_start', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}
