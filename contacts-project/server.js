require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const app = express();
const port = process.env.PORT || 3000;

const db = require('./db/connection');

// Add headers before the routes are defined
app.use(function (req, res, next) {
    // Allow requests from any origin
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    // Set to true if you need the website to include cookies in the requests
    res.setHeader('Access-Control-Allow-Credentials', true);
    
    // Pass to next layer of middleware
    next();
});

// Enable CORS for all requests
app.use(cors({
  origin: '*', // Allow all origins
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Parse JSON bodies
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
