import type { APIRoute } from "astro";
import { z } from "zod";
import { SECTION_ID_REGEX } from "@/lib/constants";
import { BadRequestError, UnauthorizedError, toErrorResponse } from "@/lib/errors";
import { recordHeartbeat } from "@/server/services/study-session.service";

const bodySchema = z.object({ sectionId: z.string().regex(SECTION_ID_REGEX) });

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    if (!locals.user) throw new UnauthorizedError();
    const parsed = bodySchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) throw new BadRequestError();
    await recordHeartbeat(locals.user.id, parsed.data.sectionId);
    return new Response(null, { status: 204 });
  } catch (error) {
    return toErrorResponse(error);
  }
};
