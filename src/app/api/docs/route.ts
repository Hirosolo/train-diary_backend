import { NextResponse } from 'next/server';

const spec = {
  swagger: '2.0',
  info: {
    title: 'Train Diary API',
    version: '1.0.0',
    description: 'API documentation for Train Diary application',
  },
  host: process.env.NEXT_PUBLIC_API_URL?.replace(/^https?:\/\//, '') || 'localhost:3000',
  basePath: '/api',
  schemes: ['http', 'https'],
  tags: [
    { name: 'Authentication', description: 'Authentication endpoints' },
    { name: 'Exercises', description: 'Exercise management endpoints' },
    { name: 'Foods', description: 'Food management endpoints' }
  ],
  paths: {
    '/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'User login',
        parameters: [
          {
            in: 'body',
            name: 'body',
            required: true,
            schema: {
              type: 'object',
              properties: {
                email: { type: 'string' },
                password: { type: 'string' }
              }
            }
          }
        ],
        responses: {
          200: { description: 'Login successful' },
          401: { description: 'Invalid credentials' }
        }
      }
    },
    '/auth/register': {
      post: {
        tags: ['Authentication'],
        summary: 'User registration',
        parameters: [
          {
            in: 'body',
            name: 'body',
            required: true,
            schema: {
              type: 'object',
              properties: {
                email: { type: 'string' },
                password: { type: 'string' },
                name: { type: 'string' }
              }
            }
          }
        ],
        responses: {
          201: { description: 'Registration successful' },
          400: { description: 'Invalid input' }
        }
      }
    },
    '/exercises': {
      get: {
        tags: ['Exercises'],
        summary: 'Get all exercises',
        description: 'Retrieve all exercises from the database.',
        responses: {
          200: {
            description: 'Successfully retrieved list of exercises.',
            schema: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  exercise_id: { type: 'string', example: "1" },
                  name: { type: 'string', example: "Bench Press" },
                  category: { type: 'string', example: "Chest" },
                  default_sets: { type: 'integer', example: 3 },
                  default_reps: { type: 'integer', example: 10 },
                  description: { type: 'string', example: "A compound exercise targeting the chest and triceps." }
                }
              }
            }
          },
          500: { description: 'Failed to fetch exercises.' }
        }
      },
      post: {
        tags: ['Exercises'],
        summary: 'Add a new exercise',
        parameters: [
          {
            in: 'body',
            name: 'body',
            required: true,
            schema: {
              type: 'object',
              required: ['name'],
              properties: {
                name: { type: 'string', example: "Squat" },
                category: { type: 'string', example: "Legs" },
                default_sets: { type: 'integer', example: 4 },
                default_reps: { type: 'integer', example: 12 },
                description: { type: 'string', example: "A compound lower body exercise targeting the quads and glutes." }
              }
            }
          }
        ],
        responses: {
          201: {
            description: 'Exercise successfully added.',
            schema: {
              type: 'object',
              properties: {
                exercise_id: { type: 'string', example: "2" },
                message: { type: 'string', example: "Exercise added." }
              }
            }
          },
          400: { description: 'Missing required fields.' },
          500: { description: 'Failed to add exercise.' }
        }
      },
      delete: {
        tags: ['Exercises'],
        summary: 'Delete an exercise',
        parameters: [
          {
            in: 'body',
            name: 'exercise_id',
            required: true,
            type: 'string',
            description: 'ID of the exercise to delete.'
          }
        ],
        responses: {
          200: { 
            description: 'Exercise successfully deleted.',
            schema: {
              type: 'object',
              properties: {
                message: { type: 'string', example: "Exercise deleted." }
              }
            }
          },
          400: { description: 'Missing or invalid exercise ID.' },
          500: { description: 'Failed to delete exercise.' }
        }
      }
    },
    '/foods': {
      get: {
        tags: ['Foods'],
        summary: 'Get all foods',
        description: 'Retrieve all food items from the database, ordered by name.',
        responses: {
          200: {
            description: 'Successfully retrieved list of foods.',
            schema: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  food_id: { type: 'string', example: "1" },
                  name: { type: 'string', example: "Grilled Chicken Breast" },
                  calories_per_serving: { type: 'number', example: 165 },
                  protein_per_serving: { type: 'number', example: 31 },
                  carbs_per_serving: { type: 'number', example: 0 },
                  fat_per_serving: { type: 'number', example: 3.6 },
                  serving_type: { type: 'string', example: "100g" },
                  image: { type: 'string', example: "https://example.com/images/chicken.jpg" }
                }
              }
            }
          },
          500: { description: 'Failed to fetch foods.' }
        }
      },
      post: {
        tags: ['Foods'],
        summary: 'Add a new food',
        parameters: [
          {
            in: 'body',
            name: 'body',
            required: true,
            schema: {
              type: 'object',
              required: ['name', 'serving_type'],
              properties: {
                name: { type: 'string', example: "Oatmeal" },
                calories_per_serving: { type: 'number', example: 68 },
                protein_per_serving: { type: 'number', example: 2.4 },
                carbs_per_serving: { type: 'number', example: 12 },
                fat_per_serving: { type: 'number', example: 1.4 },
                serving_type: { type: 'string', example: "100g" },
                image: { type: 'string', example: "https://example.com/images/oatmeal.jpg" }
              }
            }
          }
        ],
        responses: {
          201: {
            description: 'Food successfully added.',
            schema: {
              type: 'object',
              properties: {
                food_id: { type: 'string', example: "2" },
                message: { type: 'string', example: "Food added." }
              }
            }
          },
          400: { description: 'Missing required fields.' },
          500: { description: 'Failed to add food.' }
        }
      }
    }
  }
};

export async function GET() {
  try {
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>API Documentation</title>
          <meta charset="utf-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css" />
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
        'Content-Type': 'text/html',
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error generating Swagger UI:', error);
    return NextResponse.json({ error: `Failed to generate API documentation: ${errorMessage}` }, { status: 500 });
  }
}