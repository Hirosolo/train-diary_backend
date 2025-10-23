-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE diary_entries (
  id integer NOT NULL DEFAULT nextval('diary_entries_id_seq'::regclass),
  user_id integer NOT NULL,
  title character varying NOT NULL,
  content text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT diary_entries_pkey PRIMARY KEY (id)
);
CREATE TABLE exercise_logs (
  log_id integer NOT NULL DEFAULT nextval('exercise_logs_log_id_seq'::regclass),
  session_detail_id integer NOT NULL,
  actual_sets integer NOT NULL,
  actual_reps integer NOT NULL,
  weight_kg real,
  duration_seconds integer,
  notes text,
  CONSTRAINT exercise_logs_pkey PRIMARY KEY (log_id),
  CONSTRAINT exercise_logs_session_detail_id_fkey FOREIGN KEY (session_detail_id) REFERENCES session_details(session_detail_id)
);
CREATE TABLE exercises (
  exercise_id integer NOT NULL DEFAULT nextval('exercises_exercise_id_seq'::regclass),
  name character varying NOT NULL,
  category character varying,
  default_sets integer,
  default_reps integer,
  description text,
  CONSTRAINT exercises_pkey PRIMARY KEY (exercise_id)
);
CREATE TABLE foods (
  food_id integer NOT NULL DEFAULT nextval('foods_food_id_seq'::regclass),
  name character varying NOT NULL,
  calories_per_serving real NOT NULL,
  protein_per_serving real NOT NULL,
  carbs_per_serving real NOT NULL,
  fat_per_serving real NOT NULL,
  serving_type character varying NOT NULL,
  image character varying,
  CONSTRAINT foods_pkey PRIMARY KEY (food_id)
);
CREATE TABLE plan_day_exercises (
  plan_day_exercise_id integer NOT NULL DEFAULT nextval('plan_day_exercises_plan_day_exercise_id_seq'::regclass),
  plan_day_id integer NOT NULL,
  exercise_id integer NOT NULL,
  sets integer,
  reps integer,
  CONSTRAINT plan_day_exercises_pkey PRIMARY KEY (plan_day_exercise_id),
  CONSTRAINT plan_day_exercises_plan_day_id_fkey FOREIGN KEY (plan_day_id) REFERENCES plan_days(plan_day_id),
  CONSTRAINT plan_day_exercises_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES exercises(exercise_id)
);
CREATE TABLE plan_days (
  plan_day_id integer NOT NULL DEFAULT nextval('plan_days_plan_day_id_seq'::regclass),
  plan_id integer NOT NULL,
  day_number integer NOT NULL,
  day_type character varying,
  CONSTRAINT plan_days_pkey PRIMARY KEY (plan_day_id),
  CONSTRAINT plan_days_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES workout_plans(plan_id)
);
CREATE TABLE session_details (
  session_detail_id integer NOT NULL DEFAULT nextval('session_details_session_detail_id_seq'::regclass),
  session_id integer NOT NULL,
  exercise_id integer NOT NULL,
  planned_sets integer,
  planned_reps integer,
  CONSTRAINT session_details_pkey PRIMARY KEY (session_detail_id),
  CONSTRAINT session_details_session_id_fkey FOREIGN KEY (session_id) REFERENCES workout_sessions(session_id),
  CONSTRAINT session_details_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES exercises(exercise_id)
);
CREATE TABLE training_sessions (
  id integer NOT NULL DEFAULT nextval('training_sessions_id_seq'::regclass),
  user_id integer NOT NULL,
  session_date date NOT NULL,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT training_sessions_pkey PRIMARY KEY (id)
);
CREATE TABLE user_meal_details (
  meal_detail_id integer NOT NULL DEFAULT nextval('user_meal_details_meal_detail_id_seq'::regclass),
  meal_id integer NOT NULL,
  food_id integer NOT NULL,
  amount_grams real NOT NULL,
  CONSTRAINT user_meal_details_pkey PRIMARY KEY (meal_detail_id),
  CONSTRAINT user_meal_details_meal_id_fkey FOREIGN KEY (meal_id) REFERENCES user_meals(meal_id),
  CONSTRAINT user_meal_details_food_id_fkey FOREIGN KEY (food_id) REFERENCES foods(food_id)
);
CREATE TABLE user_meals (
  meal_id integer NOT NULL DEFAULT nextval('user_meals_meal_id_seq'::regclass),
  user_id integer NOT NULL,
  meal_type character varying NOT NULL,
  log_date date NOT NULL,
  CONSTRAINT user_meals_pkey PRIMARY KEY (meal_id),
  CONSTRAINT user_meals_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(user_id)
);
CREATE TABLE user_progress_summary (
  summary_id integer NOT NULL DEFAULT nextval('user_progress_summary_summary_id_seq'::regclass),
  user_id integer NOT NULL,
  period_type character varying NOT NULL CHECK (period_type::text = ANY (ARRAY['weekly'::character varying, 'monthly'::character varying]::text[])),
  period_start date NOT NULL,
  total_workouts integer DEFAULT 0,
  total_calories_burned real DEFAULT 0,
  avg_duration_minutes real DEFAULT 0,
  total_calories_intake real DEFAULT 0,
  avg_protein real DEFAULT 0,
  avg_carbs real DEFAULT 0,
  avg_fat real DEFAULT 0,
  CONSTRAINT user_progress_summary_pkey PRIMARY KEY (summary_id),
  CONSTRAINT user_progress_summary_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(user_id)
);
CREATE TABLE users (
  user_id integer NOT NULL DEFAULT nextval('users_user_id_seq'::regclass),
  email character varying NOT NULL UNIQUE,
  password_hash character varying NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  username character varying,
  CONSTRAINT users_pkey PRIMARY KEY (user_id)
);
CREATE TABLE workout_plans (
  plan_id integer NOT NULL DEFAULT nextval('workout_plans_plan_id_seq'::regclass),
  name character varying NOT NULL,
  description text,
  CONSTRAINT workout_plans_pkey PRIMARY KEY (plan_id)
);
CREATE TABLE workout_sessions (
  session_id integer NOT NULL DEFAULT nextval('workout_sessions_session_id_seq'::regclass),
  user_id integer NOT NULL,
  scheduled_date date NOT NULL,
  type character varying,
  notes text,
  completed boolean DEFAULT false,
  CONSTRAINT workout_sessions_pkey PRIMARY KEY (session_id),
  CONSTRAINT workout_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(user_id)
);