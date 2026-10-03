import type { OverviewStatus } from "@/server/services/overview.service";

type Tone = "neutral" | "accent" | "info" | "warning";

/** Etiqueta y tono del Badge para cada estado de curso (temario y página de progreso) */
export const COURSE_STATUS: Record<OverviewStatus, { label: string; tone: Tone }> = {
  "not-started": { label: "Sin empezar", tone: "neutral" },
  "in-progress": { label: "En curso", tone: "info" },
  read: { label: "Falta la evaluación", tone: "warning" },
  completed: { label: "Completado", tone: "accent" },
  unpublished: { label: "Próximamente", tone: "neutral" },
};
