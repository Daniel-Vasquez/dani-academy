import { getSectionById } from "@/lib/content";
import { RATE_LIMITS } from "@/lib/constants";
import { NotFoundError } from "@/lib/errors";
import { enforceRateLimit } from "@/server/services/rate-limit.service";
import { repos } from "@/server/repositories";

export async function setSectionRead(
  userId: string,
  sectionId: string,
  read: boolean,
): Promise<void> {
  await enforceRateLimit(`progress:${userId}`, RATE_LIMITS.progress);
  const section = await getSectionById(sectionId);
  if (!section) throw new NotFoundError("La sección no existe");

  if (read) await repos.progress.markRead(userId, section.data.course.id, sectionId);
  else await repos.progress.unmarkRead(userId, sectionId);
}

export function getCourseReadIds(userId: string, courseId: string): Promise<string[]> {
  return repos.progress.readSectionIds(userId, courseId);
}
