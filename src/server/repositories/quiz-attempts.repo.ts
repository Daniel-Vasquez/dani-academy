import type { Db } from "mongodb";
import { COLLECTIONS, type QuizAttemptDoc } from "@/server/db-types";

export interface CourseQuizSummary {
  courseId: string;
  attempts: number;
  best: number;
  passed: boolean;
  lastScore: number;
  lastAt: Date;
}

export function createQuizAttemptsRepo(db: Db) {
  const col = db.collection<QuizAttemptDoc>(COLLECTIONS.quizAttempts);

  return {
    async insert(attempt: QuizAttemptDoc) {
      await col.insertOne(attempt);
    },

    async listByCourse(userId: string, courseId: string, limit = 5): Promise<QuizAttemptDoc[]> {
      return col.find({ userId, courseId }).sort({ submittedAt: -1 }).limit(limit).toArray();
    },

    async recent(userId: string, limit = 20): Promise<QuizAttemptDoc[]> {
      return col.find({ userId }).sort({ submittedAt: -1 }).limit(limit).toArray();
    },

    /** Resumen por curso: nº de intentos, mejor nota, si alguna vez aprobó y último intento */
    async summaryByCourse(userId: string): Promise<Record<string, CourseQuizSummary>> {
      const rows = await col
        .aggregate<Omit<CourseQuizSummary, "courseId"> & { _id: string }>([
          { $match: { userId } },
          { $sort: { submittedAt: -1 } },
          {
            $group: {
              _id: "$courseId",
              attempts: { $sum: 1 },
              best: { $max: "$score" },
              passed: { $max: "$passed" }, // true > false en el orden BSON
              lastScore: { $first: "$score" },
              lastAt: { $first: "$submittedAt" },
            },
          },
        ])
        .toArray();
      return Object.fromEntries(rows.map(({ _id, ...r }) => [_id, { ...r, courseId: _id }]));
    },
  };
}

export type QuizAttemptsRepo = ReturnType<typeof createQuizAttemptsRepo>;
