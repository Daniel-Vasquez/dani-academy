import { MongoClient, type Db } from "mongodb";
import { MONGODB_DB, MONGODB_URI } from "astro:env/server";
import { createConnector } from "@/lib/mongo-connect";

declare global {
  var __daMongoClient: MongoClient | undefined;
}

/**
 * Un único cliente por proceso (temario B5.2).
 * En desarrollo se guarda en globalThis para sobrevivir a las recargas de Vite
 * y no abrir un pool de conexiones nuevo en cada cambio.
 */
export const mongoClient: MongoClient =
  globalThis.__daMongoClient ??
  new MongoClient(MONGODB_URI, {
    appName: "dani-academy",
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5_000,
  });

if (import.meta.env.DEV) globalThis.__daMongoClient = mongoClient;

/** El driver conecta en la primera operación; el middleware llama antes a connectMongo() */
export const db: Db = mongoClient.db(MONGODB_DB);

/** Conecta (o reintenta tras un primer intento fallido). Ver src/lib/mongo-connect.ts */
export const connectMongo = createConnector(mongoClient);
