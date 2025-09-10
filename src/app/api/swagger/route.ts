import { NextRequest, NextResponse } from 'next/server';

/**
 * Swagger API documentation endpoint
 */
export async function GET(_request: NextRequest) {
  try {
    // Basic OpenAPI 3.0 specification for ReservApp API
    const swaggerSpec = {
      components: {
        securitySchemes: {
          bearerAuth: {
            bearerFormat: 'JWT',
            scheme: 'bearer',
            type: 'http',
          },
        },
      },
      info: {
        description: 'API para sistema de reservas',
        title: 'ReservApp API',
        version: '1.0.0',
      },
      openapi: '3.0.0',
      paths: {
        '/api/auth/login': {
          post: {
            requestBody: {
              content: {
                'application/json': {
                  schema: {
                    properties: {
                      email: { type: 'string' },
                      password: { type: 'string' },
                    },
                    required: ['email', 'password'],
                    type: 'object',
                  },
                },
              },
              required: true,
            },
            responses: {
              '200': {
                content: {
                  'application/json': {
                    schema: {
                      properties: {
                        data: {
                          properties: {
                            token: { type: 'string' },
                            user: { type: 'object' },
                          },
                          type: 'object',
                        },
                        success: { type: 'boolean' },
                      },
                      type: 'object',
                    },
                  },
                },
                description: 'Login successful',
              },
            },
            summary: 'User login',
            tags: ['Authentication'],
          },
        },
        '/api/health': {
          get: {
            responses: {
              '200': { description: 'System is healthy' },
            },
            summary: 'Health check',
            tags: ['System'],
          },
        },
        '/api/reservations': {
          get: {
            responses: {
              '200': { description: 'Reservations retrieved successfully' },
            },
            security: [{ bearerAuth: [] }],
            summary: 'Get reservations',
            tags: ['Reservations'],
          },
          post: {
            responses: {
              '201': { description: 'Reservation created successfully' },
            },
            security: [{ bearerAuth: [] }],
            summary: 'Create reservation',
            tags: ['Reservations'],
          },
        },
      },
      servers: [
        {
          description: 'Development server',
          url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
        },
      ],
    };

    return NextResponse.json(swaggerSpec);
  } catch (error) {
    console.error('Swagger error:', error);
    return NextResponse.json({ error: 'Error al generar documentación API' }, { status: 500 });
  }
}
