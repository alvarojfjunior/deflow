import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGO_URI!;
const dbName = 'deflowdb';

let client: MongoClient;
let db: Db;

export async function connectDb(): Promise<Db> {
  if (db) return db;

  client = new MongoClient(uri);
  await client.connect();
  db = client.db(dbName);

  console.log(`✅ Connected to MongoDB: ${dbName}`);
  return db;
}

export async function closeDb() {
  await client.close();
  console.log('🔒 MongoDB connection closed');
}
