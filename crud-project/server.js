require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const app = express();
const port = process.env.PORT || 4000;

const db = require('./db/connection');

app.use(cors());
app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => res.send('CRUD Project API running'));

// Require routers (can be mounted with a DB-check middleware)
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
