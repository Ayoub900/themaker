"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useCart } from "@/components/shop/cart-provider";
import { Button, ButtonLink, EmptyState } from "@/components/ui";
import { policies, shipping, site } from "@/config/site";
import { formatCents, shippingCentsFor } from "@/lib/money";

const fieldClass =
  "w-full border border-ink/20 bg-transparent px-4 py-3.5 text-[16px] sm:text-[15px] transition-colors placeholder:text-faint/70 focus:border-gold focus:outline-none";
const labelClass = "text-[11px] uppercase tracking-[0.18em] text-muted";

export function CheckoutForm() {
  const router = useRouter();
  const { lines, subtotalCents, ready, clear } = useCart();

  const [state, setState] = useState<"idle" | "sending" | "error">("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!ready) {
    return <div className="h-96 animate-pulse bg-parchment" aria-hidden="true" />;
  }

  if (lines.length === 0) {
    return (
      <EmptyState
        title="There is nothing to order"
        body="Your cart is empty. Have a look at the catalogue first."
        action={<ButtonLink href="/products">Browse products</ButtonLink>}
      />
    );
  }

  const shippingCents = shippingCentsFor(subtotalCents);
  const totalCents = subtotalCents + shippingCents;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    setState("sending");
    setErrors({});

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          items: lines.map((line) => ({
            productId: line.productId,
            quantity: line.quantity,
          })),
        }),
      });

      const payload: {
        number?: string;
        message?: string;
        errors?: Record<string, string>;
      } = await response.json();

      if (!response.ok || !payload.number) {
        setState("error");
        setErrors(payload.errors ?? {});
        setMessage(payload.message ?? "The order did not go through. Try again.");
        return;
      }

      clear();
      router.push(`/orders/${payload.number}`);
    } catch {
      setState("error");
      setMessage("No connection. Your cart is safe — try again in a moment.");
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
      <div className="flex flex-col gap-10">
        <fieldset className="flex flex-col gap-6">
          <legend className="mb-2 border-b border-ink/15 pb-4 font-serif text-2xl w-full">
            Who you are
          </legend>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="customerName" className={labelClass}>
                Full name
              </label>
              <input id="customerName" name="customerName" required autoComplete="name" className={fieldClass} />
              {errors.customerName ? (
                <p className="text-[13px] text-gold">{errors.customerName}</p>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="customerEmail" className={labelClass}>
                Email
              </label>
              <input
                id="customerEmail"
                name="customerEmail"
                type="email"
                required
                autoComplete="email"
                className={fieldClass}
              />
              {errors.customerEmail ? (
                <p className="text-[13px] text-gold">{errors.customerEmail}</p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="customerPhone" className={labelClass}>
              Telephone
            </label>
            <input
              id="customerPhone"
              name="customerPhone"
              type="tel"
              required
              autoComplete="tel"
              className={fieldClass}
            />
            {errors.customerPhone ? (
              <p className="text-[13px] text-gold">{errors.customerPhone}</p>
            ) : null}
          </div>
        </fieldset>

        <fieldset className="flex flex-col gap-6">
          <legend className="mb-2 border-b border-ink/15 pb-4 font-serif text-2xl w-full">
            Where it goes
          </legend>

          <div className="flex flex-col gap-2">
            <label htmlFor="line1" className={labelClass}>
              Address
            </label>
            <input id="line1" name="line1" required autoComplete="address-line1" className={fieldClass} />
            {errors.line1 ? <p className="text-[13px] text-gold">{errors.line1}</p> : null}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="line2" className={labelClass}>
              Apartment, floor, door code{" "}
              <span className="normal-case tracking-normal text-faint">(optional)</span>
            </label>
            <input id="line2" name="line2" autoComplete="address-line2" className={fieldClass} />
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <div className="flex flex-col gap-2 sm:col-span-1">
              <label htmlFor="postalCode" className={labelClass}>
                Postcode
              </label>
              <input id="postalCode" name="postalCode" required autoComplete="postal-code" className={fieldClass} />
            </div>
            <div className="flex flex-col gap-2 sm:col-span-2">
              <label htmlFor="city" className={labelClass}>
                City
              </label>
              <input id="city" name="city" required autoComplete="address-level2" className={fieldClass} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="country" className={labelClass}>
              Country
            </label>
            <input
              id="country"
              name="country"
              required
              autoComplete="country-name"
              defaultValue={site.country}
              className={fieldClass}
            />
          </div>

          <p className="text-[12px] leading-relaxed text-faint">
            {shipping.internationalNote}
          </p>
        </fieldset>

        <fieldset className="flex flex-col gap-4">
          <legend className="mb-2 border-b border-ink/15 pb-4 font-serif text-2xl w-full">
            Anything we should know
          </legend>
          <label htmlFor="customerNote" className="sr-only">
            Note for the workshop
          </label>
          <textarea
            id="customerNote"
            name="customerNote"
            rows={4}
            className={`${fieldClass} resize-y`}
            placeholder="Deadlines, a drop length for a pendant, or how you would like it wrapped."
          />
        </fieldset>

        {/* Honeypot */}
        <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="company">Company</label>
          <input id="company" name="company" tabIndex={-1} autoComplete="off" />
        </div>
      </div>

      <aside className="lg:sticky lg:top-32 lg:self-start">
        <div className="bg-parchment p-8">
          <h2 className="font-serif text-2xl">Your order</h2>

          <ul className="mt-6 flex flex-col gap-4 border-b border-ink/15 pb-5">
            {lines.map((line) => (
              <li key={line.productId} className="flex justify-between gap-4 text-[14px]">
                <span className="text-ink-soft">
                  {line.name}
                  {line.quantity > 1 ? (
                    <span className="text-faint"> × {line.quantity}</span>
                  ) : null}
                </span>
                <span className="shrink-0 lining-nums tabular-nums text-muted">
                  {formatCents(line.unitCents * line.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-5 flex flex-col gap-3 text-[15px]">
            <div className="flex justify-between gap-6">
              <dt className="text-muted">Subtotal</dt>
              <dd className="lining-nums tabular-nums">{formatCents(subtotalCents)}</dd>
            </div>
            <div className="flex justify-between gap-6">
              <dt className="text-muted">Shipping</dt>
              <dd className="lining-nums tabular-nums">
                {shippingCents === 0 ? "Free" : formatCents(shippingCents)}
              </dd>
            </div>
            <div className="mt-3 flex justify-between gap-6 border-t border-ink/15 pt-4">
              <dt>Total</dt>
              <dd className="font-serif text-[1.6rem] font-normal leading-none lining-nums tabular-nums">
                {formatCents(totalCents)}
              </dd>
            </div>
          </dl>

          <Button type="submit" disabled={state === "sending"} className="mt-7 w-full">
            {state === "sending" ? "Placing the order…" : "Place the order"}
          </Button>

          {state === "error" ? (
            <p role="alert" className="mt-4 text-[13px] leading-relaxed text-gold">
              {message}
            </p>
          ) : null}

          <p className="mt-5 text-[12px] leading-relaxed text-faint">
            No card is taken here. We confirm the order within one working day and send an
            invoice payable by transfer or on delivery. Catalogue pieces ship in{" "}
            {policies.leadTimeStock}. By ordering you accept our{" "}
            <Link href="/terms" className="border-b border-gold pb-0.5 hover:text-gold">
              terms of sale
            </Link>
            .
          </p>
        </div>
      </aside>
    </form>
  );
}
