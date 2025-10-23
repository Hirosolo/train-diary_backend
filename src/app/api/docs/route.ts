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
    { name: 'Foods', description: 'Food management endpoints' },
    { name: 'Food Logs', description: 'Food log (meal tracking) endpoints' },
    { name: 'Workout Plans', description: 'Workout plan management endpoints' }
  ],
  paths: {
  // --- AUTHENTICATION ---
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
     // --- EXERCISES ---
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
    // --- FOOD LOGS ---
    '/foods': {
      get: {
        tags: ['Foods'],
        summary: 'Get all foods or one (by query)',
        parameters: [
          {
            name: 'food_id',
            in: 'query',
            required: false,
            type: 'integer',
            description: 'Optional: ID of the food to retrieve'
          }
        ],
        responses: {
          200: { description: 'List or single food record retrieved.' },
          500: { description: 'Failed to fetch foods.' }
        }
      },
      post: {
        tags: ['Foods'],
        summary: 'Add a new food item',
        parameters: [{
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
        }],
        responses: {
          200: { description: 'Food successfully added.' },
          400: { description: 'Missing required fields.' },
          500: { description: 'Failed to add food.' }
        }
      },
      put: {
        tags: ['Foods'],
        summary: 'Update a food item',
        parameters: [{
          in: 'body',
          name: 'body',
          required: true,
          schema: {
            type: 'object',
            required: ['food_id'],
            properties: {
              food_id: { type: 'integer', example: 1 },
              name: { type: 'string', example: "Grilled Chicken Breast" },
              calories_per_serving: { type: 'number', example: 165 }
            }
          }
        }],
        responses: {
          200: { description: 'Food updated successfully.' },
          400: { description: 'Missing food_id.' },
          500: { description: 'Failed to update food.' }
        }
      },
      delete: {
        tags: ['Foods'],
        summary: 'Delete a food item',
        parameters: [{
          in: 'body',
          name: 'body',
          required: true,
          schema: {
            type: 'object',
            required: ['food_id'],
            properties: {
              food_id: { type: 'integer', example: 1 }
            }
          }
        }],
        responses: {
          200: { description: 'Food deleted successfully.' },
          400: { description: 'Missing food_id.' },
          500: { description: 'Failed to delete food.' }
        }
      }
    },

    // --- FOOD LOGS ---
    '/food-logs': {
      get: {
        tags: ['Food Logs'],
        summary: 'Get all food logs or one (by query)',
        parameters: [
          {
            name: 'meal_id',
            in: 'query',
            required: false,
            type: 'integer',
            description: 'Optional: meal_id to get a single log.'
          }
        ],
        responses: {
          200: {
            description: 'List of food logs with their meal details.',
            schema: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  meal_id: { type: 'integer', example: 1 },
                  user_id: { type: 'integer', example: 3 },
                  meal_type: { type: 'string', example: 'Lunch' },
                  log_date: { type: 'string', example: '2025-10-23' },
                  user_meal_details: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        amount_grams: { type: 'number', example: 150 },
                        foods: {
                          type: 'object',
                          properties: {
                            name: { type: 'string', example: 'Rice' },
                            calories_per_serving: { type: 'number', example: 130 }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          500: { description: 'Failed to fetch food logs.' }
        }
      },
      post: {
        tags: ['Food Logs'],
        summary: 'Add a new food log (meal + foods)',
        parameters: [{
          in: 'body',
          name: 'body',
          required: true,
          schema: {
            type: 'object',
            required: ['user_id', 'meal_type', 'log_date', 'foods'],
            properties: {
              user_id: { type: 'integer', example: 1 },
              meal_type: { type: 'string', example: 'Dinner' },
              log_date: { type: 'string', example: '2025-10-23' },
              foods: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    food_id: { type: 'integer', example: 2 },
                    amount_grams: { type: 'number', example: 100 }
                  }
                }
              }
            }
          }
        }],
        responses: {
          200: { description: 'Food log created successfully.' },
          400: { description: 'Missing required fields.' },
          500: { description: 'Failed to create food log.' }
        }
      },
      put: {
        tags: ['Food Logs'],
        summary: 'Update a food log (meal and foods)',
        parameters: [{
          in: 'body',
          name: 'body',
          required: true,
          schema: {
            type: 'object',
            required: ['meal_id'],
            properties: {
              meal_id: { type: 'integer', example: 3 },
              meal_type: { type: 'string', example: 'Breakfast' },
              log_date: { type: 'string', example: '2025-10-24' },
              foods: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    food_id: { type: 'integer', example: 5 },
                    amount_grams: { type: 'number', example: 80 }
                  }
                }
              }
            }
          }
        }],
        responses: {
          200: { description: 'Food log updated successfully.' },
          400: { description: 'Missing meal_id.' },
          500: { description: 'Failed to update food log.' }
        }
      },
      delete: {
        tags: ['Food Logs'],
        summary: 'Delete a food log (and its details)',
        parameters: [{
          in: 'body',
          name: 'body',
          required: true,
          schema: {
            type: 'object',
            required: ['meal_id'],
            properties: {
              meal_id: { type: 'integer', example: 2 }
            }
          }
        }],
        responses: {
          200: { description: 'Food log deleted successfully.' },
          400: { description: 'Missing meal_id.' },
          500: { description: 'Failed to delete food log.' }
        }
      }
    },

    // --- WORKOUT PLANS ---
        '/workout-plans': {
      get: {
        tags: ['Plans'],
        summary: 'Get all workout plans or plan details by ID',
        description:
          'Retrieve all workout plans (with duration in days) or detailed information about a specific plan using the `plan_id` query parameter.',
        parameters: [
          {
            name: 'plan_id',
            in: 'query',
            required: false,
            type: 'integer',
            description: 'Optional. ID of the plan to fetch detailed information for.',
          },
        ],
        responses: {
          200: {
            description: 'Successfully retrieved list or details of plans.',
            schema: {
              oneOf: [
                {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      plan_id: { type: 'integer', example: 1 },
                      name: { type: 'string', example: 'Full Body Strength' },
                      description: { type: 'string', example: 'A 4-day beginner-friendly workout split.' },
                      duration_days: { type: 'integer', example: 4 },
                    },
                  },
                },
                {
                  type: 'object',
                  properties: {
                    plan_id: { type: 'integer', example: 1 },
                    name: { type: 'string', example: 'Full Body Strength' },
                    description: { type: 'string', example: 'A 4-day beginner-friendly workout split.' },
                    duration_days: { type: 'integer', example: 4 },
                    plan_days: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          plan_day_id: { type: 'integer', example: 10 },
                          day_number: { type: 'integer', example: 1 },
                          day_type: { type: 'string', example: 'Upper Body' },
                          plan_day_exercises: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                plan_day_exercise_id: { type: 'integer', example: 5 },
                                sets: { type: 'integer', example: 4 },
                                reps: { type: 'integer', example: 10 },
                                exercises: {
                                  type: 'object',
                                  properties: {
                                    exercise_id: { type: 'integer', example: 2 },
                                    name: { type: 'string', example: 'Bench Press' },
                                    category: { type: 'string', example: 'Chest' },
                                    description: {
                                      type: 'string',
                                      example: 'A compound movement targeting chest and triceps.',
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              ],
            },
          },
          404: { description: 'Plan not found.' },
          500: { description: 'Failed to fetch plans.' },
        },
      },
      post: {
        tags: ['Plans'],
        summary: 'Apply a workout plan for a user',
        description:
          'Assigns a workout plan to a user and automatically generates workout sessions and exercises according to the plan schedule.',
        parameters: [
          {
            in: 'body',
            name: 'body',
            required: true,
            schema: {
              type: 'object',
              required: ['user_id', 'plan_id', 'start_date'],
              properties: {
                user_id: { type: 'integer', example: 3 },
                plan_id: { type: 'integer', example: 1 },
                start_date: { type: 'string', example: '2025-10-25' },
              },
            },
          },
        ],
        responses: {
          201: {
            description: 'Plan successfully applied. Workout sessions created for user.',
            schema: {
              type: 'object',
              properties: {
                message: { type: 'string', example: 'Plan applied successfully. Workout sessions created.' },
              },
            },
          },
          400: {
            description: 'Missing required fields or invalid input.',
            schema: {
              type: 'object',
              properties: {
                error: { type: 'string', example: 'user_id, plan_id, and start_date are required.' },
              },
            },
          },
          404: {
            description: 'User or plan not found, or plan has no exercises.',
            schema: {
              type: 'object',
              properties: {
                error: { type: 'string', example: 'Plan not found.' },
              },
            },
          },
          500: {
            description: 'Server or database error while applying the plan.',
            schema: {
              type: 'object',
              properties: {
                error: { type: 'string', example: 'Failed to apply plan.' },
              },
            },
          },
        },
      },
    },

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