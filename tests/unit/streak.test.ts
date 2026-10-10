import { describe, expect, it } from "vitest";
import { computeStreak } from "@/lib/domain/streak";

const TODAY = "2026-10-09";

describe("computeStreak", () => {
  it("sin días de estudio → 0 y 0", () => {
    expect(computeStreak([], TODAY)).toEqual({ current: 0, longest: 0 });
  });

  it("racha que incluye hoy", () => {
    expect(computeStreak(["2026-10-07", "2026-10-08", "2026-10-09"], TODAY)).toEqual({
      current: 3,
      longest: 3,
    });
  });

  it("racha que acaba ayer: sigue viva si hoy aún no has estudiado", () => {
    expect(computeStreak(["2026-10-07", "2026-10-08"], TODAY).current).toBe(2);
  });

  it("un hueco de un día rompe la racha actual", () => {
    expect(computeStreak(["2026-10-06", "2026-10-07"], TODAY).current).toBe(0);
  });

  it("el récord puede ser una racha antigua", () => {
    const days = ["2026-09-01", "2026-09-02", "2026-09-03", "2026-09-04", "2026-10-09"];
    expect(computeStreak(days, TODAY)).toEqual({ current: 1, longest: 4 });
  });

  it("cruza meses y años bisiestos", () => {
    expect(computeStreak(["2028-02-28", "2028-02-29", "2028-03-01"], "2028-03-01").current).toBe(3);
  });

  it("ignora días repetidos", () => {
    expect(computeStreak(["2026-10-09", "2026-10-09"], TODAY)).toEqual({ current: 1, longest: 1 });
  });
});
