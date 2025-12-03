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
