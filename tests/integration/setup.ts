import { MongoMemoryReplSet } from "mongodb-memory-server";
import { MongoClient, type Db } from "mongodb";
import { afterAll, beforeAll, beforeEach } from "vitest";

let replSet: MongoMemoryReplSet;
let client: MongoClient;
export let db: Db;

beforeAll(async () => {
  replSet = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
  client = await MongoClient.connect(replSet.getUri());
  db = client.db("test");
});

beforeEach(async () => {
  await db.dropDatabase();
  // Mismo índice único que crea scripts/db-setup.ts: necesario para probar la idempotencia
  await db
    .collection("section_progress")
    .createIndex({ userId: 1, sectionId: 1 }, { unique: true });
});

afterAll(async () => {
  await client?.close();
  await replSet?.stop();
});
