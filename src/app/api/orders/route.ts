import { NextResponse, type NextRequest } from "next/server";

import { currency } from "@/config/site";
import { prisma } from "@/lib/prisma";
import { orderTotals } from "@/lib/money";
import { makeOrderNumber } from "@/lib/utils";
import { checkoutSchema, fieldErrors } from "@/lib/validation";

export const runtime = "nodejs";

/**
 * Places an order.
 *
 * The browser sends product ids and quantities only. Names, materials and above
 * all prices are read back from the database here, so a tampered cart cannot
 * change what anything costs.
 */
export async function POST(request: NextRequest) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Malformed request." }, { status: 400 });
  }

  const parsed = checkoutSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Some details need attention.", errors: fieldErrors(parsed.error) },
      { status: 422 },
    );
  }

  if (parsed.data.company) {
    return NextResponse.json({ message: "Order received." }, { status: 202 });
  }

  const input = parsed.data;

  const products = await prisma.product.findMany({
    where: {
      id: { in: input.items.map((item) => item.productId) },
      status: "PUBLISHED",
    },
  });
  const byId = new Map(products.map((product) => [product.id, product]));

  const missing = input.items.filter((item) => !byId.has(item.productId));
  if (missing.length > 0) {
    return NextResponse.json(
      {
        message:
          "Something in your cart is no longer in the catalogue. Remove it and try again.",
      },
      { status: 409 },
    );
  }

  const items = input.items.map((item) => {
    const product = byId.get(item.productId)!;
    return {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      material: product.material,
      reference: product.reference,
      unitCents: product.priceCents,
      quantity: item.quantity,
    };
  });

  const subtotalCents = items.reduce(
    (sum, item) => sum + item.unitCents * item.quantity,
    0,
  );
  const totals = orderTotals(subtotalCents);

  const order = await prisma.order.create({
    data: {
      number: makeOrderNumber(),
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      customerPhone: input.customerPhone,
      address: {
        line1: input.line1,
        line2: input.line2 || null,
        city: input.city,
        postalCode: input.postalCode,
        country: input.country,
      },
      items,
      subtotalCents: totals.subtotalCents,
      shippingCents: totals.shippingCents,
      totalCents: totals.totalCents,
      currency: currency.code,
      customerNote: input.customerNote || null,
    },
    select: { number: true },
  });

  // Stock is decremented on confirmation, not on order, because the workshop
  // confirms by hand — see the dashboard.
  return NextResponse.json({ number: order.number }, { status: 201 });
}
