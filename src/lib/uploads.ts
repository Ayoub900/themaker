import "server-only";

import { randomBytes } from "node:crypto";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import { IMAGE_EXTENSIONS, isImageId, type ImageType } from "@/lib/images";

/**
 * The upload folder. Photographs are ordinary files in it, named by their id,
 * and served by `/uploads/[file]`.
 *
 * It lives outside `public/` on purpose: `next start` only serves the public
 * files that existed when it booted, so an upload made in production would
 * 404 until the next restart. Set `UPLOAD_DIR` to keep it somewhere that
 * survives a redeploy (a mounted volume, say); it defaults to `./uploads`.
 */
export const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR ?? "uploads");

/** Absolute path of an upload, or null for anything that is not an id. */
export function uploadPath(id: string): string | null {
  // The id pattern has no separators or dots beyond the extension, so a
  // checked id can never climb out of the folder.
  return isImageId(id) ? path.join(UPLOAD_DIR, id) : null;
}

/** Write a new upload and return its id — the file name. */
export async function saveUpload(bytes: Uint8Array, mimeType: ImageType): Promise<string> {
  const id = `${randomBytes(12).toString("hex")}.${IMAGE_EXTENSIONS[mimeType]}`;
  await mkdir(UPLOAD_DIR, { recursive: true });
  // `wx` refuses to overwrite, so a (vanishingly unlikely) name clash fails
  // loudly instead of replacing someone else's photograph.
  await writeFile(path.join(UPLOAD_DIR, id), bytes, { flag: "wx" });
  return id;
}

/** The bytes of an upload, or null when there is no such file. */
export async function readUpload(id: string): Promise<Buffer | null> {
  const file = uploadPath(id);
  if (!file) return null;
  try {
    return await readFile(file);
  } catch {
    return null;
  }
}

/** Remove uploads. A file that is already gone is not an error. */
export async function deleteUploads(ids: readonly string[]): Promise<void> {
  await Promise.all(
    ids.map(async (id) => {
      const file = uploadPath(id);
      if (!file) return;
      try {
        await unlink(file);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
      }
    }),
  );
}
