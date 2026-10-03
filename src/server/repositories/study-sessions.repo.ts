import type { Db } from "mongodb";
import { SESSION_GAP_MINUTES } from "@/lib/constants";
import { COLLECTIONS, type StudySessionDoc } from "@/server/db-types";

export function createStudySessionsRepo(db: Db) {
  const col = db.collection<StudySessionDoc>(COLLECTIONS.studySessions);

  return {
    /** Extiende la sesión activa (último latido hace ≤ 30 min) o crea una nueva */
    async heartbeat(userId: string, courseId: string, sectionId: string, now = new Date()) {
      const cutoff = new Date(now.getTime() - SESSION_GAP_MINUTES * 60_000);
      const extended = await col.findOneAndUpdate(
        { userId, lastSeenAt: { $gte: cutoff } },
        { $set: { lastSeenAt: now }, $addToSet: { sectionIds: sectionId, courseIds: courseId } },
        { sort: { lastSeenAt: -1 }, returnDocument: "after" },
      );
      if (extended) return extended;

      const session: StudySessionDoc = {
        userId,
        startedAt: now,
        lastSeenAt: now,
        sectionIds: [sectionId],
        courseIds: [courseId],
      };
      await col.insertOne(session);
      return session;
    },

    async recent(userId: string, limit = 15): Promise<StudySessionDoc[]> {
      return col.find({ userId }).sort({ lastSeenAt: -1 }).limit(limit).toArray();
    },
  };
}

export type StudySessionsRepo = ReturnType<typeof createStudySessionsRepo>;
