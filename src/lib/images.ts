/**
 * Uploaded photography — the parts both the browser and the server need.
 *
 * Files are stored in the upload folder and served by `/uploads/[file]`,
 * which is a plain local path, so `next/image` resizes and re-encodes them
 * like any other asset. Everything a page needs to lay a photograph out travels with
 * the product or post as an `ImageRef`; the bytes are never read to render.
 */

/** A photograph as a page sees it. Mirrors the `ImageRef` composite type. */
export type ImageRef = {
  id: string;
  width: number;
  height: number;
  alt: string;
};

/**
 * A photograph that ships with the site itself — under `public/images/` —
 * for the fixed sections (hero, story, makers) that have no dashboard form.
 */
export type SitePhoto = {
  src: string;
  alt: string;
};

/** What the browser is allowed to send, and what we are willing to serve. */
export const IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export type ImageType = (typeof IMAGE_TYPES)[number];

/** The extension an upload of each type is saved under. */
export const IMAGE_EXTENSIONS: Record<ImageType, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

/** For the `accept` attribute on the file input. */
export const IMAGE_ACCEPT = IMAGE_TYPES.join(",");

/** 5 MB. More than any phone photograph needs. */
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/** Photographs, not posters — anything larger is a mistake. */
export const MAX_IMAGE_EDGE = 8000;

export const MAX_PRODUCT_IMAGES = 6;

/** Alt text is stored per use, not per file, so it is capped with the form. */
export const MAX_IMAGE_ALT = 200;

/**
 * The public URL of an upload. Immutable — an edit uploads a new file and
 * points at that — so the route can serve it with a one-year cache.
 */
export function imageUrl(id: string): string {
  return `/uploads/${id}`;
}

export function isImageType(value: string): value is ImageType {
  return (IMAGE_TYPES as readonly string[]).includes(value);
}

/** An upload's id is its file name: 24 random hex characters and an extension. */
export function isImageId(value: string): boolean {
  return /^[0-9a-f]{24}\.(jpg|png|webp|gif)$/.test(value);
}

/** The type to serve an upload with, read off its extension. */
export function imageTypeOf(id: string): ImageType | null {
  const extension = id.slice(id.lastIndexOf(".") + 1);
  const match = IMAGE_TYPES.find((type) => IMAGE_EXTENSIONS[type] === extension);
  return match ?? null;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} kB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
