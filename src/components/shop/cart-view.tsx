"use client";

import Link from "next/link";

import { useCart } from "@/components/shop/cart-provider";
import { ButtonLink, EmptyState, ImageSlot } from "@/components/ui";
import { shipping } from "@/config/site";
import { formatCents, shippingCentsFor } from "@/lib/money";
import { plural } from "@/lib/utils";

export function CartView() {
  const { lines, count, subtotalCents, ready, setQuantity, remove } = useCart();

  if (!ready) {
    return <div className="h-64 animate-pulse bg-parchment" aria-hidden="true" />;
  }

  if (lines.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        body="Twenty-four things, made one at a time. Start with the catalogue."
        action={<ButtonLink href="/products">Browse products</ButtonLink>}
      />
    );
  }

  const estimatedShipping = shippingCentsFor(subtotalCents);
  const remaining = shipping.freeThresholdCents - subtotalCents;

  return (
    <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
      <div>
        <div className="flex items-baseline justify-between border-b border-ink/15 pb-4">
          <h2 className="font-serif text-2xl">Your cart</h2>
          <span className="text-[13px] text-faint">{plural(count, "piece")}</span>
        </div>

        <ul>
          {lines.map((line) => (
            <li
              key={line.productId}
              className="flex gap-5 border-b border-ink/10 py-6 sm:gap-7"
            >
              <Link href={`/products/${line.slug}`} className="w-20 shrink-0 sm:w-28">
                <ImageSlot
                  label={line.imageSlot}
                  image={line.image}
                  ratio="4 / 5"
                  sizes="112px"
                  className="p-2"
                />
              </Link>

              <div className="flex flex-1 flex-col gap-2">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <Link
                    href={`/products/${line.slug}`}
                    className="font-serif text-[1.4rem] leading-tight hover:text-gold"
                  >
                    {line.name}
                  </Link>
                  <span className="text-[15px] text-muted">
                    {formatCents(line.unitCents * line.quantity)}
                  </span>
                </div>

                <span className="text-[13px] text-faint">
                  {line.reference} · {line.material}
                </span>

                <div className="mt-2 flex flex-wrap items-center gap-4">
                  <div className="flex items-center border border-ink/20">
                    <button
                      type="button"
                      onClick={() => setQuantity(line.productId, line.quantity - 1)}
                      aria-label={`Decrease quantity of ${line.name}`}
                      className="px-3 py-2 text-muted transition-colors hover:text-gold"
                    >
                      −
                    </button>
                    <span className="min-w-8 text-center text-[14px] lining-nums tabular-nums">
                      {line.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(line.productId, line.quantity + 1)}
                      disabled={line.quantity >= 25}
                      aria-label={`Increase quantity of ${line.name}`}
                      className="px-3 py-2 text-muted transition-colors hover:text-gold disabled:opacity-35"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => remove(line.productId)}
                    className="text-[11px] uppercase tracking-[0.16em] text-faint transition-colors hover:text-gold"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <aside className="lg:sticky lg:top-32 lg:self-start">
        <div className="bg-parchment p-8">
          <h2 className="font-serif text-2xl">Summary</h2>

          <dl className="mt-6 flex flex-col gap-3 text-[15px]">
            <div className="flex justify-between gap-6">
              <dt className="text-muted">Subtotal</dt>
              <dd className="lining-nums tabular-nums">{formatCents(subtotalCents)}</dd>
            </div>
            <div className="flex justify-between gap-6">
              <dt className="text-muted">Shipping, estimated</dt>
              <dd className="lining-nums tabular-nums">
                {estimatedShipping === 0 ? "Free" : formatCents(estimatedShipping)}
              </dd>
            </div>
            <div className="mt-3 flex justify-between gap-6 border-t border-ink/15 pt-4 text-[17px]">
              <dt>Total</dt>
              <dd className="font-serif text-[1.6rem] font-normal leading-none lining-nums tabular-nums">
                {formatCents(subtotalCents + estimatedShipping)}
              </dd>
            </div>
          </dl>

          {remaining > 0 ? (
            <p className="mt-5 text-[13px] leading-relaxed text-faint">
              {formatCents(remaining)} more for free shipping.
            </p>
          ) : null}

          <ButtonLink href="/checkout" className="mt-7 w-full">
            Checkout
          </ButtonLink>

          <p className="mt-4 text-[12px] leading-relaxed text-faint">
            Shipping is confirmed at checkout once you choose a destination. Nothing is
            charged online — we send an invoice when the order is confirmed.
          </p>
        </div>

        <Link
          href="/products"
          className="mt-6 inline-block border-b border-gold pb-1 text-[11px] uppercase tracking-[0.18em] hover:text-gold"
        >
          Keep looking
        </Link>
      </aside>
    </div>
  );
}
