import { z } from "zod";
import { NOTE_TONES } from "./palette";

/**
 * Lo único que puede contener una nota: párrafos de texto con negrita, cursiva y un tono.
 * `.strict()` rechaza cualquier otra clave, así que un enlace, una imagen o un estilo en línea
 * enviados a mano no llegan nunca a la base de datos.
 */
const markSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("bold") }).strict(),
  z.object({ type: z.literal("italic") }).strict(),
  z
    .object({ type: z.literal("tono"), attrs: z.object({ tono: z.enum(NOTE_TONES) }).strict() })
    .strict(),
]);

const textSchema = z
  .object({
    type: z.literal("text"),
    text: z.string().min(1),
    marks: z.array(markSchema).max(3).optional(),
  })
  .strict();

const paragraphSchema = z
  .object({ type: z.literal("paragraph"), content: z.array(textSchema).optional() })
  .strict();

export const noteContentSchema = z
  .object({ type: z.literal("doc"), content: z.array(paragraphSchema).min(1).max(2_000) })
  .strict();

export type NoteContent = z.infer<typeof noteContentSchema>;

export const saveNoteInputSchema = z.object({
  doc: noteContentSchema,
  rev: z.number().int().min(0), // 0 = la nota todavía no existe
});

/** Texto plano: un párrafo por línea */
export function noteToText(doc: NoteContent): string {
  return doc.content
    .map((p) => (p.content ?? []).map((t) => t.text).join(""))
    .join("\n")
    .trim();
}
