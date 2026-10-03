import type { APIRoute } from "astro";
import { db } from "@/lib/mongo";

const noStore = { "Cache-Control": "no-store" };

export const GET: APIRoute = async () => {
  const started = performance.now();
  try {
    await db.command({ ping: 1 });
    return Response.json(
      { ok: true, db: "up", ms: Math.round(performance.now() - started) },
      { headers: noStore },
    );
  } catch (error) {
    console.error("[health] MongoDB no responde", error);
    return Response.json({ ok: false, db: "down" }, { status: 503, headers: noStore });
  }
};
