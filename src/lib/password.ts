import "server-only";

import bcrypt from "bcryptjs";

const ROUNDS = 12;

export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, ROUNDS);
}

export function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

/**
 * A dummy hash to compare against when the email does not exist, so that a
 * wrong email and a wrong password cost the same amount of time and cannot be
 * told apart by an attacker enumerating accounts.
 */
export const DUMMY_HASH =
  "$2b$12$C6UzMDM.H6dfI/f/IKcEe.CjHFOWEBrKcJ5s1KAfQP3aMLbHQ0ZLK";
