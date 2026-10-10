import { describe, expect, it } from "vitest";
import { courseStatus, percent, sessionMinutes } from "@/lib/domain/progress";

describe("percent", () => {
  it.each([
    [0, 8, 0],
    [3, 8, 38],
    [8, 8, 100],
    [9, 8, 100], // nunca más del 100 %
    [3, 0, 0], // curso sin secciones
  ])("%i de %i → %i %%", (done, total, expected) => {
    expect(percent(done, total)).toBe(expected);
  });
});

describe("courseStatus", () => {
  it.each([
    [0, 8, false, "not-started"],
    [3, 8, false, "in-progress"],
    [3, 8, true, "in-progress"],
    [8, 8, false, "read"],
    [8, 8, true, "completed"],
    [0, 0, false, "not-started"],
  ] as const)("%i/%i leídas, aprobada=%s → %s", (read, total, passed, expected) => {
    expect(courseStatus(read, total, passed)).toBe(expected);
  });
});

describe("sessionMinutes", () => {
  const start = new Date("2026-10-01T10:00:00Z");

  it("suma el minuto del último latido", () => {
    expect(sessionMinutes(start, new Date("2026-10-01T10:20:00Z"))).toBe(21);
  });

  it("una sesión de un solo latido dura 1 minuto", () => {
    expect(sessionMinutes(start, start)).toBe(1);
  });

  it("nunca devuelve menos de 1 minuto", () => {
    expect(sessionMinutes(start, start, 0)).toBe(1);
  });
});
