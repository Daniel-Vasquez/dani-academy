import type { Db } from "mongodb";
import { COLLECTIONS, type RateLimitDoc } from "@/server/db-types";

const DUPLICATE_KEY = 11000;

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

/** Ventana fija con contador en Mongo; el índice TTL borra las ventanas caducadas */
export function createRateLimitRepo(db: Db) {
  const col = db.collection<RateLimitDoc>(COLLECTIONS.rateLimits);

  const increment = (_id: string, expiresAt: Date) =>
    col.findOneAndUpdate(
      { _id },
      { $inc: { n: 1 }, $setOnInsert: { expiresAt } },
      { upsert: true, returnDocument: "after" },
    );

  return {
    async hit(
      key: string,
      max: number,
      windowSeconds: number,
      now = Date.now(),
    ): Promise<RateLimitResult> {
      const windowMs = windowSeconds * 1000;
      const windowStart = Math.floor(now / windowMs) * windowMs;
      const id = `${key}:${windowStart}`;
      const expiresAt = new Date(windowStart + windowMs);

      let doc: RateLimitDoc | null;
      try {
        doc = await increment(id, expiresAt);
      } catch (error) {
        // Dos upserts simultáneos sobre una ventana nueva: el segundo choca con _id y se reintenta
        if ((error as { code?: number }).code !== DUPLICATE_KEY) throw error;
        doc = await increment(id, expiresAt);
      }

      return {
        allowed: (doc?.n ?? 1) <= max,
        retryAfterSeconds: Math.ceil((windowStart + windowMs - now) / 1000),
      };
    },
  };
}

export type RateLimitRepo = ReturnType<typeof createRateLimitRepo>;
