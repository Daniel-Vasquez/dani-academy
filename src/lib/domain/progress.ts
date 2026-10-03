export type CourseStatus = "not-started" | "in-progress" | "read" | "completed";

export function percent(done: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(100, Math.round((done / total) * 100));
}

/** read = todas las secciones leídas pero evaluación sin aprobar; completed = todo leído + aprobada */
export function courseStatus(
  readCount: number,
  totalSections: number,
  quizPassed: boolean,
): CourseStatus {
  if (totalSections > 0 && readCount >= totalSections) return quizPassed ? "completed" : "read";
  return readCount === 0 ? "not-started" : "in-progress";
}

/** Duración de una sesión en minutos (se suma un intervalo de latido: el último minuto también cuenta) */
export function sessionMinutes(startedAt: Date, lastSeenAt: Date, heartbeatSeconds = 60): number {
  const ms = lastSeenAt.getTime() - startedAt.getTime() + heartbeatSeconds * 1000;
  return Math.max(1, Math.round(ms / 60_000));
}
