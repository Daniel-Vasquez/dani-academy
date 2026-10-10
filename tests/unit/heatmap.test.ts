import { describe, expect, it } from "vitest";
import { buildHeatmap } from "@/lib/domain/heatmap";

const TODAY = "2026-10-09"; // viernes

describe("buildHeatmap", () => {
  it("devuelve 12 semanas de 7 días", () => {
    const grid = buildHeatmap({}, TODAY);
    expect(grid).toHaveLength(12);
    expect(grid.every((week) => week.length === 7)).toBe(true);
  });

  it("cada columna empieza en lunes y hoy está en la última", () => {
    const grid = buildHeatmap({}, TODAY);
    expect(grid.at(-1)!.map((c) => c.day)).toContain(TODAY);
    expect(grid[0]![0]!.day).toBe("2026-07-20"); // lunes, 11 semanas antes
    expect(new Date(`${grid.at(-1)![0]!.day}T00:00:00Z`).getUTCDay()).toBe(1);
  });

  it("los días posteriores a hoy son futuros", () => {
    const lastWeek = buildHeatmap({}, TODAY).at(-1)!;
    expect(lastWeek.map((c) => c.future)).toEqual([false, false, false, false, false, true, true]);
  });

  it.each([
    [0, 0],
    [1, 1],
    [14, 1],
    [15, 2],
    [29, 2],
    [30, 3],
    [59, 3],
    [60, 4],
    [240, 4],
  ])("%i minutos → nivel %i", (minutes, level) => {
    const cell = buildHeatmap({ [TODAY]: minutes }, TODAY)
      .flat()
      .find((c) => c.day === TODAY)!;
    expect(cell.minutes).toBe(minutes);
    expect(cell.level).toBe(level);
  });

  it("respeta el número de semanas pedido", () => {
    expect(buildHeatmap({}, TODAY, 4)).toHaveLength(4);
  });
});
