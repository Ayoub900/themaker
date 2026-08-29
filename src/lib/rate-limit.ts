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
