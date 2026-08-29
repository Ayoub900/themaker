import Link from "next/link";
import { notFound } from "next/navigation";

import { ButtonLink, Container, Eyebrow } from "@/components/ui";
import { contact, hasPhone, hasWhatsapp, policies } from "@/config/site";
import { formatCents } from "@/lib/money";
import { getOrderByNumber } from "@/lib/queries";
import { pageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

/** Order references are unguessable, but they are still never indexed. */
export const dynamic = "force-dynamic";

export const metadata = pageMetadata({
  title: "Order confirmed",
  description: "Your order reference and what happens next.",
  path: "/orders",
  noIndex: true,
});

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ number: string }>;
}) {
  const { number } = await params;
  const order = await getOrderByNumber(decodeURIComponent(number));

  if (!order) notFound();

  return (
    <section className="py-14 md:py-20">
      <Container className="flex max-w-[820px] flex-col gap-10">
        <div className="flex flex-col gap-5">
          <Eyebrow>Order {order.number}</Eyebrow>
          <h1 className="text-[clamp(2.25rem,5vw,3.25rem)] leading-[1.08]">
            Thank you — it is on the bench list.
          </h1>
          <p className="max-w-[52ch] text-[16px] leading-[1.8] text-muted">
            We confirm every order by hand. One of us will be in touch within one working
            day with the invoice and a real dispatch date
            {hasPhone ? (
              <>
                {" "}
                — telephone{" "}
                <a
                  href={`tel:${contact.phoneHref}`}
                  className="border-b border-gold pb-0.5 text-ink hover:text-gold"
                >
                  {contact.phone}
                </a>{" "}
                if you would rather not wait
              </>
            ) : hasWhatsapp ? (
              <>
                {" "}
                —{" "}
                <a
                  href={contact.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-b border-gold pb-0.5 text-ink hover:text-gold"
                >
                  message us on WhatsApp
                </a>{" "}
                if you would rather not wait
              </>
            ) : null}
            . Catalogue pieces ship in {policies.leadTimeStock}.
          </p>
        </div>

        <div className="border border-ink/12">
          <div className="flex flex-wrap justify-between gap-4 border-b border-ink/12 px-6 py-5 text-[13px]">
            <span className="text-faint">
              Placed <time dateTime={order.createdAt.toISOString()}>{formatDate(order.createdAt)}</time>
            </span>
            <span className="text-faint">
              Status <span className="text-ink-soft">{order.status.toLowerCase().replace("_", " ")}</span>
            </span>
          </div>

          <ul className="px-6">
            {order.items.map((item) => (
              <li
                key={item.productId}
                className="flex flex-wrap justify-between gap-x-6 gap-y-1 border-b border-ink/8 py-5"
              >
                <div className="flex flex-col gap-1">
                  <Link href={`/products/${item.slug}`} className="font-serif text-[1.35rem] hover:text-gold">
                    {item.name}
                  </Link>
                  <span className="text-[13px] text-faint">
                    {item.reference} · {item.material}
                    {item.quantity > 1 ? ` · × ${item.quantity}` : ""}
                  </span>
                </div>
                <span className="lining-nums tabular-nums text-[15px] text-muted">
                  {formatCents(item.unitCents * item.quantity, order.currency)}
                </span>
              </li>
            ))}
          </ul>

          <dl className="flex flex-col gap-3 px-6 py-6 text-[15px]">
            <div className="flex justify-between gap-6">
              <dt className="text-muted">Subtotal</dt>
              <dd className="lining-nums tabular-nums">{formatCents(order.subtotalCents, order.currency)}</dd>
            </div>
            <div className="flex justify-between gap-6">
              <dt className="text-muted">Shipping</dt>
              <dd className="lining-nums tabular-nums">
                {order.shippingCents === 0
                  ? "Free"
                  : formatCents(order.shippingCents, order.currency)}
              </dd>
            </div>
            <div className="mt-2 flex justify-between gap-6 border-t border-ink/15 pt-4">
              <dt>Total</dt>
              <dd className="font-serif text-[1.6rem] font-normal leading-none lining-nums tabular-nums">
                {formatCents(order.totalCents, order.currency)}
              </dd>
            </div>
          </dl>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <h2 className="text-[11px] uppercase tracking-[0.2em] text-gold">Delivering to</h2>
            <address className="text-[15px] not-italic leading-relaxed text-ink-soft">
              {order.customerName}
              <br />
              {order.address.line1}
              {order.address.line2 ? (
                <>
                  <br />
                  {order.address.line2}
                </>
              ) : null}
              <br />
              {order.address.postalCode} {order.address.city}
              <br />
              {order.address.country}
            </address>
          </div>

          {order.customerNote ? (
            <div className="flex flex-col gap-2">
              <h2 className="text-[11px] uppercase tracking-[0.2em] text-gold">Your note</h2>
              <p className="text-[15px] leading-relaxed text-ink-soft">{order.customerNote}</p>
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-4 border-t border-ink/12 pt-8">
          <ButtonLink href="/products" variant="outline">
            Keep looking
          </ButtonLink>
          <p className="text-[13px] text-faint">
            Keep this reference: <span className="text-ink-soft">{order.number}</span>
          </p>
        </div>
      </Container>
    </section>
  );
}
