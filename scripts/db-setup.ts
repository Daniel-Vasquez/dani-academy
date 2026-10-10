/**
 * Uso: npm run db:setup
 * Crea (o actualiza) colecciones con validación $jsonSchema e índices. Es idempotente.
 */
import {
  MongoClient,
  MongoServerError,
  type CreateIndexesOptions,
  type Db,
  type Document,
  type IndexSpecification,
} from "mongodb";
import { COLLECTIONS } from "../src/server/db-types";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "dani_academy";
if (!uri) {
  console.error("✖ Falta MONGODB_URI (¿has creado el archivo .env?)");
  process.exit(1);
}

const COURSE_ID = "^([BIA][1-8]|P1)$";
const SECTION_ID = "^([BIA][1-8]|P1)\\.\\d{1,2}$";

const validators: Record<string, Document> = {
  [COLLECTIONS.sectionProgress]: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "courseId", "sectionId", "readAt"],
      properties: {
        userId: { bsonType: "string", minLength: 1 },
        courseId: { bsonType: "string", pattern: COURSE_ID },
        sectionId: { bsonType: "string", pattern: SECTION_ID },
        readAt: { bsonType: "date" },
      },
    },
  },
  [COLLECTIONS.quizAttempts]: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "userId",
        "courseId",
        "answers",
        "results",
        "score",
        "total",
        "passed",
        "submittedAt",
      ],
      properties: {
        userId: { bsonType: "string", minLength: 1 },
        courseId: { bsonType: "string", pattern: COURSE_ID },
        answers: {
          bsonType: "array",
          minItems: 5,
          maxItems: 5,
          items: { bsonType: "number", minimum: 0, maximum: 3 },
        },
        results: { bsonType: "array", minItems: 5, maxItems: 5, items: { bsonType: "bool" } },
        score: { bsonType: "number", minimum: 0, maximum: 5 },
        total: { bsonType: "number", minimum: 5, maximum: 5 },
        passed: { bsonType: "bool" },
        submittedAt: { bsonType: "date" },
      },
    },
  },
  [COLLECTIONS.studySessions]: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "startedAt", "lastSeenAt", "sectionIds", "courseIds"],
      properties: {
        userId: { bsonType: "string", minLength: 1 },
        startedAt: { bsonType: "date" },
        lastSeenAt: { bsonType: "date" },
        sectionIds: { bsonType: "array", items: { bsonType: "string", pattern: SECTION_ID } },
        courseIds: { bsonType: "array", items: { bsonType: "string", pattern: COURSE_ID } },
      },
    },
  },
};

type IndexDef = [collection: string, spec: IndexSpecification, options?: CreateIndexesOptions];

const indexes: IndexDef[] = [
  // Propias
  [
    COLLECTIONS.sectionProgress,
    { userId: 1, sectionId: 1 },
    { unique: true, name: "user_section_unique" },
  ],
  [COLLECTIONS.sectionProgress, { userId: 1, courseId: 1 }, { name: "user_course" }],
  [COLLECTIONS.sectionProgress, { userId: 1, readAt: -1 }, { name: "user_readAt" }],
  [
    COLLECTIONS.quizAttempts,
    { userId: 1, courseId: 1, submittedAt: -1 },
    { name: "user_course_submittedAt" },
  ],
  [COLLECTIONS.quizAttempts, { userId: 1, submittedAt: -1 }, { name: "user_submittedAt" }],
  [COLLECTIONS.studySessions, { userId: 1, lastSeenAt: -1 }, { name: "user_lastSeenAt" }],
  // Tanda 9: Mongo borra cada ventana de rate limiting cuando llega su expiresAt
  [COLLECTIONS.rateLimits, { expiresAt: 1 }, { expireAfterSeconds: 0, name: "ttl" }],
  // Better Auth (Tanda 3): consultas por email, token y userId
  ["user", { email: 1 }, { unique: true, name: "email_unique" }],
  ["session", { token: 1 }, { unique: true, name: "token_unique" }],
  ["session", { userId: 1 }, { name: "userId" }],
  ["account", { userId: 1 }, { name: "userId" }],
  // Better Auth rate limiting (Tanda 9): una fila por IP y ruta
  ["rateLimit", { key: 1 }, { unique: true, name: "key_unique" }],
];

const UNAUTHORIZED = 13;

async function ensureCollection(db: Db, name: string, validator: Document) {
  const exists = (await db.listCollections({ name }, { nameOnly: true }).toArray()).length > 0;
  const options = { validator, validationLevel: "strict", validationAction: "error" } as const;

  if (!exists) {
    await db.createCollection(name, options);
    console.log(`＋ ${name}: creada con validación`);
    return;
  }

  try {
    await db.command({ collMod: name, ...options });
    console.log(`↻ ${name}: validación actualizada`);
  } catch (error) {
    // `collMod` requiere el rol dbAdmin; con readWrite la colección conserva su validador anterior
    if (error instanceof MongoServerError && error.code === UNAUTHORIZED) {
      console.warn(
        `⚠ ${name}: ya existe; no se actualizó la validación (el usuario necesita el rol dbAdmin para collMod)`,
      );
      return;
    }
    throw error;
  }
}

async function main() {
  const client = new MongoClient(uri!, {
    appName: "dani-academy-setup",
    serverSelectionTimeoutMS: 10_000,
  });
  try {
    const db = client.db(dbName);
    console.log(`Base de datos: ${dbName}`);

    for (const [name, validator] of Object.entries(validators)) {
      await ensureCollection(db, name, validator);
    }

    let warnings = 0;
    for (const [collection, spec, options] of indexes) {
      try {
        const name = await db.collection(collection).createIndex(spec, options);
        console.log(`✓ índice ${collection}.${name}`);
      } catch (error) {
        warnings++;
        console.warn(`⚠ índice ${collection} ${JSON.stringify(spec)}: ${(error as Error).message}`);
      }
    }
    console.log(warnings === 0 ? "Listo." : `Listo, con ${warnings} aviso(s).`);
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error("✖", error instanceof Error ? error.message : error);
  process.exit(1);
});
