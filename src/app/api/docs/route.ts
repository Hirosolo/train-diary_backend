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
        description: "Authenticates a user using email and password, issuing a time-limited JSON Web Token (JWT).",
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
                  description: "The authentication JWT. This should be stored securely and used for subsequent requests.",
                },
                user: {
                  type: "object",
                  properties: {
                    user_id: { type: "string", example: "uuid-12345" },
                    username: { type: "string", example: "testuser" },
                    email: { type: "string", format: "email", example: "testuser@example.com" },
                  },
                },
              },
            },
          },
          400: errorResponse("Bad Request: Missing email or password.", "Email and password required."),
          401: errorResponse("Unauthorized: Invalid credentials.", "User not found. "),
          403: errorResponse("Unauthorized: Invalid credentials.", "Wrong password."),
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