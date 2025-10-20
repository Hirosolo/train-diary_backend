import { NextResponse } from 'next/server';
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    swagger: '2.0',
    info: {
      title: 'Train Diary API',
      version: '1.0.0',
      description: 'API documentation for Train Diary application',
    },
    servers: [
      {
        url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
        description: 'API Server',
      },
    ],
  },
  apis: [
    './src/app/api/auth/login/route.ts',
    './src/app/api/auth/register/route.ts',
    './src/app/api/**/route.ts'
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export async function GET() {
  return NextResponse.json(swaggerSpec);
}