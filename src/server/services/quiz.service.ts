import { getCollection, type CollectionEntry } from "astro:content";
import { QUIZ_REQUIRES_ALL_SECTIONS, RATE_LIMITS } from "@/lib/constants";
import { getCourseSections } from "@/lib/content";
import { gradeQuiz } from "@/lib/domain/quiz";
import { BadRequestError, ForbiddenError, NotFoundError } from "@/lib/errors";
import { repos } from "@/server/repositories";
import { enforceRateLimit } from "@/server/services/rate-limit.service";

export type Quiz = CollectionEntry<"quizzes">;

export interface PublicQuestion {
  prompt: string;
  code?: string;
  options: string[];
}

/** Pregunta abierta (modo "self"): la rúbrica no es secreta, se enseña tras escribir la respuesta */
export interface SelfQuestion {
  prompt: string;
  rubric: string[];
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
  if (quiz.data.mode !== "choice") return [];
  return quiz.data.questions.map(({ prompt, code, options }) => ({ prompt, code, options }));
}

export function toSelfQuestions(quiz: Quiz): SelfQuestion[] {
  if (quiz.data.mode !== "self") return [];
  return quiz.data.questions.map(({ prompt, rubric }) => ({ prompt, rubric }));
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

  const { passingScore } = quiz.data;

  // Autoevaluación: cada respuesta es 1 ("Cumple") o 0, así que la clave es todo unos.
  // El texto de las reflexiones no sale del navegador; solo se guarda el juicio de cada una
  if (quiz.data.mode === "self") {
    if (answers.some((a) => a !== 0 && a !== 1)) {
      throw new BadRequestError("Cada respuesta tiene que ser 1 (cumple) o 0 (no cumple)");
    }
    const grade = gradeQuiz(
      quiz.data.questions.map(() => 1),
      answers,
      passingScore,
    );
    await repos.quizAttempts.insert({
      userId,
      courseId,
      answers,
      ...grade,
      submittedAt: new Date(),
    });
    return {
      score: grade.score,
      total: grade.total,
      passed: grade.passed,
      passingScore,
      review: [],
    };
  }

  const { questions } = quiz.data;
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
