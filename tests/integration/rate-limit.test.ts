import { describe, expect, it } from "vitest";
import { db } from "./setup";
import { createRateLimitRepo } from "@/server/repositories/rate-limit.repo";

const NOW = Date.UTC(2026, 9, 9, 10, 0, 30); // 10:00:30 → la ventana de 60 s empieza en 10:00:00

describe("rate-limit.repo", () => {
  it("permite hasta el máximo y bloquea el siguiente", async () => {
    const repo = createRateLimitRepo(db);
    const results = [];
    for (let i = 0; i < 4; i++) results.push(await repo.hit("quiz:u1", 3, 60, NOW));
    expect(results.map((r) => r.allowed)).toEqual([true, true, true, false]);
    expect(results[3]!.retryAfterSeconds).toBe(30);
  });

  it("una ventana nueva reinicia el contador", async () => {
    const repo = createRateLimitRepo(db);
    await repo.hit("k", 1, 60, NOW);
    expect((await repo.hit("k", 1, 60, NOW)).allowed).toBe(false);
    expect((await repo.hit("k", 1, 60, NOW + 30_000)).allowed).toBe(true); // 10:01:00
  });

  it("las claves son independientes", async () => {
    const repo = createRateLimitRepo(db);
    await repo.hit("quiz:u1", 1, 60, NOW);
    expect((await repo.hit("quiz:u2", 1, 60, NOW)).allowed).toBe(true);
    expect((await repo.hit("progress:u1", 1, 60, NOW)).allowed).toBe(true);
  });

  it("peticiones simultáneas cuentan todas, sin errores de clave duplicada", async () => {
    const repo = createRateLimitRepo(db);
    const results = await Promise.all(
      Array.from({ length: 20 }, () => repo.hit("hb:u1", 5, 60, NOW)),
    );
    expect(results.filter((r) => r.allowed)).toHaveLength(5);
    expect(await db.collection("rate_limits").findOne({})).toMatchObject({
      n: 20,
      expiresAt: new Date(Date.UTC(2026, 9, 9, 10, 1, 0)),
    });
  });
});
