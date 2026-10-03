// Solo para el servidor (páginas .astro): lee la zona horaria de astro:env/server
import { APP_TIMEZONE } from "astro:env/server";

const dateTime = new Intl.DateTimeFormat("es", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: APP_TIMEZONE,
});
const dateOnly = new Intl.DateTimeFormat("es", { dateStyle: "medium", timeZone: APP_TIMEZONE });
const dayKeyFmt = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: APP_TIMEZONE,
});

export const formatDateTime = (d: Date) => dateTime.format(d);
export const formatDate = (d: Date) => dateOnly.format(d);
/** "2026-10-02" en la zona horaria de la app (para agrupar por días) */
export const dayKey = (d: Date) => dayKeyFmt.format(d);
export const timezone = APP_TIMEZONE;

export function formatMinutes(total: number): string {
  if (total < 60) return `${total} min`;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}
