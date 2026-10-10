import { describe, expect, it } from "vitest";
import { db } from "./setup";
import { createProgressRepo } from "@/server/repositories/progress.repo";

describe("progress.repo", () => {
  it("marcar dos veces no duplica y conserva la fecha original", async () => {
    const repo = createProgressRepo(db);
    const first = new Date("2026-10-01T10:00:00Z");
    await repo.markRead("u1", "B1", "B1.1", first);
    await repo.markRead("u1", "B1", "B1.1", new Date("2026-10-02T10:00:00Z"));

    const docs = await db.collection("section_progress").find({ userId: "u1" }).toArray();
    expect(docs).toHaveLength(1);
    expect(docs[0]!.readAt).toEqual(first);
  });

  it("aísla el progreso entre usuarios", async () => {
    const repo = createProgressRepo(db);
    await repo.markRead("u1", "B1", "B1.1");
    expect(await repo.readSectionIds("u2", "B1")).toEqual([]);
  });

  it("marcados en paralelo no lanzan error", async () => {
    const repo = createProgressRepo(db);
    await Promise.all(Array.from({ length: 5 }, () => repo.markRead("u1", "B1", "B1.2")));
    expect(await repo.readSectionIds("u1", "B1")).toEqual(["B1.2"]);
  });

  it("desmarcar borra solo esa sección", async () => {
    const repo = createProgressRepo(db);
    await repo.markRead("u1", "B1", "B1.1");
    await repo.markRead("u1", "B1", "B1.2");
    await repo.unmarkRead("u1", "B1.1");
    expect(await repo.readSectionIds("u1", "B1")).toEqual(["B1.2"]);
  });

  it("filtra por curso y devuelve la última sección leída", async () => {
    const repo = createProgressRepo(db);
    await repo.markRead("u1", "B1", "B1.1", new Date("2026-10-01T10:00:00Z"));
    await repo.markRead("u1", "B2", "B2.1", new Date("2026-10-03T10:00:00Z"));
    await repo.markRead("u1", "B1", "B1.2", new Date("2026-10-02T10:00:00Z"));

    expect((await repo.readSectionIds("u1", "B1")).sort()).toEqual(["B1.1", "B1.2"]);
    expect((await repo.allReadSectionIds("u1")).sort()).toEqual(["B1.1", "B1.2", "B2.1"]);
    expect((await repo.lastRead("u1"))?.sectionId).toBe("B2.1");
    expect(await repo.lastRead("u2")).toBeNull();
  });
});
