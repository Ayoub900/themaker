import { NextResponse, type NextRequest } from "next/server";

import { isImageId, isImageType } from "@/lib/images";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

/**
 * Serves an uploaded photograph.
 *
 * A document's id never points at different bytes — editing a photograph
 * uploads a new one and repoints the piece at it — so the response is
 * immutable and can be cached for a year by the browser, by any proxy, and by
 * the `next/image` optimiser that fetches this route to resize it.
 */

const ONE_YEAR = 60 * 60 * 24 * 365;

const missing = () => new NextResponse("Not found", { status: 404 });

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  // Filter obvious rubbish before it reaches Mongo, which throws on a
  // malformed ObjectId rather than returning nothing.
  if (!isImageId(id)) return missing();

  const etag = `"${id}"`;
  const cacheControl = `public, max-age=${ONE_YEAR}, immutable`;

  // Nothing about the bytes can have changed, so a conditional request is
  // answered without reading them.
  if (request.headers.get("if-none-match") === etag) {
    return new NextResponse(null, {
      status: 304,
      headers: { ETag: etag, "Cache-Control": cacheControl },
    });
  }

  const image = await prisma.image.findUnique({ where: { id } });
  if (!image) return missing();

  // The type was sniffed from the file's own header on upload; checking it
  // again here means a document written by any other route still cannot make
  // us serve something a browser would treat as script.
  if (!isImageType(image.mimeType)) return missing();

  return new NextResponse(new Uint8Array(image.data), {
    headers: {
      "Content-Type": image.mimeType,
      "Content-Length": String(image.data.byteLength),
      "Cache-Control": cacheControl,
      ETag: etag,
    },
  });
}
