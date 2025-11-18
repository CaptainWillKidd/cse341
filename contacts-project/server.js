require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const app = express();
const port = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

console.log('Starting server with config:', {
  nodeEnv: process.env.NODE_ENV,
  port: port,
  mongoUri: process.env.MONGO_URI ? '(set)' : '(not set)'
});

const db = require('./db/connection');
const { default: mongoose } = require('mongoose');

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
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(
        "Database is listening and node Running at port " +
          (process.env.PORT || 3000)
      );
    });
  })
  .catch((err) => {
    console.log("Error conecting Mongoose", err);
});

app.use((err, req, res, next) => {
  console.error(err.stack || err.message || err);
  res.status(500).json({ message: err.message || "Internal server error" });
});
 
//Detect Errors didn't cath for try catch
process.on("uncaughtExceptiob", (err, origib) => {
  console.log(
    process.stderr.fd,
    `Caught exception: ${err}\n` + `Exception origin: ${origin}`
  );
});