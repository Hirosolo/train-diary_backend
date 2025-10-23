export interface ExerciseLog {
  log_id: number;
  session_detail_id?: number;
  actual_sets: number;
  actual_reps: number;
  weight_kg?: number | null;
  duration_seconds?: number | null;
  notes?: string | null;
  exercise_name?: string | null;
  exercise_category?: string | null;
}

export interface Exercise {
  exercise_id: number;
  name: string;
  category?: string | null;
  default_sets?: number | null;
  default_reps?: number | null;
  description?: string | null;
}

export interface SessionDetail {
  session_detail_id: number;
  session_id?: number;
  exercise_id: number;
  planned_sets?: number | null;
  planned_reps?: number | null;
  exercises?: Exercise;
  exercise_logs?: ExerciseLog[];
}

export interface WorkoutSession {
  session_id: number;
  user_id?: number;
  scheduled_date: string; // ISO date string (YYYY-MM-DD)
  type?: string | null;
  notes?: string | null;
  completed?: boolean;
  session_details?: SessionDetail[];
}

/** ---------- Nutrition & Meals ---------- **/

export interface Food {
  food_id: number;
  name: string;
  calories_per_serving: number;
  protein_per_serving: number;
  carbs_per_serving: number;
  fat_per_serving: number;
  serving_type?: string;
  image?: string | null;
}

export interface UserMealDetail {
  meal_detail_id: number;
  meal_id?: number;
  food_id: number;
  amount_grams: number;
  foods?: Food;
}

export interface UserMeal {
  meal_id: number;
  user_id?: number;
  meal_type: string;
  log_date: string; // ISO date string
  user_meal_details?: UserMealDetail[];
}

/** ---------- Progress Summary ---------- **/

export interface UserProgressSummary {
  summary_id?: number;
  user_id: number;
  period_type: "weekly" | "monthly";
  period_start: string; // ISO date string
  total_workouts?: number;
  total_calories_burned?: number;
  avg_duration_minutes?: number;
  total_calories_intake?: number;
  avg_protein?: number;
  avg_carbs?: number;
  avg_fat?: number;
  total_gr_score?: number;
  avg_gr_score?: number;
}

/** ---------- Daily Summary ---------- **/

export interface DailySummary {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  workouts: number;
  gr_score: number;
}

/** ---------- Utility Aggregates ---------- **/

export interface WorkoutByDate {
  type: string | null;
  exercises: ExerciseLog[];
  total_gr?: number;
}
