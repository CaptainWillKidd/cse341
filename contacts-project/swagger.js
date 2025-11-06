const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Contacts API',
      version: '1.0.0',
      description: 'Contact Management API - CSE341',
    },
    servers: [
      {
        url: '/',  // Use relative URL
        description: 'API Server'
      }
    ],
  },
  apis: ['./routes/*.js'],
};

module.exports = swaggerJsdoc(options);