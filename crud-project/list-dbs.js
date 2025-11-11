/*
List all databases visible to the provided URI. Usage like test-connect.js:
  - set MONGO_URI env var then run: node list-dbs.js
  - or pass URI as first argument: node list-dbs.js "mongodb+srv://..."
*/

const { MongoClient } = require('mongodb');

async function main() {
  const uri = process.env.MONGO_URI || process.argv[2];
  if (!uri) {
    console.log('Provide MONGO_URI via env or argument.');
    process.exitCode = 1;
    return;
  }

  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000, connectTimeoutMS: 10000 });
  try {
    console.log('Connecting...');
    await client.connect();
    console.log('Connected.');
    const admin = client.db().admin();
    const result = await admin.listDatabases();
    console.log('Databases:');
    for (const db of result.databases) {
      console.log(` - ${db.name} (sizeOnDisk: ${db.sizeOnDisk}, empty: ${db.empty})`);
    }
  } catch (err) {
    console.error('Failed to list databases:', err.message || err);
    process.exitCode = 2;
  } finally {
    try { await client.close(); } catch (e) {}
  }
}

main();
