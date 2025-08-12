import swaggerJsdoc from 'swagger-jsdoc';

const swaggerDefinition = {
  components: {
    schemas: {
      ApiResponse: {
        properties: {
          data: { type: 'object' },
          error: { description: 'Error code (only present when success=false)', type: 'string' },
          message: { type: 'string' },
          success: { type: 'boolean' },
          timestamp: { format: 'date-time', type: 'string' },
        },
        type: 'object',
      },
      LoginSession: {
        properties: {
          token: { description: 'JWT authentication token', type: 'string' },
          user: {
            properties: {
              email: { format: 'email', type: 'string' },
              id: { type: 'string' },
              isActive: { type: 'boolean' },
              name: { type: 'string' },
              role: { enum: ['USER', 'BUSINESS_OWNER', 'ADMIN'], type: 'string' },
            },
            type: 'object',
          },
        },
        type: 'object',
      },
      Notification: {
        properties: {
          createdAt: { format: 'date-time', type: 'string' },
          id: { type: 'string' },
          isRead: { example: false, type: 'boolean' },
          message: {
            example: 'Su reserva ha sido confirmada para el 15 de diciembre',
            type: 'string',
          },
          title: { example: 'Reserva confirmada', type: 'string' },
          type: {
            enum: [
              'BOOKING_CONFIRMED',
              'BOOKING_CANCELLED',
              'PAYMENT_RECEIVED',
              'REMINDER',
              'SYSTEM',
            ],
            example: 'BOOKING_CONFIRMED',
            type: 'string',
          },
        },
        type: 'object',
      },
      Reservation: {
        properties: {
          createdAt: { format: 'date-time', type: 'string' },
          currency: { example: 'MXN', type: 'string' },
          date: { example: '2024-12-15T14:30:00Z', format: 'date-time', type: 'string' },
          endTime: { example: '16:30', type: 'string' },
          guests: { example: 2, type: 'integer' },
          id: { example: 'reservation_123', type: 'string' },
          paymentStatus: {
            enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
            example: 'PAID',
            type: 'string',
          },
          service: { $ref: '#/components/schemas/ServiceBasic' },
          serviceId: { example: 'service_123', type: 'string' },
          specialRequests: { example: 'Vista al jardín preferible', type: 'string' },
          startTime: { example: '14:30', type: 'string' },
          status: {
            enum: ['PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED', 'NO_SHOW'],
            example: 'CONFIRMED',
            type: 'string',
          },
          totalAmount: { example: 4500.0, format: 'decimal', type: 'number' },
          user: {
            properties: {
              email: { format: 'email', type: 'string' },
              id: { type: 'string' },
              name: { type: 'string' },
            },
            type: 'object',
          },
          userId: { example: 'user_123', type: 'string' },
        },
        type: 'object',
      },
      Review: {
        properties: {
          comment: { type: 'string' },
          createdAt: { format: 'date-time', type: 'string' },
          id: { type: 'string' },
          isVerified: { type: 'boolean' },
          rating: { maximum: 5, minimum: 1, type: 'integer' },
          title: { type: 'string' },
          user: {
            properties: {
              firstName: { type: 'string' },
              lastName: { type: 'string' },
            },
            type: 'object',
          },
        },
        type: 'object',
      },
      Service: {
        properties: {
          capacity: { example: 2, type: 'integer' },
          category: {
            enum: [
              'ACCOMMODATION',
              'DINING',
              'SPA_WELLNESS',
              'TOUR_EXPERIENCE',
              'EVENT_MEETING',
              'TRANSPORTATION',
              'ENTERTAINMENT',
            ],
            type: 'string',
          },
          currency: { example: 'MXN', type: 'string' },
          description: { example: 'Suite de lujo con vista...', type: 'string' },
          duration: { description: 'Duration in minutes', example: 120, type: 'integer' },
          id: { example: 'service_123', type: 'string' },
          name: { example: 'Suite Premium', type: 'string' },
          price: { example: 4500.0, format: 'decimal', type: 'number' },
          venue: { $ref: '#/components/schemas/VenueBasic' },
        },
        type: 'object',
      },
      ServiceBasic: {
        properties: {
          capacity: { type: 'integer' },
          category: { type: 'string' },
          currency: { type: 'string' },
          id: { type: 'string' },
          name: { type: 'string' },
          price: { format: 'decimal', type: 'number' },
        },
        type: 'object',
      },
      User: {
        properties: {
          createdAt: { format: 'date-time', type: 'string' },
          email: { format: 'email', type: 'string' },
          id: { type: 'string' },
          isActive: { type: 'boolean' },
          name: { type: 'string' },
          profile: {
            properties: {
              dateOfBirth: { format: 'date', type: 'string' },
              phone: { type: 'string' },
              preferences: {
                properties: {
                  currency: { example: 'MXN', type: 'string' },
                  language: { example: 'es', type: 'string' },
                  notifications: { example: true, type: 'boolean' },
                },
                type: 'object',
              },
            },
            type: 'object',
          },
          role: { enum: ['USER', 'BUSINESS_OWNER', 'ADMIN'], type: 'string' },
        },
        type: 'object',
      },
      Venue: {
        properties: {
          address: { example: 'Centro Histórico, Guadalajara', type: 'string' },
          category: {
            enum: [
              'ACCOMMODATION',
              'RESTAURANT',
              'SPA',
              'TOUR_OPERATOR',
              'EVENT_CENTER',
              'ENTERTAINMENT',
            ],
            type: 'string',
          },
          city: { example: 'Guadalajara', type: 'string' },
          description: { example: 'Hotel boutique de lujo...', type: 'string' },
          id: { example: 'venue_123', type: 'string' },
          name: { example: 'Casa Salazar', type: 'string' },
          phone: { example: '+52 33 1234 5678', type: 'string' },
          rating: { example: 4.7, format: 'decimal', type: 'number' },
          services: {
            items: { $ref: '#/components/schemas/ServiceBasic' },
            type: 'array',
          },
        },
        type: 'object',
      },
      VenueBasic: {
        properties: {
          address: { type: 'string' },
          category: { type: 'string' },
          id: { type: 'string' },
          name: { type: 'string' },
          rating: { format: 'decimal', type: 'number' },
        },
        type: 'object',
      },
    },
    securitySchemes: {
      bearerAuth: {
        bearerFormat: 'JWT',
        scheme: 'bearer',
        type: 'http',
      },
    },
  },
  info: {
    contact: {
      email: 'support@reservapp.com',
      name: 'ReservApp Support',
    },
    description: `
# ReservApp API Documentation

Complete API documentation for the ReservApp reservation management platform.

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:
\`\`\`
Authorization: Bearer your-jwt-token
\`\`\`

## Public Endpoints

The following endpoints are public and don't require authentication:
- \`/public/venues\` - Browse available venues
- \`/public/services\` - Browse available services  
- \`/venues/{id}/reviews\` - View venue reviews
- \`/services/{id}/reviews\` - View service reviews

## Response Format

All API responses follow a consistent format:
\`\`\`json
{
  "success": boolean,
  "message": "string",
  "data": object,
  "timestamp": "ISO 8601 datetime"
}
\`\`\`
`,
    title: 'ReservApp API',
    version: '1.0.0',
  },
  openapi: '3.0.0',
  servers: [
    {
      description: 'Production server',
      url: 'https://reservapp-web.vercel.app/api',
    },
    {
      description: 'Local development server',
      url: 'http://localhost:3000/api',
    },
  ],
  tags: [
    {
      description: 'Public endpoints (no authentication required)',
      name: 'Public',
    },
    {
      description: 'User authentication and registration',
      name: 'Authentication',
    },
    {
      description: 'Venue management operations',
      name: 'Venues',
    },
    {
      description: 'Service management operations',
      name: 'Services',
    },
    {
      description: 'Review and rating operations',
      name: 'Reviews',
    },
    {
      description: 'Reservation management',
      name: 'Reservations',
    },
    {
      description: 'In-app notifications',
      name: 'Notifications',
    },
    {
      description: 'User profile and settings',
      name: 'Settings',
    },
    {
      description: 'Payment processing and Stripe integration',
      name: 'Payments',
    },
    {
      description: 'User management operations',
      name: 'Users',
    },
    {
      description: 'Email notification services',
      name: 'Email',
    },
    {
      description: 'File and image upload operations',
      name: 'Upload',
    },
    {
      description: 'API documentation and health checks',
      name: 'Documentation',
    },
  ],
};

const options = {
  apis: ['./src/app/api/**/*.ts', './src/modules/**/*.ts'],
  swaggerDefinition,
};

export const swaggerSpec = swaggerJsdoc(options);
