const { MongoClient } = require('mongodb');

let client = null;
let db = null;

async function connect(uri) {
  if (!uri) throw new Error('MONGO_URI not provided');
  client = new MongoClient(uri);
  await client.connect();
  db = client.db();
  try {
    // Log which database name was chosen by the driver (helps debugging in production)
    console.log('Connected to MongoDB, using DB:', db.databaseName);
  } catch (e) {
    // ignore logging errors
  }
}

function getDB() {
  if (!db) throw new Error('Database not initialized. Call connect first.');
  return db;
}

function getCollection(name) {
  return getDB().collection(name);
}

function isConnected() {
  return !!db;
}

module.exports = { connect, getDB, getCollection, isConnected };
