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
        url: process.env.NODE_ENV === 'production'
          ? 'https://cse341-g10e.onrender.com'  // Your Render URL
          : 'http://localhost:3000',
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Local development server'
      }
    ],
  },
  apis: ['./routes/*.js'],
};

module.exports = swaggerJsdoc(options);