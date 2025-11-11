require('dotenv').config();
const db = require('./db/connection');

async function run() {
  try {
    await db.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for import');

    const platforms = db.getCollection('platforms');
    const games = db.getCollection('games');

    // sample platforms
    const p = [
      { name: 'PlayStation 5', manufacturer: 'Sony', releaseYear: 2020 },
      { name: 'Xbox Series X', manufacturer: 'Microsoft', releaseYear: 2020 }
    ];
    const pRes = await platforms.insertMany(p);
    console.log('Inserted platforms:', Object.values(pRes.insertedIds));

    // sample games
    const g = [
      { title: 'Astro Adventure', developer: 'Studio A', releaseDate: '2021-11-12', genre: 'Platformer', platform: pRes.insertedIds[0] },
      { title: 'Speed Racer', developer: 'Studio B', releaseDate: '2022-06-01', genre: 'Racing', platform: pRes.insertedIds[1] }
    ];
    const gRes = await games.insertMany(g);
    console.log('Inserted games:', Object.values(gRes.insertedIds));

    process.exit(0);
  } catch (err) {
    console.error('Import failed:', err.message);
    process.exit(1);
  }
}

run();
