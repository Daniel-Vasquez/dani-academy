import { getSectionById } from "@/lib/content";
import { RATE_LIMITS } from "@/lib/constants";
import { NotFoundError } from "@/lib/errors";
import { enforceRateLimit } from "@/server/services/rate-limit.service";
import { repos } from "@/server/repositories";

export async function recordHeartbeat(userId: string, sectionId: string): Promise<void> {
  await enforceRateLimit(`hb:${userId}`, RATE_LIMITS.heartbeat);
  const section = await getSectionById(sectionId);
  if (!section) throw new NotFoundError("La sección no existe");
  await repos.studySessions.heartbeat(userId, section.data.course.id, sectionId);
}
