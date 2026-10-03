import type { Db } from "mongodb";
import { HEARTBEAT_INTERVAL_SECONDS, SESSION_GAP_MINUTES } from "@/lib/constants";
import { COLLECTIONS, type StudySessionDoc } from "@/server/db-types";

const HEARTBEAT_MS = HEARTBEAT_INTERVAL_SECONDS * 1000;
/** Duración de una sesión: del primer al último latido, más el minuto del último latido */
const durationMs = { $add: [{ $subtract: ["$lastSeenAt", "$startedAt"] }, HEARTBEAT_MS] };

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

    async totals(userId: string): Promise<{ sessions: number; minutes: number }> {
      const [row] = await col
        .aggregate<{ sessions: number; ms: number }>([
          { $match: { userId } },
          { $group: { _id: null, sessions: { $sum: 1 }, ms: { $sum: durationMs } } },
        ])
        .toArray();
      return { sessions: row?.sessions ?? 0, minutes: Math.round((row?.ms ?? 0) / 60_000) };
    },

    /** Minutos por día en la zona horaria indicada (la sesión cuenta el día en que empieza) */
    async minutesByDay(
      userId: string,
      timezone: string,
      from?: Date,
    ): Promise<Record<string, number>> {
      const rows = await col
        .aggregate<{ _id: string; ms: number }>([
          { $match: { userId, ...(from && { startedAt: { $gte: from } }) } },
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$startedAt", timezone } },
              ms: { $sum: durationMs },
            },
          },
        ])
        .toArray();
      return Object.fromEntries(rows.map((r) => [r._id, Math.round(r.ms / 60_000)]));
    },
  };
}

export type StudySessionsRepo = ReturnType<typeof createStudySessionsRepo>;
