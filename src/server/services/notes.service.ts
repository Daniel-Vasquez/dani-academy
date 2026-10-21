import { getSectionById } from "@/lib/content";
import { NOTE_LIMITS, RATE_LIMITS } from "@/lib/constants";
import { BadRequestError, ConflictError, NotFoundError, PayloadTooLargeError } from "@/lib/errors";
import { noteToText, saveNoteInputSchema } from "@/lib/notes/schema";
import { enforceRateLimit } from "@/server/services/rate-limit.service";
import { repos } from "@/server/repositories";
import type { StoredNote } from "@/server/repositories/notes.repo";

export type NoteView = { doc: StoredNote["doc"] | null; rev: number; updatedAt: Date | null };

const EMPTY: NoteView = { doc: null, rev: 0, updatedAt: null };

export async function getNote(userId: string, sectionId: string): Promise<NoteView> {
  return (await repos.notes.get(userId, sectionId)) ?? EMPTY;
}

export async function saveNote(
  userId: string,
  sectionId: string,
  input: unknown,
): Promise<{ rev: number; updatedAt: Date | null }> {
  await enforceRateLimit(`notes:${userId}`, RATE_LIMITS.notes);

  // El curso sale del contenido, nunca de la petición
  const section = await getSectionById(sectionId);
  if (!section) throw new NotFoundError("La sección no existe");

  const parsed = saveNoteInputSchema.safeParse(input);
  if (!parsed.success) throw new BadRequestError("La nota no tiene un formato válido");
  const { doc, rev } = parsed.data;

  const text = noteToText(doc);
  if (text.length > NOTE_LIMITS.maxChars) throw new PayloadTooLargeError();

  // Una nota vacía no se guarda: se borra (y si no existía, no hay nada que hacer)
  if (text === "") {
    if (rev === 0) return { rev: 0, updatedAt: null };
    const removed = await repos.notes.remove(userId, sectionId, rev);
    if (!removed.ok) throw new ConflictError(removed.current);
    return { rev: 0, updatedAt: null };
  }

  const result = await repos.notes.save({
    userId,
    courseId: section.data.course.id,
    sectionId,
    doc,
    text,
    expectedRev: rev,
  });
  if (!result.ok) throw new ConflictError(result.current);
  return { rev: result.rev, updatedAt: result.updatedAt };
}
