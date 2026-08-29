"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createSessionCookie, destroySessionCookie } from "@/lib/auth";
import { DUMMY_HASH, verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { checkThrottle, clearThrottle, registerFailure } from "@/lib/rate-limit";
import { loginSchema } from "@/lib/validation";

export type LoginState = { error?: string };

/** Same wording for every failure, so nothing leaks about which accounts exist. */
const GENERIC_FAILURE = "That email and password do not match.";

async function clientIp(): Promise<string> {
  const headerList = await headers();
  const forwarded = headerList.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || headerList.get("x-real-ip") || "unknown";
}

/** Only allow redirects back into our own dashboard. */
function safeNext(next: FormDataEntryValue | null): string {
  const value = typeof next === "string" ? next : "";
  return value.startsWith("/dashboard") ? value : "/dashboard";
}

export async function login(
  _previous: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: GENERIC_FAILURE };
  }

  const { email, password } = parsed.data;

  // Throttle on the email and on the network address, so neither a single
  // account nor a single host can be hammered.
  const keys = [`email:${email}`, `ip:${await clientIp()}`];

  for (const key of keys) {
    const state = await checkThrottle(key);
    if (state.blocked) {
      const minutes = Math.ceil(state.retryAfterSeconds / 60);
      return {
        error: `Too many attempts. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`,
      };
    }
  }

  const user = await prisma.user.findUnique({ where: { email } });

  // Compare against a dummy hash when the account does not exist, so a wrong
  // email and a wrong password take the same amount of time.
  const passwordOk = await verifyPassword(password, user?.passwordHash ?? DUMMY_HASH);

  if (!user || !user.isActive || !passwordOk) {
    await Promise.all(keys.map((key) => registerFailure(key)));
    return { error: GENERIC_FAILURE };
  }

  await Promise.all(keys.map((key) => clearThrottle(key)));

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  await createSessionCookie({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role === "ADMIN" ? "ADMIN" : "EDITOR",
  });

  redirect(safeNext(formData.get("next")));
}

export async function logout(): Promise<void> {
  await destroySessionCookie();
  redirect("/login");
}
