import { SignJWT, jwtVerify, type JWTPayload } from "jose";

import { dashboard } from "@/config/site";

/**
 * Signing and verification only — deliberately free of `next/headers` and of
 * any Node built-in, so the same code runs in Edge middleware and in Node
 * server actions. Cookie handling lives in `src/lib/auth.ts`.
 */

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "EDITOR";
};

const ISSUER = "the-maker";
const AUDIENCE = "the-maker-dashboard";

let cachedKey: Uint8Array | null = null;

function secretKey(): Uint8Array {
  if (cachedKey) return cachedKey;

  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "AUTH_SECRET is missing or shorter than 32 characters. Set it in .env — see .env.example.",
    );
  }
  cachedKey = new TextEncoder().encode(secret);
  return cachedKey;
}

export async function signSession(user: SessionUser): Promise<string> {
  return new SignJWT({ email: user.email, name: user.name, role: user.role })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(user.id)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${dashboard.sessionMaxAge}s`)
    .sign(secretKey());
}

/** Returns null for anything missing, expired, re-signed or malformed. */
export async function verifySessionToken(
  token: string | undefined,
): Promise<SessionUser | null> {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify<JWTPayload & Omit<SessionUser, "id">>(
      token,
      secretKey(),
      { issuer: ISSUER, audience: AUDIENCE, algorithms: ["HS256"] },
    );

    if (!payload.sub || !payload.email) return null;

    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name ?? "",
      role: payload.role === "ADMIN" ? "ADMIN" : "EDITOR",
    };
  } catch {
    return null;
  }
}
