import { describe, expect, it } from "vitest";
import { db } from "./setup";
import { createQuizAttemptsRepo } from "@/server/repositories/quiz-attempts.repo";
import type { QuizAttemptDoc } from "@/server/db-types";

const attempt = (courseId: string, score: number, submittedAt: string): QuizAttemptDoc => ({
  userId: "u1",
  courseId,
  answers: [0, 0, 0, 0, 0],
  results: Array.from({ length: 5 }, (_, i) => i < score),
  score,
  total: 5,
  passed: score >= 4,
  submittedAt: new Date(submittedAt),
});

describe("quiz-attempts.repo", () => {
  it("summaryByCourse: intentos, mejor nota, aprobado alguna vez y último intento", async () => {
    const repo = createQuizAttemptsRepo(db);
    await repo.insert(attempt("B1", 3, "2026-10-01T10:00:00Z"));
    await repo.insert(attempt("B1", 5, "2026-10-02T10:00:00Z"));
    await repo.insert(attempt("B1", 2, "2026-10-03T10:00:00Z"));
    await repo.insert(attempt("B2", 1, "2026-10-04T10:00:00Z"));

    const summary = await repo.summaryByCourse("u1");
    expect(summary.B1).toEqual({
      courseId: "B1",
      attempts: 3,
      best: 5,
      passed: true, // aprobó una vez, aunque el último intento suspendiera
      lastScore: 2,
      lastAt: new Date("2026-10-03T10:00:00Z"),
    });
    expect(summary.B2).toMatchObject({ attempts: 1, best: 1, passed: false });
    expect(await repo.summaryByCourse("u2")).toEqual({});
  });

  it("listByCourse ordena del más reciente al más antiguo y respeta el límite", async () => {
    const repo = createQuizAttemptsRepo(db);
    for (let day = 1; day <= 7; day++) {
      await repo.insert(attempt("B1", day % 6, `2026-10-0${day}T10:00:00Z`));
    }
    const list = await repo.listByCourse("u1", "B1");
    expect(list).toHaveLength(5);
    expect(list[0]!.submittedAt).toEqual(new Date("2026-10-07T10:00:00Z"));
    expect((await repo.recent("u1", 2)).map((a) => a.submittedAt.getUTCDate())).toEqual([7, 6]);
  });
});
