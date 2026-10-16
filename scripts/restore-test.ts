/**
 * Uso: npm run db:restore-test [-- backups/archivo.json.gz]   (sin archivo: el más reciente)
 *
 * Restaura una copia de backup.ts y comprueba que es idéntica: mismas colecciones,
 * mismo número de documentos, mismo contenido (hash de cada colección), mismos
 * índices y validadores. Termina con código 1 si algo no coincide.
 *
 * Por defecto restaura en un MongoDB TEMPORAL en memoria (mongodb-memory-server):
 * no toca Atlas, no necesita permisos de escritura y se borra al terminar.
 *
 * Restauración real (un desastre): RESTORE_URI y RESTORE_DB apuntan al destino.
 * Por seguridad, el script se niega a escribir en una base de datos que no esté vacía.
 */
import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { gunzipSync } from "node:zlib";
import { BSON, MongoClient, type Db, type Document } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";
import { BACKUP_FORMAT, type BackupFile } from "./backup-format";

const { EJSON } = BSON;

const dir = process.env.BACKUP_DIR || "backups";

async function latestBackup(): Promise<string> {
  const files = (await readdir(dir).catch(() => [] as string[]))
    .filter((f) => f.endsWith(".json.gz"))
    .sort();
  const last = files.at(-1);
  if (!last) {
    console.error(`✖ No hay copias en ${dir}/. Crea una con: npm run db:backup`);
    process.exit(1);
  }
  return join(dir, last);
}

/** Huella del contenido de una lista de documentos (EJSON canónico, en orden de _id) */
const hash = (docs: Document[]) =>
  createHash("sha256")
    .update(EJSON.stringify(docs, { relaxed: false }))
    .digest("hex")
    .slice(0, 12);

const indexKey = (i: Document) =>
  `${i.name}:${JSON.stringify(i.key)}:${i.unique ? "u" : ""}:${i.expireAfterSeconds ?? ""}`;

async function restore(db: Db, backup: BackupFile) {
  for (const c of backup.collections) {
    await db.createCollection(c.name, c.options);
    const col = db.collection(c.name);
    // bypassDocumentValidation: se restaura lo que había, aunque un validador posterior sea más estricto
    if (c.documents.length)
      await col.insertMany(c.documents, { ordered: true, bypassDocumentValidation: true });
    if (c.indexes.length) await col.createIndexes(c.indexes as never);
  }
}

async function verify(db: Db, backup: BackupFile): Promise<boolean> {
  let ok = true;
  const restored = new Map(
    (await db.listCollections({}, { nameOnly: false }).toArray()).map((i) => [i.name, i]),
  );
  for (const c of backup.collections) {
    const col = db.collection(c.name);
    const docs = await col.find({}, { sort: { _id: 1 } }).toArray();
    const indexes = (await col.listIndexes().toArray()).filter((i) => i.name !== "_id_");
    const checks = {
      docs: docs.length === c.documents.length,
      contenido: hash(docs) === hash(c.documents),
      indices: indexes.map(indexKey).sort().join() === c.indexes.map(indexKey).sort().join(),
      validador:
        JSON.stringify(restored.get(c.name)?.options?.validator ?? null) ===
        JSON.stringify(c.options.validator ?? null),
    };
    const good = Object.values(checks).every(Boolean);
    ok &&= good;
    const fallos = Object.entries(checks)
      .filter(([, v]) => !v)
      .map(([k]) => k);
    console.log(
      `  ${good ? "✓" : "✗"} ${c.name.padEnd(20)} ${String(docs.length).padStart(6)} docs · hash ${hash(docs)} · ${indexes.length} índices${fallos.length ? ` · NO coincide: ${fallos.join(", ")}` : ""}`,
    );
  }
  return ok;
}

const file = process.argv[2] ?? (await latestBackup());
async function readBackup(path: string): Promise<BackupFile | null> {
  try {
    return EJSON.parse(gunzipSync(await readFile(path)).toString("utf8"), {
      relaxed: false,
    }) as BackupFile;
  } catch (error) {
    console.error(
      `✖ No se puede leer ${path}: ${error instanceof Error ? error.message.split("\n")[0] : String(error)}`,
    );
    return null;
  }
}

const backup = await readBackup(file);
if (!backup) process.exit(1);
if (backup.format !== BACKUP_FORMAT) {
  console.error(`✖ ${file} no es una copia de backup.ts (formato «${String(backup.format)}»)`);
  process.exit(1);
}

const realTarget = process.env.RESTORE_URI;
const memory = realTarget ? null : await MongoMemoryServer.create();
const client = new MongoClient(realTarget ?? memory!.getUri(), {
  serverSelectionTimeoutMS: 10_000,
});
const targetDb = realTarget ? process.env.RESTORE_DB : `${backup.db}_restore_test`;

let ok = false;
try {
  if (!targetDb)
    throw new Error("Con RESTORE_URI hace falta RESTORE_DB (la base de datos de destino)");
  const db = client.db(targetDb);
  if ((await db.listCollections({}, { nameOnly: true }).toArray()).length > 0) {
    throw new Error(
      `La base de datos «${targetDb}» no está vacía: no se restaura encima de datos existentes`,
    );
  }

  console.log(`Copia: ${file} · base «${backup.db}» · creada ${backup.createdAt}`);
  console.log(
    `Destino: «${targetDb}» ${realTarget ? "(RESTORE_URI)" : "en un MongoDB temporal en memoria"}`,
  );
  const start = performance.now();
  await restore(db, backup);
  ok = await verify(db, backup);
  console.log(
    `${ok ? "✓ Restauración verificada" : "✗ La restauración NO coincide con la copia"} (${((performance.now() - start) / 1000).toFixed(1)} s)`,
  );
} catch (error) {
  console.error(`✖ ${error instanceof Error ? error.message : String(error)}`);
} finally {
  await client.close();
  await memory?.stop();
}
process.exit(ok ? 0 : 1);
