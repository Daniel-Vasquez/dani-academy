import { HEARTBEAT_INTERVAL_SECONDS, LEVELS, type Level } from "@/lib/constants";
import { buildHeatmap } from "@/lib/domain/heatmap";
import { percent, sessionMinutes } from "@/lib/domain/progress";
import { computeStreak } from "@/lib/domain/streak";
import { dayKey, timezone } from "@/lib/format";
import { repos } from "@/server/repositories";
import { getSyllabusOverview } from "./overview.service";

export async function getProgressDashboard(userId: string) {
  const today = dayKey(new Date());

  const [overview, attempts, recentSessions, totals, allDays] = await Promise.all([
    getSyllabusOverview(userId),
    repos.quizAttempts.recent(userId, 20),
    repos.studySessions.recent(userId, 15),
    repos.studySessions.totals(userId),
    repos.studySessions.minutesByDay(userId, timezone),
  ]);

  const published = overview.filter((o) => o.href);
  const sectionsTotal = published.reduce((acc, o) => acc + o.totalSections, 0);
  const sectionsRead = published.reduce((acc, o) => acc + o.readCount, 0);
  const bestScores = published.flatMap((o) => (o.quiz ? [o.quiz.best] : []));
  const titleById = new Map(overview.map((o) => [o.course.id, o.course.data.title]));
  const hrefById = new Map(overview.map((o) => [o.course.id, o.href]));

  return {
    summary: {
      percent: percent(sectionsRead, sectionsTotal),
      sectionsRead,
      sectionsTotal,
      coursesCompleted: published.filter((o) => o.status === "completed").length,
      coursesPublished: published.length,
      // Media de la MEJOR nota de cada curso con intentos
      averageScore: bestScores.length
        ? bestScores.reduce((a, b) => a + b, 0) / bestScores.length
        : null,
      studyMinutes: totals.minutes,
      sessions: totals.sessions,
      streak: computeStreak(Object.keys(allDays), today),
    },
    byLevel: (Object.keys(LEVELS) as Level[])
      .sort((a, b) => LEVELS[a].order - LEVELS[b].order)
      .map((level) => ({
        level,
        label: LEVELS[level].label,
        items: published.filter((o) => o.course.data.level === level),
        upcoming: overview.filter((o) => !o.href && o.course.data.level === level).length,
      })),
    quizHistory: attempts.map((a) => ({
      courseId: a.courseId,
      score: a.score,
      total: a.total,
      passed: a.passed,
      submittedAt: a.submittedAt,
      courseTitle: titleById.get(a.courseId) ?? a.courseId,
      courseHref: hrefById.get(a.courseId) ?? null,
    })),
    sessions: recentSessions.map((s) => ({
      startedAt: s.startedAt,
      minutes: sessionMinutes(s.startedAt, s.lastSeenAt, HEARTBEAT_INTERVAL_SECONDS),
      sections: s.sectionIds.length,
      courseIds: s.courseIds,
    })),
    heatmap: buildHeatmap(allDays, today, 12),
  };
}

export type ProgressDashboard = Awaited<ReturnType<typeof getProgressDashboard>>;
