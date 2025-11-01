const { MongoClient } = require('mongodb');

let client = null;
let db = null;

async function connect(uri) {
  if (!uri) {
    return Promise.reject(new Error('MONGO_URI not provided in environment'));
  }
  client = new MongoClient(uri);
  await client.connect();
  // default to database name encoded in URI; user can provide full string
  db = client.db();
}

function getDB() {
  if (!db) {
    throw new Error('Database not initialized. Call connect(uri) first.');
  }
  return db;
}

function getCollection(name) {
  return getDB().collection(name);
}

module.exports = {
  connect,
  getDB,
  getCollection,
};
