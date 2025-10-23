import { NextResponse } from "next/server";
import { supabase } from "lib/supabaseClient";
import { calculateSessionGR } from "app/utils/grCalculator";
import type {
  WorkoutSession,
  UserMeal,
  ExerciseLog,
  DailySummary,
  WorkoutByDate,
  UserProgressSummary,
} from "types/datatypes";

/** ---------- Helper: Generate summary data for a user ---------- **/

async function generateSummaryPayload(
  user_id: number,
  period_type: "weekly" | "monthly",
  period_start: string
) {
  const periodDays = period_type === "weekly" ? 7 : 30;

  // Compute date range
  const startDate = new Date(period_start);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + periodDays);
  const startISO = startDate.toISOString().split("T")[0];
  const endISO = endDate.toISOString().split("T")[0];

  /** ---------- 1. Fetch completed workouts within period ---------- **/
  const { data: workoutsRaw, error: workoutsErr } = await supabase
    .from("workout_sessions")
    .select(
      `
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
    `
    )
    .eq("user_id", user_id)
    .eq("completed", true)
    .gte("scheduled_date", startISO)
    .lt("scheduled_date", endISO)
    .order("scheduled_date", { ascending: true });

  if (workoutsErr) throw workoutsErr;

  // Safe cast through unknown to satisfy TS
  const sessions = (workoutsRaw as unknown as WorkoutSession[]) ?? [];
  const total_workouts = sessions.length;
  let total_duration_seconds = 0;
  const workoutsByDate: Record<string, WorkoutByDate> = {};

  for (const s of sessions) {
    const dateStr =
      typeof s.scheduled_date === "string"
        ? s.scheduled_date.split("T")[0]
        : (s.scheduled_date as Date).toISOString().split("T")[0];

    if (!workoutsByDate[dateStr])
      workoutsByDate[dateStr] = { type: s.type ?? null, exercises: [] };

    const details = s.session_details ?? [];
    for (const sd of details) {
      const logs = sd.exercise_logs ?? [];
      for (const el of logs) {
        if (el.duration_seconds)
          total_duration_seconds += Number(el.duration_seconds);
        workoutsByDate[dateStr].exercises.push({
          exercise_name: sd.exercises?.name ?? null,
          exercise_category: sd.exercises?.category ?? null,
          actual_sets: el.actual_sets,
          actual_reps: el.actual_reps,
          weight_kg: el.weight_kg,
          duration_seconds: el.duration_seconds,
        } as unknown as ExerciseLog);
      }
    }
  }

  const total_duration_minutes = Math.round(total_duration_seconds / 60);

  /** ---------- 2. Fetch user meal logs within period ---------- **/
  const { data: mealsRaw, error: mealsErr } = await supabase
    .from("user_meals")
    .select(
      `
      meal_id,
      log_date,
      meal_type,
      user_meal_details (
        meal_detail_id,
        amount_grams,
        foods!inner (
          food_id,
          calories_per_serving,
          protein_per_serving,
          carbs_per_serving,
          fat_per_serving
        )
      )
    `
    )
    .eq("user_id", user_id)
    .gte("log_date", startISO)
    .lt("log_date", endISO);

  if (mealsErr) throw mealsErr;

  /** ---------- 3. Aggregate total + average nutrition ---------- **/
  let total_calories_intake = 0;
  let total_protein = 0;
  let total_carbs = 0;
  let total_fat = 0;

  const meals = (mealsRaw as unknown as UserMeal[]) ?? [];
  for (const m of meals) {
    const details = m.user_meal_details ?? [];
    for (const d of details) {
      const f = d.foods;
      if (!f) continue;
      const grams = Number(d.amount_grams ?? 0);
      total_calories_intake += f.calories_per_serving * grams;
      total_protein += f.protein_per_serving * grams;
      total_carbs += f.carbs_per_serving * grams;
      total_fat += f.fat_per_serving * grams;
    }
  }

  const avg_protein = Math.round(total_protein / periodDays);
  const avg_carbs = Math.round(total_carbs / periodDays);
  const avg_fat = Math.round(total_fat / periodDays);
  total_calories_intake = Math.round(total_calories_intake);

  /** ---------- 4. Calculate GR score per workout day ---------- **/
  let total_gr_score = 0;
  let workout_count = 0;
  for (const [, w] of Object.entries(workoutsByDate)) {
    const dailyGR = calculateSessionGR(
      w.exercises.map((ex) => ({
        ...ex,
        weight_kg: ex.weight_kg ?? 0, // ensure number
        exercise_category: ex.exercise_category ?? "unknown", // ensure string
      }))
    );

    w.total_gr = dailyGR;
    total_gr_score += dailyGR;
    if (dailyGR > 0) workout_count++;
  }
  const avg_gr_score = workout_count > 0 ? total_gr_score / workout_count : 0;

  /** ---------- 5. Upsert summary record ---------- **/
  const upsertPayload: UserProgressSummary = {
    user_id,
    period_type,
    period_start: startISO,
    total_workouts,
    total_calories_burned: 0,
    avg_duration_minutes: total_duration_minutes,
    total_calories_intake,
    avg_protein,
    avg_carbs,
    avg_fat,
    total_gr_score,
    avg_gr_score,
  };

  const { error: upsertErr } = await supabase
    .from("user_progress_summary")
    .upsert(upsertPayload, { onConflict: "user_id,period_type,period_start" });

  if (upsertErr) throw upsertErr;

  /** ---------- 6. Build daily summaries ---------- **/
  const dailySummaries: Record<string, DailySummary> = {};
  for (let d = new Date(startDate); d < endDate; d.setDate(d.getDate() + 1)) {
    const iso = d.toISOString().split("T")[0];
    dailySummaries[iso] = {
      date: iso,
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      workouts: 0,
      gr_score: 0,
    };
  }

  for (const m of meals) {
    const day =
      typeof m.log_date === "string"
        ? m.log_date
        : (m.log_date as Date).toISOString().split("T")[0];
    let dayCalories = 0,
      dayProtein = 0,
      dayCarbs = 0,
      dayFat = 0;
    const details = m.user_meal_details ?? [];
    for (const d of details) {
      const f = d.foods;
      if (!f) continue;
      const grams = Number(d.amount_grams ?? 0);
      dayCalories += f.calories_per_serving * grams;
      dayProtein += f.protein_per_serving * grams;
      dayCarbs += f.carbs_per_serving * grams;
      dayFat += f.fat_per_serving * grams;
    }
    if (dailySummaries[day]) {
      dailySummaries[day].calories = Math.round(dayCalories);
      dailySummaries[day].protein = Math.round(dayProtein);
      dailySummaries[day].carbs = Math.round(dayCarbs);
      dailySummaries[day].fat = Math.round(dayFat);
    }
  }

  for (const [date, w] of Object.entries(workoutsByDate)) {
    if (dailySummaries[date]) {
      dailySummaries[date].workouts = w.exercises.length > 0 ? 1 : 0;
      dailySummaries[date].gr_score = Math.round(w.total_gr ?? 0);
    }
  }

  const dailyData = Object.values(dailySummaries).sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  return {
    total_workouts,
    total_calories_intake,
    avg_protein,
    avg_carbs,
    avg_fat,
    total_duration_minutes,
    total_gr_score,
    avg_gr_score,
    dailyData,
  };
}

