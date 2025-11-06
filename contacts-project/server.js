require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const app = express();
const port = process.env.PORT || 3000;

const db = require('./db/connection');

// Configure CORS
app.use(cors({
  origin: ['http://localhost:3000', 'https://cse341-g10e.onrender.com', 'http://localhost:8080'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Swagger UI route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Basic health route
app.get('/', (req, res) => {
  res.send('Contacts API is running');
});

// mount contacts routes only after DB connection
app.use('/contacts', (req, res, next) => {
  // if DB not connected, still allow graceful error later
  next();
});

// Try to connect to MongoDB then mount routes
db.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    const contactsRouter = require('./routes/contacts');
    app.use('/contacts', contactsRouter);
    app.listen(port, () => console.log(`Server listening on port ${port}`));
  })
  .catch((err) => {
    console.error('Could not connect to MongoDB:', err.message);
    // Still start server so developer can see error and add .env
    const contactsRouter = require('./routes/contacts');
    app.use('/contacts', contactsRouter);
    app.listen(port, () => console.log(`Server listening on port ${port} (no DB)`));
  });
