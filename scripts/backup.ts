/**
 * Uso: npm run db:backup
 * Copia de seguridad de una base de datos completa en un único archivo comprimido
 * (backups/<base>-<fecha>.json.gz): documentos en EJSON canónico (conserva ObjectId,
 * Date, etc.), opciones de cada colección (validadores $jsonSchema) e índices.
 *
 * Solo LEE: basta con un usuario de Atlas con rol `read` sobre la base de datos.
 * Variables (en .env.backup.local o en la terminal): MONGODB_URI, MONGODB_DB y,
 * opcional, BACKUP_DIR (por defecto, backups/).
 *
 * Comprobar que la copia se puede restaurar: npm run db:restore-test
 */
import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { gzipSync } from "node:zlib";
import { BSON, MongoClient } from "mongodb";
import { BACKUP_FORMAT, type BackupCollection, type BackupFile } from "./backup-format";

const { EJSON } = BSON;

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;
const dir = process.env.BACKUP_DIR || "backups";

// Sin valores por defecto: una copia debe decir siempre DE QUÉ base de datos es
if (!uri?.startsWith("mongodb")) {
  console.error("✖ MONGODB_URI falta o no empieza por mongodb (¿has creado .env.backup.local?)");
  process.exit(1);
}
if (!dbName) {
  console.error("✖ Falta MONGODB_DB: indica qué base de datos copiar (p. ej., dani_academy)");
  process.exit(1);
}

const client = new MongoClient(uri, {
  appName: "dani-academy-backup",
  serverSelectionTimeoutMS: 10_000,
});

/** Hace la copia; devuelve el código de salida */
const backup = async (): Promise<number> => {
  const db = client.db(dbName);
  const infos = await db.listCollections({}, { nameOnly: false }).toArray();
  const collections: BackupCollection[] = [];

  for (const info of infos) {
    if (info.type !== "collection" || info.name.startsWith("system.")) continue;
    const col = db.collection(info.name);
    const indexes = (await col.listIndexes().toArray())
      .filter((i) => i.name !== "_id_")
      // v y ns los pone el servidor: no forman parte de la definición del índice
      .map((spec) =>
        Object.fromEntries(Object.entries(spec).filter(([k]) => k !== "v" && k !== "ns")),
      );
    const documents = await col.find({}, { sort: { _id: 1 } }).toArray();
    collections.push({ name: info.name, options: info.options ?? {}, indexes, documents });
  }

  // MongoDB no da error con una base que no existe: devuelve cero colecciones. Una copia vacía no sirve.
  if (collections.length === 0) {
    console.error(
      `✖ «${dbName}» no tiene colecciones: ¿el nombre es correcto? No se ha escrito ninguna copia.`,
    );
    return 1;
  }

  collections.sort((a, b) => a.name.localeCompare(b.name));
  const file: BackupFile = {
    format: BACKUP_FORMAT,
    db: dbName,
    createdAt: new Date().toISOString(),
    collections,
  };
  const gz = gzipSync(EJSON.stringify(file, { relaxed: false }));

  await mkdir(dir, { recursive: true });
  const path = join(dir, `${dbName}-${file.createdAt.replace(/[:.]/g, "-")}.json.gz`);
  await writeFile(path, gz, { mode: 0o600 }); // solo tu usuario puede leerlo: contiene datos personales

  console.log(`✓ Copia de «${dbName}» en ${path} (${(gz.length / 1024).toFixed(1)} KB)`);
  for (const c of collections) {
    console.log(
      `  ${c.name.padEnd(20)} ${String(c.documents.length).padStart(6)} docs · ${c.indexes.length} índices`,
    );
  }
  console.log(`  sha256 ${createHash("sha256").update(gz).digest("hex")}`);
  return 0;
};

try {
  process.exitCode = await backup();
} finally {
  await client.close();
}
