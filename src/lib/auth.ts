import "server-only";

import { cookies } from "next/headers";

import { dashboard } from "@/config/site";
import { signSession, verifySessionToken, type SessionUser } from "@/lib/session-token";

export type { SessionUser };

/**
 * Dashboard sessions: a signed, short-lived JWT in an httpOnly cookie.
 * The signing itself lives in `session-token.ts` so middleware can reuse it.
 */

/**
 * A `Secure` cookie is silently dropped by the browser over plain HTTP, which
 * lets a login look like it succeeded and then bounce straight back to the
 * login screen. So this follows the scheme we are actually served on rather
 * than NODE_ENV. Put TLS in front and set NEXT_PUBLIC_SITE_URL to the https
 * origin to turn it back on — a rebuild is needed, the value is inlined.
 */
const secureCookies = (process.env.NEXT_PUBLIC_SITE_URL ?? "").startsWith("https://");

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: secureCookies,
  path: "/",
} as const;

export async function createSessionCookie(user: SessionUser): Promise<void> {
  const token = await signSession(user);
  const jar = await cookies();
  jar.set(dashboard.sessionCookie, token, {
    ...cookieOptions,
    maxAge: dashboard.sessionMaxAge,
  });
}

export async function destroySessionCookie(): Promise<void> {
  const jar = await cookies();
  jar.set(dashboard.sessionCookie, "", { ...cookieOptions, maxAge: 0 });
}

/** The signed-in user, or null. Safe from any server component. */
export async function getSession(): Promise<SessionUser | null> {
  const jar = await cookies();
  return verifySessionToken(jar.get(dashboard.sessionCookie)?.value);
}

/**
 * Guard for every dashboard page and server action. Middleware redirects
 * unauthenticated navigations, but actions are separate entry points and must
 * check for themselves.
 */
export async function requireSession(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) throw new Error("UNAUTHORISED");
  return session;
}

export async function requireAdmin(): Promise<SessionUser> {
  const session = await requireSession();
  if (session.role !== "ADMIN") throw new Error("FORBIDDEN");
  return session;
}
