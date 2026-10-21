import { describe, expect, it } from "vitest";
import { noteContentSchema, noteToText } from "@/lib/notes/schema";

const doc = (...content: unknown[]) => ({ type: "doc", content });
const p = (...content: unknown[]) => ({ type: "paragraph", content });
const t = (text: string, ...marks: unknown[]) => ({
  type: "text",
  text,
  ...(marks.length ? { marks } : {}),
});

describe("noteContentSchema", () => {
  it("acepta lo que produce el editor: párrafos, negrita, cursiva y tono", () => {
    const valid = doc(p(t("Hola", { type: "bold" }, { type: "tono", attrs: { tono: "verde" } })), {
      type: "paragraph",
    });
    expect(noteContentSchema.safeParse(valid).success).toBe(true);
  });

  it.each([
    ["un color fuera de la paleta", doc(p(t("x", { type: "tono", attrs: { tono: "#ff0000" } })))],
    ["un enlace", doc(p(t("x", { type: "link", attrs: { href: "javascript:alert(1)" } })))],
    ["una imagen", doc({ type: "image", attrs: { src: "x" } })],
    ["un estilo en línea", doc(p({ ...t("x"), attrs: { style: "color:red" } }))],
    ["un documento sin párrafos", doc()],
  ])("rechaza %s", (_, invalid) => {
    expect(noteContentSchema.safeParse(invalid).success).toBe(false);
  });
});

describe("noteToText", () => {
  it("une los textos y pone un párrafo por línea", () => {
    const parsed = noteContentSchema.parse(
      doc(p(t("Uno "), t("dos", { type: "bold" })), { type: "paragraph" }, p(t("tres"))),
    );
    expect(noteToText(parsed)).toBe("Uno dos\n\ntres");
  });

  it("una nota con solo párrafos vacíos da texto vacío", () => {
    expect(
      noteToText(noteContentSchema.parse(doc({ type: "paragraph" }, { type: "paragraph" }))),
    ).toBe("");
  });
});
