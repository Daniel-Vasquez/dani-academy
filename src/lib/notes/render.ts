import type { NoteContent } from "./schema";

/**
 * HTML de una nota YA VALIDADA, para la vista previa que pinta el servidor antes de que cargue
 * el editor. Sin @tiptap/html: su versión de servidor arrastra happy-dom (18 MB) a la función.
 * No es idéntico byte a byte al del editor (TipTap agrupa marcas contiguas), pero cada carácter
 * lleva las mismas marcas.
 */
const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

type TextNode = NonNullable<NoteContent["content"][number]["content"]>[number];

function renderText(node: TextNode): string {
  let html = escapeHtml(node.text);
  const marks = node.marks ?? [];
  // Mismo anidamiento que el editor: el tono dentro, luego la cursiva y fuera la negrita
  const tone = marks.find((m) => m.type === "tono");
  if (tone) html = `<span data-tono="${tone.attrs.tono}" class="nota-tono">${html}</span>`;
  if (marks.some((m) => m.type === "italic")) html = `<em>${html}</em>`;
  if (marks.some((m) => m.type === "bold")) html = `<strong>${html}</strong>`;
  return html;
}

export function renderNoteHtml(doc: NoteContent): string {
  return doc.content.map((p) => `<p>${(p.content ?? []).map(renderText).join("")}</p>`).join("");
}
