/*
Simple script to test a MongoDB connection and list/check the collections `platforms` and `games`.
Usage:
  - Set env var MONGO_URI and run: node test-connect.js
  - Or pass the URI as the first argument: node test-connect.js "mongodb+srv://.../mydb?retryWrites=true&w=majority"

This script intentionally prints helpful errors and collection counts so you can confirm whether the production DB is populated.
*/

const { MongoClient } = require('mongodb');

function usage() {
  console.log('\nUsage: set MONGO_URI env var or pass the URI as the first argument.');
  console.log('Examples (PowerShell):');
  console.log("  $env:MONGO_URI = 'mongodb+srv://USER:PASS@cluster0.mongodb.net/myDB?retryWrites=true&w=majority'");
  console.log('  node test-connect.js');
  console.log('\nOr use argument:');
  console.log("  node test-connect.js \"mongodb+srv://USER:PASS@.../myDB?retryWrites=true&w=majority\"\n");
}

async function main() {
  const uri = process.env.MONGO_URI || process.argv[2];
  if (!uri) {
    usage();
    process.exitCode = 1;
    return;
  }

  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000, connectTimeoutMS: 10000 });

  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('Connected.');

    // Attempt to determine DB name from URI
    let dbName = 'unknown';
    try {
      // URL parsing will work for typical mongodb+srv and mongodb URIs with a path
      const parsed = new URL(uri.replace('mongodb+srv://', 'http://').replace('mongodb://', 'http://'));
      const path = parsed.pathname || '';
      if (path && path !== '/') dbName = path.replace(/^\//, '');
    } catch (e) {
      // ignore, leave as unknown
    }

    const admin = client.db().admin();
    const serverInfo = await admin.serverStatus().catch(() => null);
    if (serverInfo && serverInfo.host) {
      console.log('Server info host:', serverInfo.host);
    }

    const db = dbName && dbName !== 'unknown' ? client.db(dbName) : client.db();
    console.log('Using DB:', db.databaseName);

    const collections = await db.listCollections().toArray();
    console.log('Collections in DB:', collections.map(c => c.name));

    const checkNames = ['platforms', 'games'];
    for (const name of checkNames) {
      const exists = collections.some(c => c.name === name);
      if (!exists) {
        console.log(`Collection '${name}' NOT FOUND`);
        continue;
      }
      const col = db.collection(name);
      const count = await col.countDocuments();
      console.log(`Collection '${name}' count: ${count}`);
      if (count > 0) {
        const sample = await col.find().limit(3).toArray();
        console.log('Sample docs:', sample);
      }
    }

    // Also show total documents across collections (summary)
    let total = 0;
    for (const c of collections) {
      try {
        const ct = await db.collection(c.name).countDocuments();
        total += ct;
      } catch (e) {
        // ignore
      }
    }
    console.log('Total docs in DB (sum of collections):', total);

  } catch (err) {
    console.error('Connection failed:', err.message || err);
    console.error(err);
    process.exitCode = 2;
  } finally {
    try { await client.close(); } catch (e) { /* ignore */ }
  }
}

main();
