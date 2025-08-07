import swaggerJsdoc from 'swagger-jsdoc';

const swaggerDefinition = {
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
    contact: {
      email: 'support@reservapp.com',
      name: 'ReservApp Support',
    },
    description: 'API documentation for ReservApp reservation management system',
    title: 'ReservApp API',
    version: '1.0.0',
  },
  openapi: '3.0.0',
  security: [
    {
      bearerAuth: [],
    },
  ],
  servers: [
    {
      description: 'Local development server',
      url: 'http://localhost:3000/api',
    },
    {
      description: 'Production server',
      url: 'https://reservapp.com/api',
    },
  ],
};

const options = {
  apis: ['./src/app/api/**/*.ts', './src/modules/**/*.ts'],
  swaggerDefinition,
};

export const swaggerSpec = swaggerJsdoc(options);
