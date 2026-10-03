import type { ObjectId } from "mongodb";

export const COLLECTIONS = {
  sectionProgress: "section_progress",
  quizAttempts: "quiz_attempts",
  studySessions: "study_sessions",
  rateLimits: "rate_limits",
} as const;

export interface SectionProgressDoc {
  _id?: ObjectId;
  userId: string;
  courseId: string;
  sectionId: string;
  readAt: Date;
}

export interface QuizAttemptDoc {
  _id?: ObjectId;
  userId: string;
  courseId: string;
  answers: number[];
  results: boolean[];
  score: number;
  total: number;
  passed: boolean;
  submittedAt: Date;
}

export interface StudySessionDoc {
  _id?: ObjectId;
  userId: string;
  startedAt: Date;
  lastSeenAt: Date;
  sectionIds: string[];
  courseIds: string[];
}

export interface RateLimitDoc {
  _id: string; // "<clave>:<ventana>"
  n: number;
  expiresAt: Date;
}
