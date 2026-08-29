import { NextResponse } from "next/server";

import { requireSession } from "@/lib/auth";
import { isImageId } from "@/lib/images";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

/**
 * Discards an upload the editor removed again before saving.
 *
 * Without this, changing your mind twice about a photograph would leave both
 * rejected files in the database for good. A photograph that some piece is
 * already using is never deleted here — that only happens through saving or
 * deleting the piece itself, which is what knows the change is intended.
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireSession();
  } catch {
    return NextResponse.json({ message: "Your session has expired." }, { status: 401 });
  }

  const { id } = await params;
  if (!isImageId(id)) return NextResponse.json({ message: "Not found." }, { status: 404 });

  const [product, post] = await Promise.all([
    prisma.product.findFirst({ where: { images: { some: { id } } }, select: { id: true } }),
    prisma.post.findFirst({ where: { image: { is: { id } } }, select: { id: true } }),
  ]);

  if (product || post) {
    return NextResponse.json(
      { message: "That photograph is in use." },
      { status: 409 },
    );
  }

  await prisma.image.deleteMany({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
