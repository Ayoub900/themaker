import { NextResponse, type NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";
import { rateLimit, requestIp } from "@/lib/rate-limit";
import { contactSchema, fieldErrors } from "@/lib/validation";

export const runtime = "nodejs";

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

  const limited = await rateLimit(`contact:${requestIp(request.headers)}`, {
    limit: 5,
    windowMs: 10 * 60_000,
  });
  if (!limited.allowed) {
    return NextResponse.json(
      { message: "That is a lot of messages. Try again a little later, or write to us on WhatsApp." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSeconds) } },
    );
  }

  const { name, email, topic, subject, body } = parsed.data;

  await prisma.message.create({
    data: { name, email, topic, subject, body },
  });

  return NextResponse.json({ message: "Message received." }, { status: 201 });
}
