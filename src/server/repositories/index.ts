import { db } from "@/lib/mongo";

/** Punto único donde se conectan los repositorios con la base de datos real. */
export const repos = {
  // progress: createProgressRepo(db),            ← Tanda 4
  // studySessions: createStudySessionsRepo(db),  ← Tanda 4
  // quizAttempts: createQuizAttemptsRepo(db),    ← Tanda 5
};

export { db };
