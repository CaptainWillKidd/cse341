const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Games Library API',
      version: '1.0.0',
      description: 'API for managing games and platforms (CSE341)'
    },
    servers: [
      { url: '/', description: 'API server (relative)' }
    ]
  },
  apis: ['./routes/*.js']
};

module.exports = swaggerJsdoc(options);
