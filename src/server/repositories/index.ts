import { db } from "@/lib/mongo";
import { createProgressRepo } from "./progress.repo";
import { createQuizAttemptsRepo } from "./quiz-attempts.repo";
import { createStudySessionsRepo } from "./study-sessions.repo";

/** Punto único donde se conectan los repositorios con la base de datos real. */
export const repos = {
  progress: createProgressRepo(db),
  studySessions: createStudySessionsRepo(db),
  quizAttempts: createQuizAttemptsRepo(db),
};
