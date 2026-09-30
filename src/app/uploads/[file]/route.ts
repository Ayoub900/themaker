import { NextResponse, type NextRequest } from "next/server";

import { imageTypeOf } from "@/lib/images";
import { readUpload } from "@/lib/uploads";

export const runtime = "nodejs";

/**
 * Serves an uploaded photograph from the upload folder.
 *
 * A file name never points at different bytes — editing a photograph uploads
 * a new file and repoints the piece at it — so the response is immutable and
 * can be cached for a year by the browser, by any proxy, and by the
 * `next/image` optimiser that fetches this route to resize it.
 */

const ONE_YEAR = 60 * 60 * 24 * 365;

const missing = () => new NextResponse("Not found", { status: 404 });

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ file: string }> },
) {
  const { file } = await params;

  // `readUpload` refuses anything that is not an upload id, so a crafted
  // name cannot read outside the folder.
  const mimeType = imageTypeOf(file);
  if (!mimeType) return missing();

  const etag = `"${file}"`;
  const cacheControl = `public, max-age=${ONE_YEAR}, immutable`;

  if (request.headers.get("if-none-match") === etag) {
    return new NextResponse(null, {
      status: 304,
      headers: { ETag: etag, "Cache-Control": cacheControl },
    });
  }

  const bytes = await readUpload(file);
  if (!bytes) return missing();

  return new NextResponse(new Uint8Array(bytes), {
    headers: {
      "Content-Type": mimeType,
      "Content-Length": String(bytes.byteLength),
      "Cache-Control": cacheControl,
      ETag: etag,
    },
  });
}
