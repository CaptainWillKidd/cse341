require('dotenv').config();
const db = require('./db/connection');

async function run() {
  try {
    await db.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for import');
    const collection = db.getCollection('contacts');

    const sample = [
      {
        firstName: 'Alice',
        lastName: 'Anderson',
        email: 'alice@example.com',
        favoriteColor: 'blue',
        birthday: '1990-05-15'
      },
      {
        firstName: 'Bob',
        lastName: 'Brown',
        email: 'bob@example.com',
        favoriteColor: 'green',
        birthday: '1988-11-02'
      },
      {
        firstName: 'Carlos',
        lastName: 'Cruz',
        email: 'carlos@example.com',
        favoriteColor: 'red',
        birthday: '1995-07-21'
      }
    ];

    const result = await collection.insertMany(sample);
    console.log('Inserted documents:', Object.values(result.insertedIds));
    process.exit(0);
  } catch (err) {
    console.error('Import failed:', err.message);
    process.exit(1);
  }
}

run();
