import { TooManyRequestsError } from "@/lib/errors";
import { repos } from "@/server/repositories";

/** Cuenta una petición para `key` y lanza TooManyRequestsError si supera el límite */
export async function enforceRateLimit(
  key: string,
  limit: { max: number; windowSeconds: number },
): Promise<void> {
  const { allowed, retryAfterSeconds } = await repos.rateLimit.hit(
    key,
    limit.max,
    limit.windowSeconds,
  );
  if (!allowed) throw new TooManyRequestsError(retryAfterSeconds);
}
