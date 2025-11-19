import { NextResponse } from "next/server";

const apiHost = process.env.NEXT_PUBLIC_API_HOST;

const messageResponse = (description: string, example?: string) => ({
  description,
  schema: {
    type: "object",
    properties: {
      message: { type: "string", example },
    },
  },
});

const errorResponse = (description: string, example?: string) => ({
  description,
  schema: {
    type: "object",
    properties: {
      error: { type: "string", example },
    },
  },
});

const spec = {
  swagger: "2.0",
  info: {
    title: "Train Diary API",
    version: "1.0.0",
    description: "API documentation for Train Diary application",
  },
  host: apiHost?.replace(/^https?:\/\//, ""),
  basePath: "/api",
  schemes: ["https", "http"],
  consumes: ["application/json"],
  produces: ["application/json"],
  tags: [
    { name: "Authentication", description: "Authentication endpoints" },
    { name: "Exercises", description: "Exercise management endpoints" },
    { name: "Foods", description: "Food management endpoints" },
    { name: "Food Logs", description: "Food log (meal tracking) endpoints" },
    { name: "Workout Plans", description: "Workout plan management endpoints" },
    {
      name: "Workout Sessions",
      description: "Workout session management endpoints",
    },
    {
      name: "Summary",
      description: "User progress and statistics summary endpoints",
    },
    { name: "Users", description: "User lookup endpoints" },
  ],
  paths: {
    // --- AUTHENTICATION ---
    "/auth/login": {
      post: {
        tags: ["Authentication"],
        summary: "User login",
        description: "Authenticate a user with email and password and receive a JWT.",
        parameters: [
          {
            in: "body",
            name: "body",
            required: true,
            schema: {
              type: "object",
              required: ["email", "password"],
              properties: {
                email: { type: "string", example: "user@example.com" },
                password: { type: "string", example: "password123" },
              },
            },
          },
        ],
        responses: {
          200: {
            description: "Login successful",
            schema: {
              type: "object",
              properties: {
                token: {
                  type: "string",
                  example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                },
                user: {
                  type: "object",
                  properties: {
                    user_id: { type: "integer", example: 12 },
                    username: { type: "string", example: "trainee01" },
                    email: { type: "string", example: "user@example.com" },
                  },
                },
              },
            },
          },
          400: messageResponse("Email or password missing.", "Email and password required."),
          401: messageResponse("Invalid credentials.", "Wrong password."),
        },
      },
    },
    "/auth/register": {
      post: {
        tags: ["Authentication"],
        summary: "User registration",
        description: "Create a new user account.",
        parameters: [
          {
            in: "body",
            name: "body",
            required: true,
            schema: {
              type: "object",
              required: ["username", "email", "password"],
              properties: {
                username: { type: "string", example: "jack sparrow" },
                email: { type: "string", example: "kingofthesea@gmail.com" },
                password: { type: "string", example: "t123" },
              },
            },
          },
        ],
        responses: {
          201: messageResponse("Registration successful.", "User registered successfully."),
          400: messageResponse("Missing username, email, or password.", "All fields are required."),
          409: messageResponse("Email already registered.", "Email already in use."),
          500: messageResponse("Failed to register user."),
        },
      },
    },

    // --- USERS ---
    "/users": {
      get: {
        tags: ["Users"],
        summary: "List users",
        description: "Retrieve all users stored in the database.",
        responses: {
          200: {
            description: "Users fetched successfully.",
            schema: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  user_id: { type: "integer", example: 1 },
                  username: { type: "string", example: "trainee01" },
                  email: { type: "string", example: "trainee@example.com" },
                  created_at: {
                    type: "string",
                    format: "date-time",
                    example: "2025-01-01T12:00:00.000Z",
                  },
                },
              },
            },
          },
          500: errorResponse("Unexpected error while fetching users."),
        },
      },
    },

    // --- EXERCISES ---
    "/exercises": {
      get: {
        tags: ["Exercises"],
        summary: "Get all exercises",
        description: "Retrieve all exercises from the database.",
        responses: {
          200: {
            description: "Successfully retrieved list of exercises.",
            schema: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  exercise_id: { type: "integer", example: 1 },
                  name: { type: "string", example: "Bench Press" },
                  category: { type: "string", example: "Chest" },
                  default_sets: { type: "integer", example: 3 },
                  default_reps: { type: "integer", example: 10 },
                  description: {
                    type: "string",
                    example: "A compound exercise targeting the chest and triceps.",
                  },
                },
              },
            },
          },
          500: {
            description: "Failed to fetch exercises.",
            schema: {
              type: "object",
              properties: {
                data: { type: "array" },
                message: { type: "string", example: "Failed to fetch exercises." },
                error: { type: "string", example: "Database connection failed." },
              },
            },
          },
        },
      },
      post: {
        tags: ["Exercises"],
        summary: "Add a new exercise",
        parameters: [
          {
            in: "body",
            name: "body",
            required: true,
            schema: {
              type: "object",
              required: ["name"],
              properties: {
                name: { type: "string", example: "Squat" },
                category: { type: "string", example: "Legs" },
                default_sets: { type: "integer", example: 4 },
                default_reps: { type: "integer", example: 12 },
                description: {
                  type: "string",
                  example: "A compound lower body exercise targeting the quads and glutes.",
                },
              },
            },
          },
        ],
        responses: {
          201: {
            description: "Exercise successfully added.",
            schema: {
              type: "object",
              properties: {
                exercise_id: { type: "integer", example: 2 },
                message: { type: "string", example: "Exercise added." },
              },
            },
          },
          400: messageResponse("Missing exercise name.", "Exercise name is required."),
          409: messageResponse(
            "Exercise with the same name already exists.",
            "Exercise with this name already exists."
          ),
          500: {
            description: "Failed to add exercise.",
            schema: {
              type: "object",
              properties: {
                message: { type: "string", example: "Failed to add exercise." },
                error: { type: "string", example: "Database connection failed." },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Exercises"],
        summary: "Delete an exercise",
        parameters: [
          {
            in: "body",
            name: "exercise_id",
            required: true,
            schema: {
              type: "integer",
              example: 1,
              description: "ID of the exercise to delete.",
            },
          },
        ],
        responses: {
          200: {
            description: "Exercise successfully deleted.",
            schema: {
              type: "object",
              properties: {
                message: { type: "string", example: "Exercise deleted." },
              },
            },
          },
          400: messageResponse("Exercise ID missing or invalid.", "Exercise ID is required."),
          404: messageResponse("Exercise not found.", "Exercise not found."),
          500: {
            description: "Failed to delete exercise.",
            schema: {
              type: "object",
              properties: {
                message: { type: "string", example: "Failed to delete exercise." },
                error: { type: "string", example: "Database connection failed." },
              },
            },
          },
        },
      },
    },

    // --- FOODS ---
    "/foods": {
      get: {
        tags: ["Foods"],
        summary: "Get all foods or one (by query)",
        description: "Retrieve all foods or a single food by specifying the optional `food_id` query parameter.",
        parameters: [
          {
            name: "food_id",
            in: "query",
            required: false,
            type: "integer",
            description: "Optional: ID of the food to retrieve",
          },
        ],
        responses: {
          200: {
            description: "List of foods or a single food record.",
            schema: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  food_id: { type: "integer", example: 1 },
                  name: { type: "string", example: "Oatmeal" },
                  calories_per_serving: { type: "number", example: 68 },
                  protein_per_serving: { type: "number", example: 2.4 },
                  carbs_per_serving: { type: "number", example: 12 },
                  fat_per_serving: { type: "number", example: 1.4 },
                  serving_type: { type: "string", example: "100g" },
                  image: {
                    type: "string",
                    example: "https://example.com/images/oatmeal.jpg",
                  },
                },
              },
            },
          },
          404: errorResponse("Food not found.", "Food not found."),
          500: errorResponse("Failed to fetch foods."),
        },
      },
      post: {
        tags: ["Foods"],
        summary: "Add a new food item",
        parameters: [
          {
            in: "body",
            name: "body",
            required: true,
            schema: {
              type: "object",
              required: ["name", "serving_type"],
              properties: {
                name: { type: "string", example: "Oatmeal" },
                calories_per_serving: { type: "number", example: 68 },
                protein_per_serving: { type: "number", example: 2.4 },
                carbs_per_serving: { type: "number", example: 12 },
                fat_per_serving: { type: "number", example: 1.4 },
                serving_type: { type: "string", example: "100g" },
                image: {
                  type: "string",
                  example: "https://example.com/images/oatmeal.jpg",
                },
              },
            },
          },
        ],
        responses: {
          201: {
            description: "Food successfully added.",
            schema: {
              type: "object",
              properties: {
                food_id: { type: "integer", example: 12 },
                message: {
                  type: "string",
                  example: "Food added successfully.",
                },
                data: {
                  type: "object",
                  properties: {
                    food_id: { type: "integer" },
                    name: { type: "string" },
                    serving_type: { type: "string" },
                  },
                },
              },
            },
          },
          400: errorResponse(
            "Missing required fields.",
            "Missing required fields: name or serving_type."
          ),
          500: errorResponse("Failed to add food."),
        },
      },
      put: {
        tags: ["Foods"],
        summary: "Update a food item",
        parameters: [
          {
            in: "body",
            name: "body",
            required: true,
            schema: {
              type: "object",
              required: ["food_id"],
              properties: {
                food_id: { type: "integer", example: 1 },
                name: { type: "string", example: "Grilled Chicken Breast" },
                calories_per_serving: { type: "number", example: 165 },
              },
            },
          },
        ],
        responses: {
          200: {
            description: "Food updated successfully.",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "Food updated successfully.",
                },
                data: { type: "object" },
              },
            },
          },
          400: errorResponse("Missing food_id.", "Missing food_id for update."),
          404: errorResponse("Food not found.", "Food not found."),
          500: errorResponse("Failed to update food."),
        },
      },
      delete: {
        tags: ["Foods"],
        summary: "Delete a food item",
        parameters: [
          {
            in: "body",
            name: "body",
            required: true,
            schema: {
              type: "object",
              required: ["food_id"],
              properties: {
                food_id: { type: "integer", example: 1 },
              },
            },
          },
        ],
        responses: {
          200: messageResponse("Food deleted successfully.", "Food deleted successfully."),
          400: errorResponse("Missing food_id.", "Missing food_id for delete."),
          404: errorResponse("Food not found.", "Food not found."),
          500: errorResponse("Failed to delete food."),
        },
      },
    },

    // --- FOOD LOGS ---
    "/food-logs": {
      get: {
        tags: ["Food Logs"],
        summary: "Get all food logs or one (by query)",
        parameters: [
          {
            name: "user_id",
            in: "query",
            required: false,
            type: "integer",
            description: "Filter logs belonging to a specific user.",
          },
          {
            name: "meal_id",
            in: "query",
            required: false,
            type: "integer",
            description: "Optional: meal_id to get a single log.",
          },
        ],
        responses: {
          200: {
            description: "List of food logs with their meal details.",
            schema: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  meal_id: { type: "integer", example: 1 },
                  user_id: { type: "integer", example: 3 },
                  meal_type: { type: "string", example: "Lunch" },
                  log_date: { type: "string", example: "2025-10-23" },
                  user_meal_details: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        amount_grams: { type: "number", example: 150 },
                        foods: {
                          type: "object",
                          properties: {
                            name: { type: "string", example: "Rice" },
                            calories_per_serving: { type: "number", example: 130 },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          500: errorResponse("Failed to fetch food logs."),
        },
      },
      post: {
        tags: ["Food Logs"],
        summary: "Add a new food log (meal + foods)",
        parameters: [
          {
            in: "body",
            name: "body",
            required: true,
            schema: {
              type: "object",
              required: ["user_id", "meal_type", "log_date", "foods"],
              properties: {
                user_id: { type: "integer", example: 1 },
                meal_type: { type: "string", example: "Dinner" },
                log_date: { type: "string", example: "2025-10-23" },
                foods: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      food_id: { type: "integer", example: 2 },
                      amount_grams: { type: "number", example: 100 },
                    },
                  },
                },
              },
            },
          },
        ],
        responses: {
          200: {
            description: "Food log created successfully.",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "Food log created successfully.",
                },
                data: {
                  type: "object",
                  properties: {
                    meal_id: { type: "integer", example: 25 },
                    user_id: { type: "integer", example: 1 },
                    meal_type: { type: "string", example: "Dinner" },
                  },
                },
              },
            },
          },
          400: errorResponse(
            "Missing required fields.",
            "Missing required fields: user_id, meal_type, log_date, or foods."
          ),
          500: errorResponse("Failed to create food log."),
        },
      },
      put: {
        tags: ["Food Logs"],
        summary: "Update a food log (meal and foods)",
        parameters: [
          {
            in: "body",
            name: "body",
            required: true,
            schema: {
              type: "object",
              required: ["meal_id"],
              properties: {
                meal_id: { type: "integer", example: 3 },
                meal_type: { type: "string", example: "Breakfast" },
                log_date: { type: "string", example: "2025-10-24" },
                foods: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      food_id: { type: "integer", example: 5 },
                      amount_grams: { type: "number", example: 80 },
                    },
                  },
                },
              },
            },
          },
        ],
        responses: {
          200: messageResponse("Food log updated successfully."),
          400: errorResponse("Missing meal_id.", "Missing meal_id for update."),
          404: errorResponse("Meal not found.", "Meal not found."),
          500: errorResponse("Failed to update food log."),
        },
      },
      delete: {
        tags: ["Food Logs"],
        summary: "Delete a food log (and its details)",
        parameters: [
          {
            in: "body",
            name: "body",
            required: true,
            schema: {
              type: "object",
              required: ["meal_id"],
              properties: {
                meal_id: { type: "integer", example: 2 },
              },
            },
          },
        ],
        responses: {
          200: messageResponse("Food log deleted successfully."),
          400: errorResponse("Missing meal_id.", "Missing meal_id for delete."),
          404: errorResponse("Meal not found.", "Meal not found."),
          500: errorResponse("Failed to delete food log."),
        },
      },
    },

    // --- WORKOUT PLANS ---
    "/workout-plans": {
      get: {
        tags: ["Workout Plans"],
        summary: "Get all workout plans or plan details by ID",
        description:
          "Retrieve all workout plans (with duration in days) or detailed information about a specific plan using the `plan_id` query parameter.",
        parameters: [
          {
            name: "plan_id",
            in: "query",
            required: false,
            type: "integer",
            description: "Optional. ID of the plan to fetch detailed information for.",
          },
        ],
        responses: {
          200: {
            description:
              "Successfully retrieved list or details of plans. When `plan_id` is omitted the response is an array; otherwise it is a single plan object.",
            schema: {
              type: "object",
              properties: {
                plan_id: { type: "integer", example: 1 },
                name: { type: "string", example: "Beginner Strength" },
                description: { type: "string" },
                duration_days: { type: "integer", example: 4 },
                plan_days: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      plan_day_id: { type: "integer" },
                      day_number: { type: "integer" },
                      day_type: { type: "string" },
                      plan_day_exercises: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            exercise_id: { type: "integer" },
                            sets: { type: "integer" },
                            reps: { type: "integer" },
                          },
                        },
                      },
                    },
                  },
                },
              },
              additionalProperties: true,
            },
            examples: {
              "application/json": {
                list: [
                  {
                    plan_id: 1,
                    name: "Beginner Strength",
                    description: "Full body routine",
                    duration_days: 4,
                  },
                ],
                detail: {
                  plan_id: 2,
                  name: "Push/Pull/Legs",
                  description: "Three-day split",
                  duration_days: 3,
                  plan_days: [
                    {
                      plan_day_id: 10,
                      day_number: 1,
                      day_type: "Push",
                      plan_day_exercises: [
                        { exercise_id: 4, sets: 4, reps: 8 },
                        { exercise_id: 7, sets: 3, reps: 12 },
                      ],
                    },
                  ],
                },
              },
            },
          },
          404: errorResponse("Plan not found."),
          500: errorResponse("Failed to fetch plans."),
        },
      },
      post: {
        tags: ["Workout Plans"],
        summary: "Apply a workout plan for a user",
        description:
          "Assigns a workout plan to a user and automatically generates workout sessions and exercises according to the plan schedule.",
        parameters: [
          {
            in: "body",
            name: "body",
            required: true,
            schema: {
              type: "object",
              required: ["user_id", "plan_id", "start_date"],
              properties: {
                user_id: { type: "integer", example: 3 },
                plan_id: { type: "integer", example: 1 },
                start_date: { type: "string", example: "2025-10-25" },
              },
            },
          },
        ],
        responses: {
          201: messageResponse(
            "Plan successfully applied. Workout sessions created for user.",
            "Plan applied successfully. Workout sessions created."
          ),
          400: errorResponse(
            "Missing required fields or invalid input.",
            "user_id, plan_id, and start_date are required."
          ),
          404: errorResponse(
            "User or plan not found, or plan has no exercises.",
            "Plan has no exercises."
          ),
          500: errorResponse("Server or database error while applying the plan."),
        },
      },
    },

    // --- WORKOUT SESSIONS ---
    "/workout-sessions": {
      get: {
        tags: ["Workout Sessions"],
        summary: "Get workout sessions or session details",
        description: "Fetch all workout sessions for a user, or exercise/log details for a specific session.",
        parameters: [
          {
            name: "user_id",
            in: "query",
            type: "integer",
            description: "Filter sessions by user ID.",
          },
          {
            name: "session_id",
            in: "query",
            type: "integer",
            description: "Fetch details of a specific session.",
          },
        ],
        responses: {
          200: {
            description:
              "Successfully fetched sessions or session details. `sessions` is returned when filtering by `user_id`, while `details`/`logs` are returned when filtering by `session_id`.",
            schema: {
              type: "object",
              properties: {
                sessions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      session_id: { type: "integer", example: 10 },
                      user_id: { type: "integer", example: 1 },
                      scheduled_date: { type: "string", example: "2025-10-24" },
                      type: { type: "string", example: "Strength" },
                      notes: { type: "string" },
                      completed: { type: "boolean" },
                    },
                  },
                },
                details: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      session_detail_id: { type: "integer" },
                      exercise_id: { type: "integer" },
                      planned_sets: { type: "integer" },
                      planned_reps: { type: "integer" },
                      exercises: {
                        type: "object",
                        properties: {
                          name: { type: "string" },
                          category: { type: "string" },
                          description: { type: "string" },
                        },
                      },
                    },
                  },
                },
                logs: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      log_id: { type: "integer" },
                      session_detail_id: { type: "integer" },
                      actual_sets: { type: "integer" },
                      actual_reps: { type: "integer" },
                      weight_kg: { type: "number" },
                      duration_seconds: { type: "number" },
                      notes: { type: "string" },
                    },
                  },
                },
              },
              additionalProperties: true,
            },
          },
          400: errorResponse("Missing query parameter.", "user_id or session_id required."),
          500: messageResponse("Failed to fetch sessions or details."),
        },
      },

      post: {
        tags: ["Workout Sessions"],
        summary: "Create session / Add exercises / Log workout",
        description: "Multi-purpose endpoint that supports three different operations:\n\n**1. Create New Session** - Provide `user_id` and `scheduled_date`\n**2. Add Exercises** - Provide `session_id` and `exercises` array\n**3. Log Workout** - Provide `session_detail_id` and `log` object",
        parameters: [
          {
            in: "body",
            name: "body",
            required: true,
            schema: {
              type: "object",
              properties: {
                user_id: { type: "integer" },
                scheduled_date: { type: "string" },
                type: { type: "string" },
                notes: { type: "string" },
                session_id: { type: "integer" },
                exercises: { type: "array" },
                session_detail_id: { type: "integer" },
                log: { type: "object" },
              },
            },
            examples: {
              "Create Session": {
                value: {
                  user_id: 1,
                  scheduled_date: "2025-10-23",
                  type: "Strength",
                  notes: "Upper body focus"
                }
              },
              "Add Exercises": {
                value: {
                  session_id: 5,
                  exercises: [
                    {
                      exercise_id: 1,
                      planned_sets: 3,
                      planned_reps: 12
                    },
                    {
                      exercise_id: 2,
                      planned_sets: 4,
                      planned_reps: 10
                    }
                  ]
                }
              },
              "Log Workout": {
                value: {
                  session_detail_id: 12,
                  log: {
                    actual_sets: 3,
                    actual_reps: 12,
                    weight_kg: 70.5,
                    notes: "Felt strong today"
                  }
                }
              }
            }
          },
        ],
        responses: {
          201: {
            description: "Operation successful",
            schema: {
              type: "object",
              properties: {
                session_id: { type: "integer", example: 15 },
                message: { type: "string", example: "Session created successfully." },
              },
              additionalProperties: true,
            },
          },
          400: errorResponse("Invalid request payload.", "Invalid POST payload."),
          500: errorResponse("Server error processing request.", "Failed to create session."),
        },
      },

      put: {
        tags: ["Workout Sessions"],
        summary: "Mark session as completed",
        parameters: [
          {
            in: "body",
            name: "body",
            required: true,
            schema: {
              type: "object",
              required: ["session_id"],
              properties: {
                session_id: { type: "integer", example: 2 },
              },
            },
          },
        ],
        responses: {
          200: messageResponse("Session marked as completed.", "Session marked as completed successfully."),
          400: errorResponse(
            "Session missing or incomplete.",
            "All exercises must have at least one log before completion."
          ),
          500: errorResponse("Failed to mark session as completed."),
        },
      },

      delete: {
        tags: ["Workout Sessions"],
        summary: "Delete session, exercise, or log",
        description: "Deletes a workout session (and its details/logs), a single exercise, or a specific log entry.",
        parameters: [
          {
            in: "body",
            name: "body",
            required: true,
            schema: {
              type: "object",
              properties: {
                session_id: { type: "integer", example: 3 },
                session_detail_id: { type: "integer", example: 9 },
                log_id: { type: "integer", example: 15 },
              },
            },
          },
        ],
        responses: {
          200: messageResponse("Successfully deleted session, exercise, or log.", "Session deleted successfully."),
          400: errorResponse("Invalid delete parameters.", "Invalid delete parameters."),
          500: errorResponse("Failed to delete record.", "Failed to delete session."),
        },
      },
    },

    // --- SUMMARY ---
    "/summary": {
      get: {
        tags: ["Summary"],
        summary: "Get user's performance summary",
        description:
          "Generate and retrieve a user's workout and nutrition summary for a specified period (weekly or monthly), including aggregated metrics and daily breakdown.",
        parameters: [
          {
            name: "user_id",
            in: "query",
            required: true,
            type: "integer",
            description: "ID of the user to generate the summary for",
          },
          {
            name: "period_type",
            in: "query",
            required: true,
            type: "string",
            enum: ["weekly", "monthly"],
            description: "Type of summary period to generate",
          },
          {
            name: "period_start",
            in: "query",
            required: true,
            type: "string",
            format: "date",
            description: "Start date for the summary period (YYYY-MM-DD)",
          },
        ],
        responses: {
          200: {
            description: "Successfully generated and retrieved user summary data",
            schema: {
              type: "object",
              properties: {
                total_workouts: { type: "integer", example: 4 },
                total_calories_intake: { type: "number", example: 18500 },
                avg_protein: { type: "number", example: 120 },
                avg_carbs: { type: "number", example: 200 },
                avg_fat: { type: "number", example: 60 },
                total_duration_minutes: { type: "integer", example: 180 },
                total_gr_score: { type: "number", example: 320 },
                avg_gr_score: { type: "number", example: 80 },
                dailyData: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      date: { type: "string", example: "2025-10-20" },
                      calories: { type: "number", example: 2500 },
                      protein: { type: "number", example: 120 },
                      carbs: { type: "number", example: 200 },
                      fat: { type: "number", example: 70 },
                      workouts: { type: "integer", example: 1 },
                      gr_score: { type: "number", example: 82 },
                    },
                  },
                },
              },
            },
          },
          400: messageResponse(
            "Missing or invalid query parameters.",
            "user_id, period_type, and period_start are required."
          ),
          404: messageResponse("User not found.", "User not found."),
          500: {
            description: "Server error while generating summary data",
            schema: {
              type: "object",
              properties: {
                message: { type: "string", example: "Failed to get summary." },
                error: { type: "string", example: "Database error" },
              },
            },
          },
        },
      },
      post: {
        tags: ["Summary"],
        summary: "Generate new user summary",
        description: "Generate a new summary for a user's workout and nutrition data for a specified period.",
        parameters: [
          {
            in: "body",
            name: "body",
            required: true,
            schema: {
              type: "object",
              required: ["user_id", "period_type", "period_start"],
              properties: {
                user_id: { type: "integer", example: 1 },
                period_type: { type: "string", enum: ["weekly", "monthly"], example: "weekly" },
                period_start: { type: "string", format: "date", example: "2025-10-23" },
              },
            },
          },
        ],
        responses: {
          201: {
            description: "Successfully generated new summary",
            schema: {
              $ref: "#/paths/~1summary/get/responses/200/schema",
            },
          },
          400: messageResponse(
            "Missing or invalid parameters.",
            "user_id, period_type, and period_start are required."
          ),
          404: messageResponse("User not found.", "User not found."),
          500: {
            description: "Server error while generating summary.",
            schema: {
              type: "object",
              properties: {
                message: { type: "string", example: "Failed to generate summary." },
                error: { type: "string", example: "Database error" },
              },
            },
          },
        },
      },
    },

    // --- PROGRESS ---
    "/progress": {
      get: {
        tags: ["Summary"],
        summary: "Get all user progress summaries",
        description: "Retrieve all stored progress summaries ordered by period start date",
        responses: {
          200: {
            description: "Successfully retrieved progress summaries",
            schema: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  user_id: { type: "integer", example: 1 },
                  period_type: { type: "string", example: "weekly" },
                  period_start: { type: "string", format: "date", example: "2025-10-20" },
                  total_workouts: { type: "integer", example: 4 },
                  total_calories_burned: { type: "number", example: 0 },
                  avg_duration_minutes: { type: "integer", example: 45 },
                  total_calories_intake: { type: "number", example: 18500 },
                  avg_protein: { type: "number", example: 120 },
                  avg_carbs: { type: "number", example: 200 },
                  avg_fat: { type: "number", example: 60 },
                },
              },
            },
          },
          500: errorResponse("Server error while retrieving summaries."),
        },
      },
    },
  },
};

export async function GET() {
  try {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Train Diary API Documentation</title>
          <meta charset="utf-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css" />
          <style>
            .swagger-ui .examples-select { margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <div id="swagger-ui"></div>
          <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js" crossorigin></script>
          <script>
            window.onload = () => {
              window.ui = SwaggerUIBundle({
                spec: ${JSON.stringify(spec)},
                dom_id: '#swagger-ui',
                deepLinking: true,
                presets: [
                  SwaggerUIBundle.presets.apis,
                  SwaggerUIBundle.SwaggerUIStandalonePreset
                ],
              });
            };
          </script>
        </body>
      </html>
    `;

    return new Response(html, { 
      headers: { 
        "Content-Type": "text/html",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      } 
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error generating Swagger UI:", error);
    return NextResponse.json(
      { error: `Failed to generate API documentation: ${message}` },
      { status: 500 }
    );
  }
}