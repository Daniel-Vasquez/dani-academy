import type { Db } from "mongodb";
import { COLLECTIONS, type SectionProgressDoc } from "@/server/db-types";

const DUPLICATE_KEY = 11000;

export function createProgressRepo(db: Db) {
  const col = db.collection<SectionProgressDoc>(COLLECTIONS.sectionProgress);

  return {
    /** Idempotente: marcar dos veces no duplica ni cambia la fecha original */
    async markRead(userId: string, courseId: string, sectionId: string, now = new Date()) {
      try {
        await col.updateOne(
          { userId, sectionId },
          { $setOnInsert: { courseId, readAt: now } },
          { upsert: true },
        );
      } catch (error) {
        // Dos peticiones simultáneas: la segunda choca con el índice único → ya está marcada
        if ((error as { code?: number }).code !== DUPLICATE_KEY) throw error;
      }
    },

    async unmarkRead(userId: string, sectionId: string) {
      await col.deleteOne({ userId, sectionId });
    },

    async readSectionIds(userId: string, courseId: string): Promise<string[]> {
      const docs = await col
        .find({ userId, courseId }, { projection: { _id: 0, sectionId: 1 } })
        .toArray();
      return docs.map((d) => d.sectionId);
    },

    async allReadSectionIds(userId: string): Promise<string[]> {
      const docs = await col.find({ userId }, { projection: { _id: 0, sectionId: 1 } }).toArray();
      return docs.map((d) => d.sectionId);
    },

    async lastRead(userId: string): Promise<SectionProgressDoc | null> {
      return col.find({ userId }).sort({ readAt: -1 }).limit(1).next();
    },
  };
}

export type ProgressRepo = ReturnType<typeof createProgressRepo>;
