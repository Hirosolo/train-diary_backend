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
      message: { type: "string", example },
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
  // --- EDITED SECTION: Conditionally set host or omit it ---
  // If apiHost is set, remove the scheme. If not set (e.g., in a local dev environment), omit the host
  // property entirely to use relative paths, which often resolves 'Failed to fetch' in same-origin environments.
  ...(apiHost ? { host: apiHost.replace(/^https?:\/\//, "") } : {}),
  basePath: "/api",
  schemes: ["https", "http"],
  consumes: ["application/json"],
  produces: ["application/json"],
  tags: [
    {
      name: "Auth",
      description: "User authentication and authorization operations",
    },
  ],
  paths: {
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Logs in a user and returns a JWT token",
        description:
          "Authenticates a user using email and password, issuing a time-limited JSON Web Token (JWT).",
        parameters: [
          {
            name: "Login Credentials",
            in: "body",
            required: true,
            schema: {
              type: "object",
              properties: {
                email: {
                  type: "string",
                  format: "email",
                  example: "testuser@example.com",
                  description: "User's email address.",
                },
                password: {
                  type: "string",
                  format: "password",
                  example: "password123",
                  description: "User's password.",
                },
              },
              required: ["email", "password"],
            },
          },
        ],
        responses: {
          200: {
            description: "Successful login and JWT token retrieval",
            schema: {
              type: "object",
              properties: {
                token: {
                  type: "string",
                  description:
                    "The authentication JWT. This should be stored securely and used for subsequent requests.",
                },
                user: {
                  type: "object",
                  properties: {
                    user_id: { type: "string", example: "uuid-12345" },
                    username: { type: "string", example: "testuser" },
                    email: {
                      type: "string",
                      format: "email",
                      example: "testuser@example.com",
                    },
                  },
                },
              },
            },
          },
          400: errorResponse(
            "Bad Request: Missing email or password.",
            "Email and password required."
          ),
          401: errorResponse(
            "Unauthorized: Invalid credentials.",
            "User not found. "
          ),
          403: errorResponse(
            "Unauthorized: Invalid credentials.",
            "Wrong password."
          ),
        },
      },
    },
    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Registers a new user account",
        description:
          "Creates a new user account by accepting a username, email, and password. The password is hashed before storage.",
        parameters: [
          {
            name: "Registration Data",
            in: "body",
            required: true,
            schema: {
              type: "object",
              properties: {
                username: {
                  type: "string",
                  example: "newuser",
                  description: "Desired username.",
                },
                email: {
                  type: "string",
                  format: "email",
                  example: "newuser@example.com",
                  description: "User's unique email address.",
                },
                password: {
                  type: "string",
                  format: "password",
                  example: "securePassword123",
                  description: "Desired password.",
                },
              },
              required: ["username", "email", "password"],
            },
          },
        ],
        responses: {
          "201": {
            description: "User registered successfully.",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "User registered successfully.",
                },
              },
            },
          },
          "400": {
            description: "Bad Request: Missing required fields.",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "All fields are required.",
                },
              },
            },
          },
          "409": {
            description: "Conflict: Email already in use.",
            schema: {
              type: "object",
              properties: {
                message: { type: "string", example: "Email already in use." },
              },
            },
          },
          "500": {
            description: "Internal Server Error: Registration failed.",
            schema: {
              type: "object",
              properties: {
                message: { type: "string", example: "Registration failed." },
                error: {
                  type: "string",
                  description: "Database or server error message.",
                },
              },
            },
          },
        },
      },
    },
    "/exercises": {
      get: {
        tags: ["Exercises"],
        summary: "Retrieve all available exercises",
        description: "Fetches a list of all exercises stored in the database.",
        responses: {
          200: {
            description: "A list of exercises.",
            schema: {
              type: "array",
              items: {
                $ref: "#/definitions/Exercise",
              },
            },
          },
          500: errorResponse(
            "Internal Server Error: Failed to fetch data.",
            "Failed to fetch exercises."
          ),
        },
      },
      post: {
        tags: ["Exercises"],
        summary: "Add a new exercise",
        description:
          "Creates and stores a new exercise definition. Exercise name must be unique.",
        parameters: [
          {
            name: "New Exercise Object",
            in: "body",
            required: true,
            schema: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  example: "Deadlift",
                  description: "Name of the exercise (required).",
                },
                category: {
                  type: "string",
                  example: "Back/Hamstrings",
                  description: "Muscle group.",
                },
                default_sets: {
                  type: "integer",
                  example: 5,
                  description: "Suggested sets.",
                },
                default_reps: {
                  type: "integer",
                  example: 5,
                  description: "Suggested reps.",
                },
                description: {
                  type: "string",
                  description: "Instructions for the exercise.",
                },
              },
              required: ["name"],
            },
          },
        ],
        responses: {
          201: {
            description: "Exercise successfully added.",
            schema: {
              type: "object",
              properties: {
                exercise_id: { type: "string", example: "uuid-new-789" },
                message: { type: "string", example: "Exercise added." },
              },
            },
          },
          400: errorResponse(
            "Bad Request: Missing required field.",
            "Exercise name is required."
          ),
          409: errorResponse(
            "Conflict: Exercise name already exists.",
            "Exercise with this name already exists."
          ),
          500: errorResponse(
            "Internal Server Error: Failed to add exercise.",
            "Failed to add exercise."
          ),
        },
      },
      delete: {
        tags: ["Exercises"],
        summary: "Delete an exercise by ID",
        description:
          "Deletes a single exercise from the database using its unique ID.",
        parameters: [
          {
            name: "Exercise ID",
            in: "body",
            required: true,
            schema: {
              type: "string",
              example: "uuid-12345",
              description:
                "The unique ID of the exercise to delete (JSON body).",
            },
          },
        ],
        responses: {
          200: messageResponse(
            "Exercise successfully deleted.",
            "Exercise deleted."
          ),
          400: errorResponse(
            "Bad Request: Missing ID.",
            "Exercise ID is required."
          ),
          404: errorResponse(
            "Not Found: Exercise does not exist.",
            "Exercise not found."
          ),
          500: errorResponse(
            "Internal Server Error: Failed to delete exercise.",
            "Failed to delete exercise."
          ),
        },
      },
    },
    "/food-logs": {
      get: {
        tags: ["Food Logs"],
        summary: "Retrieve user's meal logs",
        description:
          "Fetches meal logs for a specific user, optionally filtered by meal ID or date.",
        parameters: [
          {
            name: "user_id",
            in: "query",
            required: true,
            type: "integer",
            description: "The ID of the user whose logs to retrieve.",
            example: 1,
          },
          {
            name: "meal_id",
            in: "query",
            required: false,
            type: "integer",
            description: "Optional: Filter for a specific meal ID.",
            example: 50,
          },
          {
            name: "date",
            in: "query",
            required: false,
            type: "string",
            format: "date",
            description:
              "Optional: Filter logs for a specific date (YYYY-MM-DD).",
            example: "2024-05-15",
          },
        ],
        responses: {
          200: {
            description: "A list of meal logs.",
            schema: {
              type: "array",
              items: {
                $ref: "#/definitions/UserMeal",
              },
            },
          },
          500: errorResponse(
            "Internal Server Error: Failed to fetch meals.",
            "Failed to fetch meals."
          ),
        },
      },
      post: {
        tags: ["Food Logs"],
        summary: "Log a new meal",
        description:
          "Creates a new meal log for a user, including the date, meal type, and associated food items with their amounts.",
        parameters: [
          {
            name: "New Meal Log",
            in: "body",
            required: true,
            schema: {
              type: "object",
              properties: {
                user_id: {
                  type: "integer",
                  example: 1,
                  description: "ID of the user logging the meal (required).",
                },
                meal_type: {
                  type: "string",
                  example: "Lunch",
                  description: "Type of meal (e.g., Breakfast) (required).",
                },
                log_date: {
                  type: "string",
                  format: "date",
                  example: "2024-05-15",
                  description: "Date of the meal (YYYY-MM-DD) (required).",
                },
                foods: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      food_id: {
                        type: "integer",
                        example: 1,
                        description: "ID of the food item.",
                      },
                      amount_grams: {
                        type: "number",
                        example: 150,
                        description: "Amount consumed in grams.",
                      },
                    },
                    required: ["food_id", "amount_grams"],
                  },
                  description:
                    "List of foods consumed in the meal (required, must not be empty).",
                },
              },
              required: ["user_id", "meal_type", "log_date", "foods"],
            },
          },
        ],
        responses: {
          200: messageResponse(
            "Food log created successfully.",
            "Food log created successfully."
          ),
          400: errorResponse(
            "Bad Request: Missing required field or invalid user.",
            "Missing required fields: user_id, meal_type, log_date, or foods."
          ),
          500: errorResponse(
            "Internal Server Error: Failed to create log.",
            "Failed to create meal log."
          ),
        },
      },
      put: {
        tags: ["Food Logs"],
        summary: "Update an existing meal log",
        description:
          "Updates the meal type, date, and/or replaces the entire list of foods associated with a specific meal ID. Foods array, if present, completely overwrites existing details.",
        parameters: [
          {
            name: "Update Meal Log",
            in: "body",
            required: true,
            schema: {
              type: "object",
              properties: {
                meal_id: {
                  type: "integer",
                  example: 50,
                  description: "ID of the meal log to update (required).",
                },
                meal_type: {
                  type: "string",
                  example: "Dinner",
                  description: "New meal type (optional).",
                },
                log_date: {
                  type: "string",
                  format: "date",
                  example: "2024-05-16",
                  description: "New log date (optional).",
                },
                foods: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      food_id: {
                        type: "integer",
                        example: 2,
                        description: "ID of the new food item.",
                      },
                      amount_grams: {
                        type: "number",
                        example: 200,
                        description: "Amount consumed in grams.",
                      },
                    },
                  },
                  description:
                    "New list of foods (optional; completely replaces old food details if provided).",
                },
              },
              required: ["meal_id"],
            },
          },
        ],
        responses: {
          200: messageResponse(
            "Food log updated successfully.",
            "Food log updated successfully."
          ),
          400: errorResponse(
            "Bad Request: Missing meal ID.",
            "Missing meal_id for update."
          ),
          404: errorResponse(
            "Not Found: Meal does not exist.",
            "Meal not found."
          ),
          500: errorResponse(
            "Internal Server Error: Failed to update log.",
            "Failed to update meal log."
          ),
        },
      },
      delete: {
        tags: ["Food Logs"],
        summary: "Delete a meal log",
        description:
          "Deletes a meal log and all its associated food details by meal ID.",
        parameters: [
          {
            name: "Meal ID",
            in: "body",
            required: true,
            schema: {
              type: "object",
              properties: {
                meal_id: {
                  type: "integer",
                  example: 50,
                  description: "ID of the meal log to delete (required).",
                },
              },
              required: ["meal_id"],
            },
          },
        ],
        responses: {
          200: messageResponse(
            "Food log deleted successfully.",
            "Food log deleted successfully."
          ),
          400: errorResponse(
            "Bad Request: Missing meal ID.",
            "Missing meal_id for delete."
          ),
          404: errorResponse(
            "Not Found: Meal does not exist.",
            "Meal not found."
          ),
          500: errorResponse(
            "Internal Server Error: Failed to delete log.",
            "Failed to delete meal log."
          ),
        },
      },
    },
    "/food-logs/daily-intake": {
      get: {
        tags: ["Food Logs"],
        summary: "Calculate daily total macronutrients and calories",
        description:
          "Calculates the total caloric and macronutrient intake (Protein, Carbs, Fat) for a specific user on a given date.",
        parameters: [
          {
            name: "user_id",
            in: "query",
            required: true,
            type: "integer",
            description: "The ID of the user for whom to calculate intake.",
            example: 1,
          },
          {
            name: "date",
            in: "query",
            required: true,
            type: "string",
            format: "date",
            description: "The date for the calculation (YYYY-MM-DD).",
            example: "2024-05-15",
          },
        ],
        responses: {
          200: {
            description: "Daily intake totals summary.",
            schema: {
              $ref: "#/definitions/DailyIntakeSummary",
            },
          },
          400: errorResponse(
            "Bad Request: Missing user_id or date.",
            "user_id and date are required."
          ),
          500: errorResponse(
            "Internal Server Error: Failed to calculate intake.",
            "Failed to calculate daily intake."
          ),
        },
      },
    },
    "/foods": {
      get: {
        tags: ["Foods"],
        summary: "Retrieve all food items or a specific food item",
        description:
          "Fetches a list of all available food items. Can be filtered by a specific food_id using a query parameter.",
        parameters: [
          {
            name: "food_id",
            in: "query",
            required: false,
            type: "integer",
            description: "Optional: ID of a specific food item to retrieve.",
            example: 1,
          },
        ],
        responses: {
          200: {
            description: "A list of food items or a single food item.",
            schema: {
              type: "array",
              items: {
                $ref: "#/definitions/Food",
              },
            },
          },
          404: errorResponse(
            "Not Found: Food item not found.",
            "Food not found."
          ),
          500: errorResponse(
            "Internal Server Error: Failed to fetch data.",
            "Failed to fetch foods."
          ),
        },
      },
      post: {
        tags: ["Foods"],
        summary: "Add a new food item",
        description:
          "Creates and stores a new food item definition with nutritional information.",
        parameters: [
          {
            name: "New Food Item",
            in: "body",
            required: true,
            schema: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  example: "Salmon Fillet",
                  description: "Name of the food (required).",
                },
                calories_per_serving: {
                  type: "number",
                  example: 208,
                  description: "Calories per 100g serving (required).",
                },
                protein_per_serving: {
                  type: "number",
                  example: 20,
                  description: "Protein grams per 100g serving (required).",
                },
                carbs_per_serving: {
                  type: "number",
                  example: 0,
                  description:
                    "Carbohydrate grams per 100g serving (required).",
                },
                fat_per_serving: {
                  type: "number",
                  example: 13,
                  description: "Fat grams per 100g serving (required).",
                },
                serving_type: {
                  type: "string",
                  example: "100 g",
                  description: "Unit used for serving sizes (required).",
                },
                image: {
                  type: "string",
                  format: "url",
                  description: "Optional URL for a food image.",
                },
              },
              required: [
                "name",
                "calories_per_serving",
                "protein_per_serving",
                "carbs_per_serving",
                "fat_per_serving",
                "serving_type",
              ],
            },
          },
        ],
        responses: {
          201: {
            description: "Food item successfully added.",
            schema: {
              type: "object",
              properties: {
                food_id: { type: "integer", example: 5 },
                message: {
                  type: "string",
                  example: "Food added successfully.",
                },
              },
            },
          },
          400: errorResponse(
            "Bad Request: Missing required field.",
            "Food name and nutritional details are required."
          ),
          409: errorResponse(
            "Conflict: Food name already exists.",
            "Food with this name already exists."
          ),
          500: errorResponse(
            "Internal Server Error: Failed to add food.",
            "Failed to add food."
          ),
        },
      },
      put: {
        tags: ["Foods"],
        summary: "Update an existing food item",
        description:
          "Updates details of an existing food item by ID. Any field not provided will remain unchanged.",
        parameters: [
          {
            name: "Update Food Item",
            in: "body",
            required: true,
            schema: {
              type: "object",
              properties: {
                food_id: {
                  type: "integer",
                  example: 1,
                  description: "ID of the food item to update (required).",
                },
                name: { type: "string", example: "Chicken Breast (Cooked)" },
                calories_per_serving: { type: "number", example: 180 },
                protein_per_serving: { type: "number", example: 34 },
                // ... other optional fields
              },
              required: ["food_id"],
            },
          },
        ],
        responses: {
          200: messageResponse(
            "Food item updated successfully.",
            "Food updated successfully."
          ),
          400: errorResponse(
            "Bad Request: Missing food ID.",
            "Missing food_id for update."
          ),
          404: errorResponse(
            "Not Found: Food does not exist.",
            "Food not found."
          ),
          500: errorResponse(
            "Internal Server Error: Failed to update food.",
            "Failed to update food."
          ),
        },
      },
      delete: {
        tags: ["Foods"],
        summary: "Delete a food item by ID",
        description:
          "Deletes a single food item from the database using its unique ID.",
        parameters: [
          {
            name: "Food ID",
            in: "body",
            required: true,
            schema: {
              type: "object",
              properties: {
                food_id: {
                  type: "integer",
                  example: 1,
                  description:
                    "The unique ID of the food item to delete (JSON body).",
                },
              },
              required: ["food_id"],
            },
          },
        ],
        responses: {
          200: messageResponse(
            "Food item successfully deleted.",
            "Food deleted successfully."
          ),
          400: errorResponse(
            "Bad Request: Missing ID.",
            "Food ID is required."
          ),
          404: errorResponse(
            "Not Found: Food does not exist.",
            "Food not found."
          ),
          500: errorResponse(
            "Internal Server Error: Failed to delete food.",
            "Failed to delete food."
          ),
        },
      },
    },
    "/meal-details": {
      get: {
        tags: ["Meal Details"],
        summary: "Retrieve a specific food entry within a meal log",
        description:
          "Fetches a single Meal Detail (individual food item log) using its unique ID, including full food information.",
        parameters: [
          {
            name: "meal_detail_id",
            in: "query",
            required: true,
            type: "integer",
            description: "The unique ID of the meal detail entry to retrieve.",
            example: 101,
          },
        ],
        responses: {
          200: {
            description: "The requested meal detail entry.",
            schema: 
            {
              type: "object",
              description: "A detailed entry for a single food item logged within a meal.",
              properties: {
                meal_detail_id: { type: "integer", example: 101, description: "Unique identifier for this specific food entry (meal detail)." },
                meal_id: { type: "integer", example: 50, description: "The ID of the parent meal log." },
                amount_grams: { type: "number", format: "float", example: 150.5, description: "The amount of the food item consumed, in grams." },
                food: {
                  type: "object",
                  description: "Details of the associated food item.",
                  properties: {
                    food_id: { type: "integer", example: 1, description: "Unique ID of the food item in the master 'foods' table." },
                    name: { type: "string", example: "Chicken Breast", description: "Name of the food." },
                    calories_per_serving: { type: "number", format: "float", example: 165, description: "Calories per serving (based on the serving_type)." },
                    protein_per_serving: { type: "number", format: "float", example: 31, description: "Protein (g) per serving." },
                    carbs_per_serving: { type: "number", format: "float", example: 0, description: "Carbohydrates (g) per serving." },
                    fat_per_serving: { type: "number", format: "float", example: 3.6, description: "Fat (g) per serving." },
                    serving_type: { type: "string", example: "100 g", description: "Description of the serving size (e.g., '100 g', '1 cup')." },
                    image: { type: "string", description: "Optional image URL for the food item.", example: "https://example.com/chicken.jpg" }
                  },
                  required: ["name", "calories_per_serving", "protein_per_serving", "carbs_per_serving", "fat_per_serving"]
                }
              },
              required: ["meal_detail_id", "meal_id", "amount_grams", "food"]
            }, // Using the full inline schema defined above
          },
          400: errorResponse(
            "Bad Request: Missing ID.",
            "meal_detail_id is required."
          ),
          404: errorResponse(
            "Not Found: Meal detail not found.",
            "Meal detail not found."
          ),
          500: errorResponse(
            "Internal Server Error: Failed to fetch data.",
            "Failed to fetch meal detail."
          ),
        },
      },
      post: {
        tags: ["Meal Details"],
        summary: "Add a new food entry to an existing meal log",
        description:
          "Adds an individual food item and its consumed amount to an existing meal (identified by meal_id).",
        parameters: [
          {
            name: "New Meal Detail",
            in: "body",
            required: true,
            schema: {
              type: "object",
              properties: {
                meal_id: {
                  type: "integer",
                  example: 50,
                  description:
                    "ID of the existing meal log to attach this detail to (required).",
                },
                food_id: {
                  type: "integer",
                  example: 3,
                  description:
                    "ID of the food item (from the /foods list) (required).",
                },
                amount_grams: {
                  type: "number",
                  format: "float",
                  example: 100,
                  description: "Amount consumed in grams (required).",
                },
              },
              required: ["meal_id", "food_id", "amount_grams"],
            },
          },
        ],
        responses: {
          201: {
            description: "Food entry added to meal successfully.",
            schema: {
              type: "object",
              properties: {
                meal_detail_id: { type: "integer", example: 102 },
                message: {
                  type: "string",
                  example: "Food entry added to meal successfully.",
                },
              },
            },
          },
          400: errorResponse(
            "Bad Request: Missing required fields or invalid data.",
            "Missing meal_id, food_id, or amount_grams."
          ),
          404: errorResponse(
            "Not Found: Meal or Food not found.",
            "Existing meal or food item not found."
          ),
          500: errorResponse(
            "Internal Server Error: Failed to add food entry.",
            "Failed to create meal detail."
          ),
        },
      },
      put: {
        tags: ["Meal Details"],
        summary: "Update the amount of a food entry",
        description:
          "Updates the consumed amount (amount_grams) for an existing food entry (meal_detail_id) in a meal.",
        parameters: [
          {
            name: "Update Meal Detail",
            in: "body",
            required: true,
            schema: {
              type: "object",
              properties: {
                meal_detail_id: {
                  type: "integer",
                  example: 101,
                  description:
                    "ID of the meal detail entry to update (required).",
                },
                amount_grams: {
                  type: "number",
                  format: "float",
                  example: 180.5,
                  description: "New amount consumed in grams (required).",
                },
              },
              required: ["meal_detail_id", "amount_grams"],
            },
          },
        ],
        responses: {
          200: messageResponse(
            "Meal detail updated successfully.",
            "Meal detail amount updated successfully."
          ),
          400: errorResponse(
            "Bad Request: Missing required fields.",
            "Missing meal_detail_id or amount_grams."
          ),
          404: errorResponse(
            "Not Found: Meal detail not found.",
            "Meal detail entry not found."
          ),
          500: errorResponse(
            "Internal Server Error: Failed to update entry.",
            "Failed to update meal detail."
          ),
        },
      },
      delete: {
        tags: ["Meal Details"],
        summary: "Remove a food entry from a meal log",
        description:
          "Deletes a specific food entry (meal_detail_id) from its associated meal log.",
        parameters: [
          {
            name: "Delete Meal Detail",
            in: "body",
            required: true,
            schema: {
              type: "object",
              properties: {
                meal_detail_id: {
                  type: "integer",
                  example: 101,
                  description:
                    "The unique ID of the meal detail entry to delete (required).",
                },
              },
              required: ["meal_detail_id"],
            },
          },
        ],
        responses: {
          200: messageResponse(
            "Meal detail deleted successfully.",
            "Meal detail deleted successfully."
          ),
          400: errorResponse(
            "Bad Request: Missing ID.",
            "meal_detail_id is required."
          ),
          404: errorResponse(
            "Not Found: Meal detail not found.",
            "Meal detail not found."
          ),
          500: errorResponse(
            "Internal Server Error: Failed to delete entry.",
            "Failed to delete meal detail."
          ),
        },
      },
    },
    "/meal-details/nutrition": {
      get: {
        tags: ["Meal Details"],
        summary: "Calculate and retrieve food-level nutrition for a meal",
        description:
          "Calculates the Calories, Protein, Carbs, and Fat for each food item logged in a specific meal, based on the amount consumed (amount_grams) and the food's serving details.",
        parameters: [
          {
            name: "meal_id",
            in: "query",
            required: true,
            type: "integer",
            description: "The ID of the meal log for which to calculate nutrition.",
            example: 50,
          },
        ],
        responses: {
          200: {
            description: "Nutritional breakdown for each food item in the meal.",
            schema: {
              type: "object",
              properties: {
                meal_id: {
                  type: "integer",
                  example: 50,
                  description: "The ID of the meal.",
                },
                foods: {
                  type: "array",
                  description:
                    "A list of food items in the meal with calculated nutrition.",
                  items: {
                    type: "object",
                    properties: {
                      meal_detail_id: {
                        type: "integer",
                        example: 101,
                        description: "The unique ID of the food entry.",
                      },
                      food_id: {
                        type: "integer",
                        example: 1,
                        description: "ID of the food item.",
                      },
                      name: {
                        type: "string",
                        example: "Chicken Breast",
                        description: "Name of the food item.",
                      },
                      amount_grams: {
                        type: "number",
                        format: "float",
                        example: 150.5,
                        description: "Amount consumed in grams.",
                      },
                      calories: {
                        type: "number",
                        format: "float",
                        example: 248.33,
                        description: "Calculated total calories.",
                      },
                      protein: {
                        type: "number",
                        format: "float",
                        example: 46.66,
                        description: "Calculated total protein (g).",
                      },
                      carbs: {
                        type: "number",
                        format: "float",
                        example: 0,
                        description: "Calculated total carbohydrates (g).",
                      },
                      fat: {
                        type: "number",
                        format: "float",
                        example: 5.42,
                        description: "Calculated total fat (g).",
                      },
                      serving_type: {
                        type: "string",
                        example: "100 g",
                        description: "Serving size used for base calculation.",
                      },
                    },
                    required: [
                      "meal_detail_id",
                      "food_id",
                      "name",
                      "amount_grams",
                      "calories",
                      "protein",
                      "carbs",
                      "fat",
                    ],
                  },
                },
              },
            },
          },
          400: errorResponse(
            "Bad Request: Missing meal_id.",
            "meal_id is required."
          ),
          404: errorResponse("Not Found: Meal not found.", "Meal not found."),
          500: errorResponse(
            "Internal Server Error: Failed to fetch data.",
            "Failed to fetch meal nutrition."
          ),
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
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
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
