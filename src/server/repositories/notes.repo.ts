import type { Db } from "mongodb";
import { COLLECTIONS, type NoteDoc } from "@/server/db-types";
import type { NoteContent } from "@/lib/notes/schema";

const DUPLICATE_KEY = 11000;

export interface StoredNote {
  doc: NoteContent;
  rev: number;
  updatedAt: Date;
}

export type SaveNoteResult =
  { ok: true; rev: number; updatedAt: Date } | { ok: false; current: StoredNote | null };

export interface SaveNoteData {
  userId: string;
  courseId: string;
  sectionId: string;
  doc: NoteContent;
  text: string;
  expectedRev: number; // la versión que tenía el editor; 0 = nota nueva
}

/**
 * Control de concurrencia optimista: solo se escribe si la versión guardada es la que
 * el editor dice tener. Si otra pestaña guardó antes, se devuelve la nota actual (409).
 */
export function createNotesRepo(db: Db) {
  const col = db.collection<NoteDoc>(COLLECTIONS.notes);
  const projection = { _id: 0, doc: 1, rev: 1, updatedAt: 1 } as const;

  async function get(userId: string, sectionId: string): Promise<StoredNote | null> {
    return col.findOne<StoredNote>({ userId, sectionId }, { projection });
  }

  return {
    get,

    async save(data: SaveNoteData, now = new Date()): Promise<SaveNoteResult> {
      const { userId, courseId, sectionId, doc, text, expectedRev } = data;

      if (expectedRev === 0) {
        try {
          await col.insertOne({
            userId,
            courseId,
            sectionId,
            doc,
            text,
            rev: 1,
            createdAt: now,
            updatedAt: now,
          });
          return { ok: true, rev: 1, updatedAt: now };
        } catch (error) {
          // Ya existe (otra pestaña la creó): el índice único lo detecta
          if ((error as { code?: number }).code !== DUPLICATE_KEY) throw error;
        }
      } else {
        const updated = await col.findOneAndUpdate(
          { userId, sectionId, rev: expectedRev },
          { $set: { doc, text, updatedAt: now }, $inc: { rev: 1 } },
          { returnDocument: "after", projection: { _id: 0, rev: 1, updatedAt: 1 } },
        );
        if (updated) return { ok: true, rev: updated.rev, updatedAt: updated.updatedAt };
      }

      return { ok: false, current: await get(userId, sectionId) };
    },

    /** Borra la nota (al vaciarla) si nadie la cambió entre medias */
    async remove(userId: string, sectionId: string, expectedRev: number): Promise<SaveNoteResult> {
      const { deletedCount } = await col.deleteOne({ userId, sectionId, rev: expectedRev });
      if (deletedCount === 1) return { ok: true, rev: 0, updatedAt: new Date() };
      return { ok: false, current: await get(userId, sectionId) };
    },
  };
}