/** ---------- POST: Generate new summary ---------- **/
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_id, period_type, period_start } = body;

    if (!user_id || !period_type || !period_start) {
      return NextResponse.json(
        { message: "user_id, period_type, and period_start are required." },
        { status: 400 }
      );
    }

    const payload = await generateSummaryPayload(
      Number(user_id),
      period_type,
      period_start
    );
    return NextResponse.json(payload, { status: 201 });
  } catch (err) {
    console.error("Failed to generate summary:", err);
    return NextResponse.json(
      { message: "Failed to generate summary.", error: (err as Error).message },
      { status: 500 }
    );
  }
}

/** ---------- GET: Retrieve or regenerate summary ---------- **/
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const user_id = url.searchParams.get("user_id");
    const period_type = url.searchParams.get("period_type") as
      | "weekly"
      | "monthly"
      | null;
    const period_start = url.searchParams.get("period_start");

    if (!user_id || !period_type || !period_start) {
      return NextResponse.json(
        { message: "user_id, period_type, and period_start are required." },
        { status: 400 }
      );
    }

    const payload = await generateSummaryPayload(
      Number(user_id),
      period_type,
      period_start
    );
    return NextResponse.json(payload, { status: 200 });
  } catch (err) {
    console.error("Failed to get summary:", err);
    return NextResponse.json(
      { message: "Failed to get summary.", error: (err as Error).message },
      { status: 500 }
    );
  }
}
