import { describe, expect, it, vi } from "vitest";

// Zona fija: el resultado no depende del .env ni de la máquina que ejecute los tests
vi.mock("astro:env/server", () => ({ APP_TIMEZONE: "America/Mexico_City" }));
const { dayKey, formatDate, formatMinutes, timezone } = await import("@/lib/format");

describe("formatMinutes", () => {
  it.each([
    [0, "0 min"],
    [45, "45 min"],
    [60, "1 h"],
    [95, "1 h 35 min"],
    [180, "3 h"],
  ])("%i → %s", (minutes, text) => {
    expect(formatMinutes(minutes)).toBe(text);
  });
});

describe("dayKey", () => {
  it("usa la zona horaria de la app, no UTC", () => {
    // 02:00 UTC del día 2 son las 20:00 del día 1 en Ciudad de México (UTC−6)
    expect(dayKey(new Date("2026-10-02T02:00:00Z"))).toBe("2026-10-01");
    expect(dayKey(new Date("2026-10-02T12:00:00Z"))).toBe("2026-10-02");
    expect(timezone).toBe("America/Mexico_City");
  });
});

describe("formatDate", () => {
  it("formatea en español y en la zona de la app", () => {
    expect(formatDate(new Date("2026-10-02T02:00:00Z"))).toBe("1 oct 2026");
  });
});
