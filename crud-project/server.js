require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const app = express();
const port = process.env.PORT || 4000;

const db = require('./db/connection');

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev_session_secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Passport (ensure config file is loaded)
require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => res.send('CRUD Project API running'));

// Require routers (can be mounted with a DB-check middleware)
const authRouter = require('./routes/auth');
const gamesRouter = require('./routes/games');
const platformsRouter = require('./routes/platforms');

// Middleware to check DB connectivity and return 503 if not connected
function ensureDB(req, res, next) {
  if (!db.isConnected()) {
    return res.status(503).json({ error: 'Database not connected' });
  }
  next();
}

// Mount routes with the DB-check middleware
app.use('/games', ensureDB, gamesRouter);
app.use('/platforms', ensureDB, platformsRouter);
// Auth routes (do not require DB-check middleware)
app.use('/auth', authRouter);

// Try to connect to MongoDB then start server
db.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => console.log(`Server listening on port ${port}`));
  })
  .catch((err) => {
    console.error('DB connect error:', err.stack || err);
    // still start server so developer can see message and app remains up
    app.listen(port, () => console.log(`Server listening on port ${port} (no DB)`));
  });

module.exports = app;
