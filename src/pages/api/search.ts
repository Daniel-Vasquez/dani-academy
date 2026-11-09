import type { APIRoute } from "astro";
import { UnauthorizedError, toErrorResponse } from "@/lib/errors";
import { searchCourses } from "@/server/services/search.service";

// GET /api/search?q=getStaticPaths → { results: SearchResult[] } (vacío si la consulta es corta)
export const GET: APIRoute = async ({ url, locals }) => {
  try {
    if (!locals.user) throw new UnauthorizedError();
    const results = await searchCourses(url.searchParams.get("q") ?? "");
    return Response.json({ results });
  } catch (error) {
    return toErrorResponse(error);
  }
};
