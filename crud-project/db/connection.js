const { MongoClient } = require('mongodb');

let client = null;
let db = null;

async function connect(uri) {
  if (!uri) throw new Error('MONGO_URI not provided');
  client = new MongoClient(uri);
  await client.connect();
  db = client.db();
}

function getDB() {
  if (!db) throw new Error('Database not initialized. Call connect first.');
  return db;
}

function getCollection(name) {
  return getDB().collection(name);
}

module.exports = { connect, getDB, getCollection };
