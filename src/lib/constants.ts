export const LEVELS = {
  basic: { label: "Básico", order: 1 },
  intermediate: { label: "Intermedio", order: 2 },
  advanced: { label: "Avanzado", order: 3 },
  final: { label: "Proyecto final", order: 4 },
} as const;

export type Level = keyof typeof LEVELS;

export const COURSE_ID_REGEX = /^([BIA][1-8]|P1)$/;
export const SECTION_ID_REGEX = /^([BIA][1-8]|P1)\.\d{1,2}$/;

export const QUIZ_QUESTIONS = 5;
export const DEFAULT_PASSING_SCORE = 4; // 4 de 5 para aprobar
export const QUIZ_REQUIRES_ALL_SECTIONS = true; // la evaluación se desbloquea al leer todo el curso

export const HEARTBEAT_INTERVAL_SECONDS = 60; // un latido por minuto con la pestaña visible
export const SESSION_GAP_MINUTES = 30; // más de 30 min sin latidos → sesión nueva
export const IDLE_AFTER_MINUTES = 5; // sin interacción durante 5 min → no se cuentan latidos

export const THEME_STORAGE_KEY = "da-theme";
