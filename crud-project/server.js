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

// Mount routes after DB connection
db.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    const gamesRouter = require('./routes/games');
    const platformsRouter = require('./routes/platforms');
    app.use('/games', gamesRouter);
    app.use('/platforms', platformsRouter);
    app.listen(port, () => console.log(`Server listening on port ${port}`));
  })
  .catch((err) => {
    console.error('DB connect error:', err.message);
    // still mount routes (they will throw if db is required)
    const gamesRouter = require('./routes/games');
    const platformsRouter = require('./routes/platforms');
    app.use('/games', gamesRouter);
    app.use('/platforms', platformsRouter);
    app.listen(port, () => console.log(`Server listening on port ${port} (no DB)`));
  });

module.exports = app;
