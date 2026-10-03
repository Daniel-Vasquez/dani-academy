/** Suma n días a una clave "YYYY-MM-DD" (aritmética de calendario, sin zona horaria) */
const shift = (day: string, n: number): string => {
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

/**
 * days: claves "YYYY-MM-DD" con estudio (ya en la zona horaria de la app).
 * La racha actual cuenta hasta hoy, o hasta ayer si hoy todavía no has estudiado.
 */
export function computeStreak(days: string[], today: string): { current: number; longest: number } {
  const set = new Set(days);

  let current = 0;
  let cursor = set.has(today) ? today : shift(today, -1);
  while (set.has(cursor)) {
    current++;
    cursor = shift(cursor, -1);
  }

  let longest = 0;
  for (const day of set) {
    if (set.has(shift(day, -1))) continue; // no es el inicio de una racha
    let length = 1;
    let next = shift(day, 1);
    while (set.has(next)) {
      length++;
      next = shift(next, 1);
    }
    longest = Math.max(longest, length);
  }

  return { current, longest };
}
