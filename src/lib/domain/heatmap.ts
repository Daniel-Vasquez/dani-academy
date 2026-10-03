export interface HeatCell {
  day: string; // "YYYY-MM-DD"
  minutes: number;
  level: 0 | 1 | 2 | 3 | 4;
  future: boolean;
}

const levelFor = (m: number): HeatCell["level"] =>
  m === 0 ? 0 : m < 15 ? 1 : m < 30 ? 2 : m < 60 ? 3 : 4;

/**
 * Columnas = semanas (lunes a domingo); la última contiene `today`.
 * Trabaja con claves de día ya convertidas a la zona de la app: la aritmética UTC
 * de aquí solo recorre el calendario, no cambia de zona.
 */
export function buildHeatmap(
  minutesByDay: Record<string, number>,
  today: string,
  weeks = 12,
): HeatCell[][] {
  const todayDate = new Date(`${today}T00:00:00Z`);
  const weekday = (todayDate.getUTCDay() + 6) % 7; // 0 = lunes
  const start = new Date(todayDate);
  start.setUTCDate(start.getUTCDate() - weekday - (weeks - 1) * 7);

  return Array.from({ length: weeks }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => {
      const date = new Date(start);
      date.setUTCDate(start.getUTCDate() + w * 7 + d);
      const day = date.toISOString().slice(0, 10);
      const minutes = minutesByDay[day] ?? 0;
      return { day, minutes, level: levelFor(minutes), future: day > today };
    }),
  );
}
