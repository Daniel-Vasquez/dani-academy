import type { APIRoute } from "astro";
import { SECTION_ID_REGEX } from "@/lib/constants";
import { BadRequestError, UnauthorizedError, toErrorResponse } from "@/lib/errors";
import { setSectionRead } from "@/server/services/progress.service";

const handler =
  (read: boolean): APIRoute =>
  async ({ params, locals }) => {
    try {
      if (!locals.user) throw new UnauthorizedError();
      const sectionId = params.sectionId ?? "";
      if (!SECTION_ID_REGEX.test(sectionId)) {
        throw new BadRequestError("Identificador de sección no válido");
      }

      // El userId SIEMPRE sale de la sesión, nunca de la petición (temario I5.4)
      await setSectionRead(locals.user.id, sectionId, read);
      return new Response(null, { status: 204 });
    } catch (error) {
      return toErrorResponse(error);
    }
  };

export const PUT = handler(true);
export const DELETE = handler(false);
