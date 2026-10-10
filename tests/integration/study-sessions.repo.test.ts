import { describe, expect, it } from "vitest";
import { db } from "./setup";
import { createStudySessionsRepo } from "@/server/repositories/study-sessions.repo";

const at = (iso: string) => new Date(iso);

describe("study-sessions.repo", () => {
  it("un latido dentro de 30 minutos extiende la sesión activa", async () => {
    const repo = createStudySessionsRepo(db);
    await repo.heartbeat("u1", "B1", "B1.1", at("2026-10-01T10:00:00Z"));
    await repo.heartbeat("u1", "B1", "B1.2", at("2026-10-01T10:25:00Z"));

    const sessions = await repo.recent("u1");
    expect(sessions).toHaveLength(1);
    expect(sessions[0]!.lastSeenAt).toEqual(at("2026-10-01T10:25:00Z"));
    expect(sessions[0]!.sectionIds).toEqual(["B1.1", "B1.2"]);
    expect(sessions[0]!.courseIds).toEqual(["B1"]);
  });

  it("más de 30 minutos sin latidos crea una sesión nueva", async () => {
    const repo = createStudySessionsRepo(db);
    await repo.heartbeat("u1", "B1", "B1.1", at("2026-10-01T10:00:00Z"));
    await repo.heartbeat("u1", "B1", "B1.1", at("2026-10-01T10:31:00Z"));
    expect(await repo.recent("u1")).toHaveLength(2);
  });

  it("totales: número de sesiones y minutos (con el minuto del último latido)", async () => {
    const repo = createStudySessionsRepo(db);
    await repo.heartbeat("u1", "B1", "B1.1", at("2026-10-01T10:00:00Z"));
    await repo.heartbeat("u1", "B1", "B1.1", at("2026-10-01T10:20:00Z")); // 21 min
    await repo.heartbeat("u1", "B1", "B1.1", at("2026-10-02T10:00:00Z")); // 1 min
    expect(await repo.totals("u1")).toEqual({ sessions: 2, minutes: 22 });
    expect(await repo.totals("u2")).toEqual({ sessions: 0, minutes: 0 });
  });

  it("minutesByDay agrupa por día en la zona horaria indicada", async () => {
    const repo = createStudySessionsRepo(db);
    // 02:00 UTC del día 2 = 20:00 del día 1 en Ciudad de México (UTC−6)
    await repo.heartbeat("u1", "B1", "B1.1", at("2026-10-02T02:00:00Z"));
    await repo.heartbeat("u1", "B1", "B1.1", at("2026-10-02T02:09:00Z"));

    expect(await repo.minutesByDay("u1", "America/Mexico_City")).toEqual({ "2026-10-01": 10 });
    expect(await repo.minutesByDay("u1", "UTC")).toEqual({ "2026-10-02": 10 });
  });

  it("minutesByDay filtra desde una fecha", async () => {
    const repo = createStudySessionsRepo(db);
    await repo.heartbeat("u1", "B1", "B1.1", at("2026-09-01T12:00:00Z"));
    await repo.heartbeat("u1", "B1", "B1.1", at("2026-10-01T12:00:00Z"));
    expect(await repo.minutesByDay("u1", "UTC", at("2026-09-15T00:00:00Z"))).toEqual({
      "2026-10-01": 1,
    });
  });
});
