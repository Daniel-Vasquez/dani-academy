import type { APIRoute } from "astro";
import { NOTE_LIMITS, SECTION_ID_REGEX } from "@/lib/constants";
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  PayloadTooLargeError,
  UnauthorizedError,
  toErrorResponse,
} from "@/lib/errors";
import { getNote, saveNote } from "@/server/services/notes.service";

function sectionIdFrom(params: Record<string, string | undefined>): string {
  const sectionId = params.sectionId ?? "";
  if (!SECTION_ID_REGEX.test(sectionId)) {
    throw new BadRequestError("Identificador de sección no válido");
  }
  return sectionId;
}

export const GET: APIRoute = async ({ params, locals }) => {
  try {
    if (!locals.user) throw new UnauthorizedError();
    // El userId SIEMPRE sale de la sesión: no hay forma de pedir la nota de otra persona
    return Response.json(await getNote(locals.user.id, sectionIdFrom(params)));
  } catch (error) {
    return toErrorResponse(error);
  }
};

export const PUT: APIRoute = async ({ params, locals, request, url }) => {
  try {
    if (!locals.user) throw new UnauthorizedError();
    const sectionId = sectionIdFrom(params);
    // checkOrigin de Astro solo revisa los envíos de formularios: un JSON se comprueba aquí
    if (request.headers.get("origin") !== url.origin)
      throw new ForbiddenError("Origen no permitido");
    if (!request.headers.get("content-type")?.startsWith("application/json")) {
      throw new BadRequestError("Se esperaba JSON");
    }

    const raw = await request.text();
    if (new TextEncoder().encode(raw).length > NOTE_LIMITS.maxBytes)
      throw new PayloadTooLargeError();
    let body: unknown;
    try {
      body = JSON.parse(raw);
    } catch {
      throw new BadRequestError("JSON no válido");
    }

    return Response.json(await saveNote(locals.user.id, sectionId, body));
  } catch (error) {
    if (error instanceof ConflictError) {
      return Response.json({ error: error.message, current: error.current }, { status: 409 });
    }
    return toErrorResponse(error);
  }
};
