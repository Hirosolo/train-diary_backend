// Auto-generated interfaces from PostgreSQL schema

export interface DiaryEntry {
  id: number;
  user_id: number;
  title: string;
  content?: string | null;
  created_at: string; // ISO timestamp
  updated_at: string;
}

export interface ExerciseLog {
  log_id: number;
  session_detail_id: number;
  actual_sets: number;
  actual_reps: number;
  weight_kg?: number | null;
  duration_seconds?: number | null;
  notes?: string | null;
}

export interface Exercise {
  exercise_id: number;
  name: string;
  category?: string | null;
  default_sets?: number | null;
  default_reps?: number | null;
  description?: string | null;
}

export interface Food {
  food_id: number;
  name: string;
  calories_per_serving: number;
  protein_per_serving: number;
  carbs_per_serving: number;
  fat_per_serving: number;
  serving_type: string;
  image?: string | null;
}

export interface PlanDayExercise {
  plan_day_exercise_id: number;
  plan_day_id: number;
  exercise_id: number;
  sets?: number | null;
  reps?: number | null;
}

export interface PlanDay {
  plan_day_id: number;
  plan_id: number;
  day_number: number;
  day_type?: string | null;
}

export interface SessionDetail {
  session_detail_id: number;
  session_id: number;
  exercise_id: number;
  planned_sets?: number | null;
  planned_reps?: number | null;
}

export interface TrainingSession {
  id: number;
  user_id: number;
  session_date: string; // Date only (YYYY-MM-DD)
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserMealDetail {
  meal_detail_id: number;
  meal_id: number;
  food_id: number;
  amount_grams: number;
}

export interface UserMeal {
  meal_id: number;
  user_id: number;
  meal_type: string;
  log_date: string;
}

export interface UserProgressSummary {
  summary_id: number;
  user_id: number;
  period_type: 'weekly' | 'monthly';
  period_start: string;
  total_workouts?: number | null;
  total_calories_burned?: number | null;
  avg_duration_minutes?: number | null;
  total_calories_intake?: number | null;
  avg_protein?: number | null;
  avg_carbs?: number | null;
  avg_fat?: number | null;
}

export interface User {
  user_id: number;
  email: string;
  password_hash: string;
  created_at?: string | null;
  username?: string | null;
}

export interface WorkoutPlan {
  plan_id: number;
  name: string;
  description?: string | null;
}

export interface WorkoutSession {
  session_id: number;
  user_id: number;
  scheduled_date: string;
  type?: string | null;
  notes?: string | null;
  completed?: boolean | null;
}

