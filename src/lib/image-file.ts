import "server-only";

import { type ImageType } from "@/lib/images";

/**
 * Reads an upload's real format and pixel size from its own bytes.
 *
 * The browser's `Content-Type` is a claim, not a fact: it is set from the file
 * extension and can be anything at all. Sniffing the header instead means an
 * `.jpg` that is really an SVG — the one image format that can carry script —
 * is rejected rather than stored and later served back with a type that would
 * make a browser execute it.
 *
 * Dimensions come out of the same header, so the workshop is never asked to
 * type them in and a listing never has to decode a file to reserve its space.
 * Four formats are read, which is every format a camera or phone produces.
 */

export type InspectedImage = {
  mimeType: ImageType;
  width: number;
  height: number;
};

export function inspectImage(bytes: Uint8Array): InspectedImage | null {
  return readPng(bytes) ?? readJpeg(bytes) ?? readWebp(bytes) ?? readGif(bytes);
}

/** A view over the same memory — no copy, and no `Buffer` on the Edge. */
function viewOf(bytes: Uint8Array): DataView {
  return new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
}

function startsWith(bytes: Uint8Array, signature: readonly number[]): boolean {
  if (bytes.length < signature.length) return false;
  return signature.every((byte, index) => bytes[index] === byte);
}

function ascii(bytes: Uint8Array, start: number, length: number): string {
  return String.fromCharCode(...bytes.subarray(start, start + length));
}

/* ------------------------------------------------------------------- png */

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] as const;

function readPng(bytes: Uint8Array): InspectedImage | null {
  // The IHDR chunk is mandatory and must come first, so its position is fixed.
  if (bytes.length < 24 || !startsWith(bytes, PNG_SIGNATURE)) return null;
  if (ascii(bytes, 12, 4) !== "IHDR") return null;

  const view = viewOf(bytes);
  return { mimeType: "image/png", width: view.getUint32(16), height: view.getUint32(20) };
}

/* ------------------------------------------------------------------ jpeg */

function readJpeg(bytes: Uint8Array): InspectedImage | null {
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return null;

  const view = viewOf(bytes);
  let at = 2;

  // Walk the marker segments until a start-of-frame, which is the only one
  // that carries the dimensions. Everything before it is metadata of some
  // kind — EXIF, colour profiles, thumbnails — of declared length.
  while (at + 3 < bytes.length) {
    if (bytes[at] !== 0xff) return null;

    const marker = bytes[at + 1];

    // Fill bytes and the standalone markers carry no length field.
    if (marker === 0xff) {
      at += 1;
      continue;
    }
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd8)) {
      at += 2;
      continue;
    }
    // Start of scan: the compressed data begins, no header can follow.
    if (marker === 0xda || marker === 0xd9) return null;

    const length = view.getUint16(at + 2);
    if (length < 2) return null;

    const isStartOfFrame =
      marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;

    if (isStartOfFrame) {
      if (at + 9 > bytes.length) return null;
      return {
        mimeType: "image/jpeg",
        // One byte of sample precision sits between the length and the size.
        height: view.getUint16(at + 5),
        width: view.getUint16(at + 7),
      };
    }

    at += 2 + length;
  }

  return null;
}

/* ------------------------------------------------------------------ webp */

function readWebp(bytes: Uint8Array): InspectedImage | null {
  if (bytes.length < 30 || ascii(bytes, 0, 4) !== "RIFF" || ascii(bytes, 8, 4) !== "WEBP") {
    return null;
  }

  const view = viewOf(bytes);
  const mimeType = "image/webp" as const;

  switch (ascii(bytes, 12, 4)) {
    // Lossy: a three-byte frame tag, a three-byte sync code, then the size in
    // fourteen bits each — the top two bits are the scaling factor.
    case "VP8 ":
      return {
        mimeType,
        width: view.getUint16(26, true) & 0x3fff,
        height: view.getUint16(28, true) & 0x3fff,
      };

    // Lossless: one signature byte, then both edges packed into 28 bits,
    // each stored one less than it is.
    case "VP8L": {
      if (bytes[20] !== 0x2f) return null;
      const packed = view.getUint32(21, true);
      return {
        mimeType,
        width: (packed & 0x3fff) + 1,
        height: ((packed >> 14) & 0x3fff) + 1,
      };
    }

    // Extended (animation, alpha, metadata): the canvas size is three bytes
    // each, little endian, again stored one less than it is.
    case "VP8X":
      return {
        mimeType,
        width: (bytes[24] | (bytes[25] << 8) | (bytes[26] << 16)) + 1,
        height: (bytes[27] | (bytes[28] << 8) | (bytes[29] << 16)) + 1,
      };

    default:
      return null;
  }
}

/* ------------------------------------------------------------------- gif */

function readGif(bytes: Uint8Array): InspectedImage | null {
  if (bytes.length < 10 || ascii(bytes, 0, 3) !== "GIF") return null;

  const version = ascii(bytes, 3, 3);
  if (version !== "87a" && version !== "89a") return null;

  const view = viewOf(bytes);
  return {
    mimeType: "image/gif",
    width: view.getUint16(6, true),
    height: view.getUint16(8, true),
  };
}
