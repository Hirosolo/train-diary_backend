# Train Diary Backend

A comprehensive fitness tracking backend API built with Next.js, providing endpoints for workout management, nutrition logging, progress tracking, and user authentication.

## 📋 Table of Contents

- [Overview](#overview)
- [Technologies](#technologies)
- [System Architecture](#system-architecture)
- [Features](#features)
- [API Endpoints](#api-endpoints)
- [System Workflows](#system-workflows)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)

## 🎯 Overview

Train Diary Backend is a RESTful API service designed to help users track their fitness journey. It provides comprehensive functionality for:

- **User Authentication**: Secure registration and login with JWT tokens
- **Workout Management**: Create, track, and manage workout sessions with exercise logging
- **Nutrition Tracking**: Log meals, calculate daily macronutrient intake, and track food consumption
- **Progress Analytics**: Generate weekly/monthly summaries with GR (Growth Rate) scores
- **Workout Plans**: Apply predefined workout plans to user schedules

## 🛠 Technologies

### Core Framework
- **Next.js 15.5.4** - React framework with App Router and API routes
- **TypeScript 5** - Type-safe development
- **React 19.1.0** - UI library (for API routes structure)

### Database & Backend Services
- **Supabase** - PostgreSQL database with real-time capabilities
- **PostgreSQL (via Supabase)** - Relational database for data persistence

### Authentication & Security
- **JWT (jsonwebtoken)** - Token-based authentication
- **bcryptjs** - Password hashing and verification

### API Documentation
- **Swagger UI** - Interactive API documentation
- **swagger-jsdoc** - API documentation generation

### Development Tools
- **ESLint** - Code linting and quality assurance
- **Tailwind CSS 4** - Utility-first CSS framework
- **Turbopack** - Fast bundler for development

## 🏗 System Architecture

### Project Structure

```
train-diary_backend/
├── src/
│   ├── app/
│   │   ├── api/              # API route handlers
│   │   │   ├── auth/        # Authentication endpoints
│   │   │   ├── exercises/   # Exercise management
│   │   │   ├── foods/       # Food database management
│   │   │   ├── food-logs/   # Meal logging and nutrition
│   │   │   ├── meal-details/# Meal detail operations
│   │   │   ├── progress/    # Progress tracking
│   │   │   ├── summary/     # Summary generation
│   │   │   ├── users/       # User management
│   │   │   ├── workout-plans/    # Workout plan management
│   │   │   ├── workout-sessions/ # Workout session tracking
│   │   │   └── docs/        # Swagger API documentation
│   │   └── utils/           # Utility functions
│   ├── lib/
│   │   └── supabaseClient.ts # Supabase client configuration
│   ├── middleware.ts        # CORS and request handling
│   └── types/
│       └── datatypes.ts     # TypeScript type definitions
├── public/                  # Static assets
└── package.json
```

### Architecture Patterns

1. **RESTful API Design**: Standard HTTP methods (GET, POST, PUT, DELETE) for resource operations
2. **Route Handlers**: Next.js App Router API routes for endpoint definitions
3. **Middleware**: Global CORS handling and request normalization
4. **Type Safety**: Comprehensive TypeScript interfaces for all data models

## ✨ Features

### Authentication & User Management
- User registration with email validation
- Secure password hashing using bcrypt
- JWT token-based authentication (7-day expiration)
- User profile management

### Workout Management
- Exercise database with categories and default sets/reps
- Workout session creation and scheduling
- Exercise logging with sets, reps, weight, and duration
- Workout plan application to user schedules
- Session completion tracking

### Nutrition Tracking
- Food database with nutritional information (calories, protein, carbs, fat)
- Meal logging with multiple food items
- Daily macronutrient calculation
- Meal detail nutrition breakdown
- Food consumption tracking by date

### Progress Analytics
- **GR (Growth Rate) Score Calculation**: Custom algorithm based on:
  - Reps score (optimal range: 8-12 reps)
  - Sets score (optimal range: 3-4 sets)
  - Weight component (logarithmic scaling)
  - Exercise category multipliers
- Weekly and monthly progress summaries
- Daily intake summaries
- Workout completion statistics

### API Documentation
- Interactive Swagger UI at `/api/docs`
- Comprehensive endpoint documentation
- Request/response examples

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate and receive JWT token

### Exercises
- `GET /api/exercises` - Get all exercises
- `POST /api/exercises` - Add a new exercise
- `DELETE /api/exercises` - Delete an exercise

### Foods
- `GET /api/foods` - Get all foods or a specific food
- `POST /api/foods` - Add a new food item
- `PUT /api/foods` - Update a food item
- `DELETE /api/foods` - Delete a food item

### Food Logs
- `GET /api/food-logs` - Get user's meal logs
- `POST /api/food-logs` - Log a new meal
- `PUT /api/food-logs` - Update a meal log
- `DELETE /api/food-logs` - Delete a meal log
- `GET /api/food-logs/daily-intake` - Calculate daily nutrition totals

### Meal Details
- `GET /api/meal-details` - Get meal detail by ID
- `GET /api/meal-details/nutrition` - Calculate nutrition for a meal

### Workout Sessions
- `GET /api/workout-sessions` - Get sessions (list or detailed)
- `POST /api/workout-sessions` - Create session, add exercise, or log set
- `PUT /api/workout-sessions` - Update session or exercise details
- `DELETE /api/workout-sessions` - Delete session, exercise, or log

### Workout Plans
- `GET /api/workout-plans` - Get all plans or a specific plan
- `POST /api/workout-plans` - Apply a plan to user's schedule

### Progress & Summary
- `GET /api/progress` - Get progress summaries or daily GR scores
- `GET /api/summary` - Get user's fitness and nutrition summary
- `POST /api/summary` - Generate and save a new summary

### Users
- `GET /api/users` - Get all users

### Documentation
- `GET /api/docs` - Interactive Swagger API documentation

## 🔄 System Workflows

### Authentication Flow

1. **Registration**:
   ```
   User submits → Validate input → Check email uniqueness → 
   Hash password → Store in Supabase → Return success
   ```

2. **Login**:
   ```
   User submits credentials → Fetch user from DB → 
   Verify password (bcrypt) → Generate JWT → Return token + user info
   ```

### Workout Tracking Flow

1. **Create Workout Session**:
   ```
   User creates session → Add exercises to session → 
   Log sets/reps/weight → Calculate GR score → Mark complete
   ```

2. **GR Score Calculation**:
   ```
   Exercise logs → Calculate reps score → Calculate sets score → 
   Apply weight (log₂) → Apply category multiplier → 
   Sum all exercises → Return total GR score
   ```

3. **Apply Workout Plan**:
   ```
   Select plan → Specify start date → 
   Create sessions for each plan day → Schedule in user calendar
   ```

### Nutrition Tracking Flow

1. **Log Meal**:
   ```
   Select foods → Specify amounts (grams) → 
   Create meal entry → Calculate nutrition per food → 
   Store meal details → Return meal with nutrition
   ```

2. **Daily Intake Calculation**:
   ```
   Query meals for date → Aggregate all food items → 
   Calculate total calories, protein, carbs, fat → 
   Return daily summary
   ```

3. **Meal Nutrition Breakdown**:
   ```
   Get meal details → For each food: 
   (amount_grams / 100) × nutritional_value → 
   Return per-food nutrition breakdown
   ```

### Progress Summary Flow

1. **Generate Summary**:
   ```
   Specify period (weekly/monthly) → Query workouts → 
   Query meals → Calculate totals → 
   Generate GR scores → Store summary → Return results
   ```

2. **Daily GR Scores**:
   ```
   Query completed sessions for month → 
   Calculate GR for each session → 
   Group by date → Return daily GR scores
   ```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Environment variables configured (see below)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd train-diary_backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory with the required variables (see [Environment Variables](#environment-variables))

4. **Run the development server**:
   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:3000`

5. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

## 🔐 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# JWT Secret (for token signing)
JWT_SECRET=your_jwt_secret_key

# API Host (optional, for Swagger documentation)
NEXT_PUBLIC_API_HOST=https://your-api-domain.com
```

### Environment Variable Descriptions

- **SUPABASE_URL**: Your Supabase project URL (found in Supabase dashboard)
- **SUPABASE_ANON_KEY**: Your Supabase anonymous/public key
- **JWT_SECRET**: A secure random string for signing JWT tokens (use a strong secret in production)
- **NEXT_PUBLIC_API_HOST**: Optional. Your API hostname for Swagger documentation (omit for relative paths)

## 📚 API Documentation

Interactive API documentation is available at:

```
http://localhost:3000/api/docs
```

The Swagger UI provides:
- Complete endpoint documentation
- Request/response schemas
- Example payloads
- Try-it-out functionality

## 🗄 Database Schema

The application uses Supabase (PostgreSQL) with the following main entities:

- **users**: User accounts and authentication
- **exercises**: Exercise database with categories
- **foods**: Food database with nutritional information
- **workout_sessions**: Scheduled and completed workout sessions
- **session_details**: Exercises within a workout session
- **exercise_logs**: Actual sets, reps, and weights performed
- **user_meals**: Meal logs by user and date
- **user_meal_details**: Individual food items in meals
- **workout_plans**: Predefined workout programs
- **plan_days**: Days within a workout plan
- **plan_day_exercises**: Exercises for each plan day
- **user_progress_summaries**: Aggregated progress data

## 🔒 Security Features

- **Password Hashing**: All passwords are hashed using bcrypt with salt rounds of 10
- **JWT Authentication**: Secure token-based authentication with 7-day expiration
- **CORS Protection**: Configured CORS middleware with allowed origins
- **Input Validation**: Request validation for required fields
- **Error Handling**: Comprehensive error handling with appropriate HTTP status codes

## 🧮 GR Score Algorithm

The Growth Rate (GR) score is calculated using the following formula:

```
GR = RepsScore × SetsScore × log₂(Weight + 1) × ExerciseMultiplier
```

### Scoring Components

- **RepsScore**:
  - 8-12 reps: 1.0 (optimal)
  - 6-7 or 13-14 reps: 0.75
  - Other: 0.5

- **SetsScore**:
  - 3-4 sets: 1.0 (optimal)
  - 2 or 5 sets: 0.75
  - Other: 0.5

- **Weight Component**: Logarithmic scaling using `log₂(weight_kg + 1)`

- **Exercise Multipliers**:
  - Shoulders: 1.3
  - Legs: 1.25
  - Back: 1.2
  - Chest: 1.15
  - Arms: 1.1
  - Core: 1.0

## 🛠 Development

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Code Structure

- **API Routes**: Located in `src/app/api/` following Next.js App Router conventions
- **Type Definitions**: Centralized in `src/types/datatypes.ts`
- **Utilities**: Helper functions in `src/app/utils/`
- **Middleware**: Global middleware in `src/middleware.ts`

## 📝 Notes

- The API uses Next.js API routes, which are serverless functions
- CORS is handled globally via middleware
- All database operations use Supabase client
- JWT tokens should be included in the `Authorization` header for protected routes
- Date formats should be ISO 8601 (YYYY-MM-DD)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

[Add your license information here]

---

For more information, visit the [API Documentation](/api/docs) or contact the development team.
