import { describe, expect, it } from "vitest";
import { db } from "./setup";
import { createNotesRepo } from "@/server/repositories/notes.repo";
import type { NoteContent } from "@/lib/notes/schema";

const doc = (text: string): NoteContent => ({
  type: "doc",
  content: [{ type: "paragraph", content: [{ type: "text", text }] }],
});
const base = { userId: "u1", courseId: "A3", sectionId: "A3.2" };

describe("notes.repo", () => {
  it("crea la nota con rev 1 y la actualiza a rev 2", async () => {
    const repo = createNotesRepo(db);
    expect(await repo.save({ ...base, doc: doc("a"), text: "a", expectedRev: 0 })).toMatchObject({
      ok: true,
      rev: 1,
    });
    expect(await repo.save({ ...base, doc: doc("ab"), text: "ab", expectedRev: 1 })).toMatchObject({
      ok: true,
      rev: 2,
    });
    expect(await repo.get("u1", "A3.2")).toMatchObject({ doc: doc("ab"), rev: 2 });
  });

  it("una rev antigua no sobrescribe: devuelve la nota actual", async () => {
    const repo = createNotesRepo(db);
    await repo.save({ ...base, doc: doc("pestaña 1"), text: "pestaña 1", expectedRev: 0 });
    await repo.save({ ...base, doc: doc("pestaña 1, más"), text: "x", expectedRev: 1 });
    const result = await repo.save({ ...base, doc: doc("pestaña 2"), text: "x", expectedRev: 1 });
    expect(result).toEqual({
      ok: false,
      current: expect.objectContaining({ doc: doc("pestaña 1, más"), rev: 2 }),
    });
  });

  it("dos pestañas que crean la nota a la vez: solo gana una", async () => {
    const repo = createNotesRepo(db);
    const results = await Promise.all(
      ["a", "b", "c"].map((x) => repo.save({ ...base, doc: doc(x), text: x, expectedRev: 0 })),
    );
    expect(results.filter((r) => r.ok)).toHaveLength(1);
    expect(await db.collection("notes").countDocuments()).toBe(1);
  });

  it("aísla las notas entre usuarios y entre secciones", async () => {
    const repo = createNotesRepo(db);
    await repo.save({ ...base, doc: doc("mía"), text: "mía", expectedRev: 0 });
    expect(await repo.get("u2", "A3.2")).toBeNull();
    expect(await repo.get("u1", "A3.3")).toBeNull();
  });

  it("borrar con una rev antigua no borra", async () => {
    const repo = createNotesRepo(db);
    await repo.save({ ...base, doc: doc("a"), text: "a", expectedRev: 0 });
    await repo.save({ ...base, doc: doc("ab"), text: "ab", expectedRev: 1 });
    expect(await repo.remove("u1", "A3.2", 1)).toMatchObject({ ok: false });
    expect(await repo.remove("u1", "A3.2", 2)).toMatchObject({ ok: true, rev: 0 });
    expect(await repo.get("u1", "A3.2")).toBeNull();
  });
});
