import {
  courseUrl,
  getCourseSections,
  getCourses,
  sectionUrl,
  type Course,
  type Section,
} from "@/lib/content";
import { courseStatus, percent, type CourseStatus } from "@/lib/domain/progress";
import { repos } from "@/server/repositories";
import type { CourseQuizSummary } from "@/server/repositories/quiz-attempts.repo";
import { getQuizByCourseId } from "./quiz.service";

export type OverviewStatus = CourseStatus | "unpublished";

export interface CourseOverview {
  course: Course;
  href: string | null; // null si el curso no está publicado
  totalSections: number;
  readCount: number;
  percent: number;
  status: OverviewStatus;
  hasQuiz: boolean;
  quiz: CourseQuizSummary | null;
  nextSection: Section | null; // primera sección sin leer
}

export async function getSyllabusOverview(userId: string): Promise<CourseOverview[]> {
  const [courses, readIds, quizSummary] = await Promise.all([
    getCourses(),
    repos.progress.allReadSectionIds(userId),
    repos.quizAttempts.summaryByCourse(userId),
  ]);
  const read = new Set(readIds);

  return Promise.all(
    courses.map(async (course): Promise<CourseOverview> => {
      if (!course.data.published) {
        return {
          course,
          href: null,
          totalSections: course.data.plannedSections,
          readCount: 0,
          percent: 0,
          status: "unpublished",
          hasQuiz: false,
          quiz: null,
          nextSection: null,
        };
      }
      const [sections, quizEntry] = await Promise.all([
        getCourseSections(course.id),
        getQuizByCourseId(course.id),
      ]);
      const readCount = sections.filter((s) => read.has(s.data.sectionId)).length;
      const quiz = quizSummary[course.id] ?? null;
      return {
        course,
        href: courseUrl(course),
        totalSections: sections.length,
        readCount,
        percent: percent(readCount, sections.length),
        status: courseStatus(readCount, sections.length, quiz?.passed ?? false),
        hasQuiz: Boolean(quizEntry),
        quiz,
        nextSection: sections.find((s) => !read.has(s.data.sectionId)) ?? null,
      };
    }),
  );
}

export interface ContinueTarget {
  href: string;
  title: string;
  detail: string;
}

/** Decide a dónde lleva "Continuar": último curso tocado → primer curso sin completar → nada */
export function getContinueTarget(
  overview: CourseOverview[],
  lastCourseId?: string,
): ContinueTarget | null {
  const targetFor = (item: CourseOverview): ContinueTarget | null => {
    if (!item.href || item.status === "completed") return null;
    if (item.nextSection) {
      return {
        href: sectionUrl(item.course, item.nextSection),
        title: item.nextSection.data.title,
        detail: `${item.course.id} · ${item.course.data.title} · Sección ${item.nextSection.data.order} de ${item.totalSections}`,
      };
    }
    if (item.hasQuiz) {
      return {
        href: `${item.href}/evaluacion`,
        title: "Evaluación final",
        detail: `${item.course.id} · ${item.course.data.title}`,
      };
    }
    return null;
  };

  const last = overview.find((o) => o.course.id === lastCourseId);
  const fromLast = last && targetFor(last);
  if (fromLast) return fromLast;

  for (const item of overview) {
    const target = targetFor(item);
    if (target) return target;
  }
  return null;
}
