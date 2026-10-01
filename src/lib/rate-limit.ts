import "server-only";

import { dashboard } from "@/config/site";
import { prisma } from "@/lib/prisma";

/**
 * A small persistent throttle, backed by the `login_attempts` collection.
 *
 * It lives in the database rather than in memory because Next.js server
 * instances are not guaranteed to be long-lived or singular — an in-memory
 * counter resets on every cold start, which is exactly when it matters.
 */

const WINDOW_MS = dashboard.loginWindowMinutes * 60_000;
const LOCK_MS = dashboard.loginLockMinutes * 60_000;

export type ThrottleState = {
  blocked: boolean;
  retryAfterSeconds: number;
  attemptsLeft: number;
};

export async function checkThrottle(key: string): Promise<ThrottleState> {
  const now = new Date();
  const record = await prisma.loginAttempt.findUnique({ where: { key } });

  if (!record) {
    return { blocked: false, retryAfterSeconds: 0, attemptsLeft: dashboard.loginMaxAttempts };
  }

  if (record.lockedUntil && record.lockedUntil > now) {
    return {
      blocked: true,
      retryAfterSeconds: Math.ceil((record.lockedUntil.getTime() - now.getTime()) / 1000),
      attemptsLeft: 0,
    };
  }

  // The window has rolled over, so the old count no longer applies.
  if (now.getTime() - record.firstAt.getTime() > WINDOW_MS) {
    return { blocked: false, retryAfterSeconds: 0, attemptsLeft: dashboard.loginMaxAttempts };
  }

  return {
    blocked: false,
    retryAfterSeconds: 0,
    attemptsLeft: Math.max(0, dashboard.loginMaxAttempts - record.count),
  };
}

export async function registerFailure(key: string): Promise<ThrottleState> {
  const now = new Date();
  const record = await prisma.loginAttempt.findUnique({ where: { key } });

  // Continue the current window only if it is still open and no expired lock
  // is sitting on it; otherwise this failure starts a fresh window.
  const continuing =
    record !== null &&
    record.lockedUntil === null &&
    now.getTime() - record.firstAt.getTime() <= WINDOW_MS;

  const count = continuing ? record.count + 1 : 1;
  const firstAt = continuing ? record.firstAt : now;
  const reachedLimit = count >= dashboard.loginMaxAttempts;
  const lockedUntil = reachedLimit ? new Date(now.getTime() + LOCK_MS) : null;

  await prisma.loginAttempt.upsert({
    where: { key },
    create: { key, count, firstAt, lockedUntil },
    update: { count, firstAt, lockedUntil },
  });

  return {
    blocked: reachedLimit,
    retryAfterSeconds: reachedLimit ? Math.ceil(LOCK_MS / 1000) : 0,
    attemptsLeft: Math.max(0, dashboard.loginMaxAttempts - count),
  };
}

export async function clearThrottle(key: string): Promise<void> {
  await prisma.loginAttempt.deleteMany({ where: { key } });
}

/* ------------------------------------------------------- general limiter */

export type RateLimitResult = { allowed: boolean; retryAfterSeconds: number };

/**
 * Fixed-window limiter for public endpoints: at most `limit` calls per `key`
 * every `windowMs`. It reuses the same table as the login throttle, under an
 * `rl:` prefix, so it survives restarts and is shared across instances.
 */
export async function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): Promise<RateLimitResult> {
  const id = `rl:${key}`;
  const now = new Date();
  const record = await prisma.loginAttempt.findUnique({ where: { key: id } });

  const open = record !== null && now.getTime() - record.firstAt.getTime() <= windowMs;
  const count = open ? record.count + 1 : 1;
  const firstAt = open ? record.firstAt : now;

  await prisma.loginAttempt.upsert({
    where: { key: id },
    create: { key: id, count, firstAt },
    update: { count, firstAt },
  });

  // Housekeeping: now and then drop windows that ended long ago.
  if (Math.random() < 0.01) {
    await prisma.loginAttempt.deleteMany({
      where: { key: { startsWith: "rl:" }, firstAt: { lt: new Date(now.getTime() - 86_400_000) } },
    });
  }

  return {
    allowed: count <= limit,
    retryAfterSeconds: Math.max(1, Math.ceil((firstAt.getTime() + windowMs - now.getTime()) / 1000)),
  };
}

/** The caller's address as the proxy reports it. */
export function requestIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || "unknown"
  );
}
