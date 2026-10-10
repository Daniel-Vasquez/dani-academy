import { MongoClient, type Db } from "mongodb";
import { MONGODB_DB, MONGODB_URI } from "astro:env/server";

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

/** El driver conecta en la primera operación: no hace falta `await client.connect()`. */
export const db: Db = mongoClient.db(MONGODB_DB);
