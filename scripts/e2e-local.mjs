/**
 * Uso: npm run test:e2e:local [-- argumentos de Playwright]
 * E2E sin Docker: levanta un replica set de MongoDB en memoria (Better Auth necesita
 * transacciones), crea colecciones e índices, ejecuta Playwright y lo apaga todo al final.
 * Las variables de este proceso tienen prioridad sobre .env, así que nunca toca Atlas.
 */
import { spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { MongoClient } from "mongodb";
import { MongoMemoryReplSet } from "mongodb-memory-server";

const replSet = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
const env = {
  ...process.env,
  MONGODB_URI: replSet.getUri(),
  MONGODB_DB: "dani_academy_e2e",
  BETTER_AUTH_SECRET: randomBytes(32).toString("base64"),
};

const run = (command, args) => spawnSync(command, args, { stdio: "inherit", env }).status ?? 1;

let status = run("npm", ["run", "db:setup"]);
if (status === 0) status = run("npx", ["playwright", "test", ...process.argv.slice(2)]);

// Prueba de que el servidor usó esta base y no la de .env: aquí deben estar los usuarios de los tests
const client = await MongoClient.connect(env.MONGODB_URI);
const users = await client.db(env.MONGODB_DB).collection("user").countDocuments();
console.log(`\nUsuarios creados en la base en memoria: ${users}`);
await client.close();

await replSet.stop();
process.exit(status);
