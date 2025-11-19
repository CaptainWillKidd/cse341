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
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'connect.sid',
          description: 'Session cookie authentication. Use /auth/google to authenticate.'
        }
      }
    }
  },
  apis: ['./routes/*.js']
};

module.exports = swaggerJsdoc(options);
