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
    process.cwd() + '/src/app/api/auth/login/route.ts',
    process.cwd() + '/src/app/api/auth/register/route.ts',
    process.cwd() + '/src/app/api/**/route.ts'
  ],
};

export async function GET() {
  try {
    const spec = swaggerJsdoc(options);
    
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
  } catch (error) {
    console.error('Error generating Swagger UI:', error);
    return NextResponse.json({ error: 'Failed to generate API documentation' }, { status: 500 });
  }
}