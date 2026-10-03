import { getSectionById } from "@/lib/content";
import { NotFoundError } from "@/lib/errors";
import { repos } from "@/server/repositories";

export async function recordHeartbeat(userId: string, sectionId: string): Promise<void> {
  const section = await getSectionById(sectionId);
  if (!section) throw new NotFoundError("La sección no existe");
  await repos.studySessions.heartbeat(userId, section.data.course.id, sectionId);
}
