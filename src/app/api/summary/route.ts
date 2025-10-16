import { NextResponse } from 'next/server'
import { supabase } from 'lib/supabaseClient'
import { calculateSessionGR } from 'app/utils/grCalculator'

export async function POST(req: Request) {
  const { user_id, period_type, period_start } = await req.json()

  if (!user_id || !period_type || !period_start) {
    return NextResponse.json(
      { message: 'user_id, period_type, and period_start are required.' },
      { status: 400 }
    )
  }

  const isWeekly = period_type === 'weekly'
  const periodEnd = new Date(period_start)
  periodEnd.setDate(periodEnd.getDate() + (isWeekly ? 7 : 30))

  try {
    // === WORKOUT DATA ===
    const { data: workoutsData, error: workoutError } = await supabase
      .from('workout_sessions')
      .select(`
        session_id,
        type,
        scheduled_date,
        completed,
        session_details(
          exercise_logs(
            actual_sets,
            actual_reps,
            weight_kg,
            duration_seconds
          ),
          exercises(
            name,
            category
          )
        )
      `)
      .eq('user_id', user_id)
      .eq('completed', true)
      .gte('scheduled_date', period_start)
      .lt('scheduled_date', periodEnd.toISOString().split('T')[0])

    if (workoutError) throw workoutError

    const workoutsByDate: Record<string, any[]> = {}
    let totalGR = 0

    for (const ws of workoutsData || []) {
      const date = ws.scheduled_date
      const exercises = (ws.session_details || []).flatMap((sd: any) =>
        (sd.exercise_logs || []).map((el: any) => ({
          ...el,
          exercise_category: sd.exercises?.category || '',
        }))
      )

      if (!workoutsByDate[date]) workoutsByDate[date] = []
      workoutsByDate[date].push(...exercises)
    }

    const dailyGR: Record<string, number> = {}
    for (const [date, logs] of Object.entries(workoutsByDate)) {
      const gr = calculateSessionGR(logs)
      dailyGR[date] = gr
      totalGR += gr
    }

    const totalWorkouts = Object.keys(workoutsByDate).length
    const avgGR = totalWorkouts > 0 ? totalGR / totalWorkouts : 0

    // === NUTRITION DATA ===
    const { data: nutritionData, error: nutritionError } = await supabase
      .from('user_meals')
      .select(`
        log_date,
        user_meal_details(
          servings:amount_grams,
          foods(
            calories_per_serving,
            protein_per_serving,
            carbs_per_serving,
            fat_per_serving
          )
        )
      `)
      .eq('user_id', user_id)
      .gte('log_date', period_start)
      .lt('log_date', periodEnd.toISOString().split('T')[0])

    if (nutritionError) throw nutritionError

    const dailyNutrition: Record<string, any> = {}
    let totalCalories = 0
    let totalProtein = 0
    let totalCarbs = 0
    let totalFat = 0

    for (const meal of nutritionData || []) {
      const date = meal.log_date
      if (!dailyNutrition[date])
        dailyNutrition[date] = { calories: 0, protein: 0, carbs: 0, fat: 0 }

      for (const detail of meal.user_meal_details || []) {
        const food = Array.isArray(detail.foods) ? detail.foods[0] : detail.foods
        if (!food) continue

        const s = detail.servings || 0
        dailyNutrition[date].calories += (food.calories_per_serving || 0) * s
        dailyNutrition[date].protein += (food.protein_per_serving || 0) * s
        dailyNutrition[date].carbs += (food.carbs_per_serving || 0) * s
        dailyNutrition[date].fat += (food.fat_per_serving || 0) * s
      }

      totalCalories += dailyNutrition[date].calories
      totalProtein += dailyNutrition[date].protein
      totalCarbs += dailyNutrition[date].carbs
      totalFat += dailyNutrition[date].fat
    }

    const numDays = Object.keys(dailyNutrition).length || (isWeekly ? 7 : 30)

    // === PREPARE RESPONSE ===
    const response = {
      total_workouts: totalWorkouts,
      total_calories_intake: Math.round(totalCalories),
      avg_protein: Math.round(totalProtein / numDays),
      avg_carbs: Math.round(totalCarbs / numDays),
      avg_fat: Math.round(totalFat / numDays),
      total_gr_score: Math.round(totalGR),
      avg_gr_score: Math.round(avgGR * 100) / 100,
      dailyData: Object.keys(dailyNutrition).map((date) => ({
        date,
        ...dailyNutrition[date],
        gr_score: dailyGR[date] || 0,
      })),
    }

    return NextResponse.json(response, { status: 201 })
  } catch (err: any) {
    console.error('Failed to generate summary:', err)
    return NextResponse.json(
      { message: 'Failed to generate summary.', error: err.message },
      { status: 500 }
    )
  }
}
