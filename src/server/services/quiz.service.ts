import { getCollection, type CollectionEntry } from "astro:content";
import { QUIZ_REQUIRES_ALL_SECTIONS, RATE_LIMITS } from "@/lib/constants";
import { getCourseSections } from "@/lib/content";
import { gradeQuiz } from "@/lib/domain/quiz";
import { ForbiddenError, NotFoundError } from "@/lib/errors";
import { repos } from "@/server/repositories";
import { enforceRateLimit } from "@/server/services/rate-limit.service";

export type Quiz = CollectionEntry<"quizzes">;

export interface PublicQuestion {
  prompt: string;
  code?: string;
  options: string[];
}

export interface QuestionReview {
  correctAnswer: number;
  explanation: string;
  isCorrect: boolean;
}

export async function getQuizByCourseId(courseId: string): Promise<Quiz | undefined> {
  const [quiz] = await getCollection("quizzes", (q) => q.data.course.id === courseId);
  return quiz;
}

/** Lo único que viaja al navegador antes de corregir: sin `answer` ni `explanation` */
export function toPublicQuestions(quiz: Quiz): PublicQuestion[] {
  return quiz.data.questions.map(({ prompt, code, options }) => ({ prompt, code, options }));
}

export async function getQuizAccess(userId: string, courseId: string) {
  const sections = await getCourseSections(courseId);
  const read = new Set(await repos.progress.readSectionIds(userId, courseId));
  const pending = sections.filter((s) => !read.has(s.data.sectionId));
  return {
    unlocked: !QUIZ_REQUIRES_ALL_SECTIONS || pending.length === 0,
    remaining: pending.length,
    firstPending: pending[0],
  };
}

export async function submitQuiz(userId: string, courseId: string, answers: number[]) {
  await enforceRateLimit(`quiz:${userId}`, RATE_LIMITS.quiz);

  const quiz = await getQuizByCourseId(courseId);
  if (!quiz) throw new NotFoundError("Este curso no tiene evaluación");

  const access = await getQuizAccess(userId, courseId);
  if (!access.unlocked) {
    throw new ForbiddenError(
      access.remaining === 1
        ? "Te falta 1 sección por leer"
        : `Te faltan ${access.remaining} secciones por leer`,
    );
  }

  const { questions, passingScore } = quiz.data;
  const grade = gradeQuiz(
    questions.map((q) => q.answer),
    answers,
    passingScore,
  );

  await repos.quizAttempts.insert({ userId, courseId, answers, ...grade, submittedAt: new Date() });

  const review: QuestionReview[] = questions.map((q, i) => ({
    correctAnswer: q.answer,
    explanation: q.explanation,
    isCorrect: grade.results[i] ?? false,
  }));

  return { score: grade.score, total: grade.total, passed: grade.passed, passingScore, review };
}

export type SubmitQuizResult = Awaited<ReturnType<typeof submitQuiz>>;
