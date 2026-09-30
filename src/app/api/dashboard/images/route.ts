import { NextResponse, type NextRequest } from "next/server";

import { requireSession } from "@/lib/auth";
import { inspectImage } from "@/lib/image-file";
import {
  MAX_IMAGE_BYTES,
  MAX_IMAGE_EDGE,
  formatBytes,
  imageUrl,
} from "@/lib/images";
import { saveUpload } from "@/lib/uploads";

export const runtime = "nodejs";

/**
 * Receives a photograph from the dashboard.
 *
 * Uploading is its own request rather than part of the save, for two reasons:
 * a Server Action's body is capped at 1 MB, which no photograph respects; and
 * an editor who mistypes a slug should not have to choose their files again
 * when the form comes back with the error.
 *
 * The piece being edited is not touched here. This stores the bytes and hands
 * back an id, which the form carries in a hidden field until it is saved.
 */
export async function POST(request: NextRequest) {
  try {
    await requireSession();
  } catch {
    return NextResponse.json({ message: "Your session has expired." }, { status: 401 });
  }

  // Refuse an oversized body before reading it, when the sender declares one.
  const declared = Number(request.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > MAX_IMAGE_BYTES * 1.2) {
    return NextResponse.json(
      { message: `That file is over ${formatBytes(MAX_IMAGE_BYTES)}.` },
      { status: 413 },
    );
  }

  let file: FormDataEntryValue | null;
  try {
    file = (await request.formData()).get("file");
  } catch {
    return NextResponse.json({ message: "Malformed upload." }, { status: 400 });
  }

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ message: "No file was sent." }, { status: 400 });
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return NextResponse.json(
      {
        message: `That file is ${formatBytes(file.size)}. The limit is ${formatBytes(
          MAX_IMAGE_BYTES,
        )} — export it smaller and try again.`,
      },
      { status: 413 },
    );
  }

  const bytes = new Uint8Array(await file.arrayBuffer());

  // The browser's content type comes from the file extension, so the format
  // is read from the bytes themselves. This is also what keeps SVG out.
  const inspected = inspectImage(bytes);
  if (!inspected) {
    return NextResponse.json(
      { message: "That is not a JPEG, PNG, WebP or GIF." },
      { status: 415 },
    );
  }

  if (inspected.width < 1 || inspected.height < 1) {
    return NextResponse.json({ message: "That image has no size." }, { status: 422 });
  }

  if (inspected.width > MAX_IMAGE_EDGE || inspected.height > MAX_IMAGE_EDGE) {
    return NextResponse.json(
      {
        message: `That image is ${inspected.width}×${inspected.height}. Keep both sides under ${MAX_IMAGE_EDGE} pixels.`,
      },
      { status: 422 },
    );
  }

  let id: string;
  try {
    id = await saveUpload(bytes, inspected.mimeType);
  } catch (error) {
    // Named in the log, because all the browser gets is a failed upload.
    console.error("image upload failed", error);
    return NextResponse.json(
      { message: "That photograph could not be stored. Try again." },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      id,
      url: imageUrl(id),
      width: inspected.width,
      height: inspected.height,
      bytes: bytes.byteLength,
      mimeType: inspected.mimeType,
    },
    { status: 201 },
  );
}
