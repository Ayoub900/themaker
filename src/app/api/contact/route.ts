import { NextResponse, type NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";
import { contactSchema, fieldErrors } from "@/lib/validation";

export const runtime = "nodejs";

/** Crude per-instance flood guard, on top of the honeypot. */
const recent = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function tooMany(key: string): boolean {
  const now = Date.now();
  const hits = (recent.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  hits.push(now);
  recent.set(key, hits);

  // Keep the map from growing without bound on a long-lived instance.
  if (recent.size > 5_000) recent.clear();

  return hits.length > MAX_PER_WINDOW;
}

function clientKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: NextRequest) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Malformed request." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Some fields need attention.", errors: fieldErrors(parsed.error) },
      { status: 422 },
    );
  }

  // A filled honeypot is a bot. Answer as though it worked and store nothing.
  if (parsed.data.company) {
    return NextResponse.json({ message: "Message received." });
  }

  if (tooMany(clientKey(request))) {
    return NextResponse.json(
      { message: "That is a lot of messages. Try again a little later, or write to us on WhatsApp." },
      { status: 429 },
    );
  }

  const { name, email, topic, subject, body } = parsed.data;

  await prisma.message.create({
    data: { name, email, topic, subject, body },
  });

  return NextResponse.json({ message: "Message received." }, { status: 201 });
}
