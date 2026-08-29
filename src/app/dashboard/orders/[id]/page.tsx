import Link from "next/link";
import { notFound } from "next/navigation";

import { OrderEditor } from "@/app/dashboard/orders/order-editor";
import {
  DashLink,
  PageHeading,
  Panel,
  StatusPill,
  Table,
  Td,
  Th,
} from "@/components/dashboard/ui";
import { contact, hasEmail } from "@/config/site";
import { formatCents } from "@/lib/money";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/utils";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id } });

  if (!order) notFound();

  const mailSubject = encodeURIComponent(`Your order ${order.number} — The Maker`);
  const mailBody = encodeURIComponent(
    `Bonjour ${order.customerName.split(" ")[0]},\n\nThank you for your order ${order.number}.\n\n`,
  );

  return (
    <>
      <PageHeading
        title={order.number}
        subtitle={`Placed ${formatDateTime(order.createdAt)}`}
        action={
          <div className="flex flex-wrap items-center gap-3">
            <StatusPill status={order.status} />
            <DashLink href="/dashboard/orders">← All orders</DashLink>
          </div>
        }
      />

      <div className="grid gap-6 lg:gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="flex flex-col gap-6 lg:gap-8">
          <Panel title="Pieces">
            <Table>
              <thead>
                <tr>
                  <Th>Piece</Th>
                  <Th>Unit</Th>
                  <Th>Qty</Th>
                  <Th>Line</Th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.productId}>
                    <Td primary>
                      <Link
                        href={`/products/${item.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gold"
                      >
                        {item.name}
                      </Link>
                      <span className="mt-1 block text-[12px] text-faint">
                        {item.reference} · {item.material}
                      </span>
                    </Td>
                    <Td label="Unit" className="lining-nums tabular-nums text-muted">
                      {formatCents(item.unitCents, order.currency)}
                    </Td>
                    <Td label="Qty" className="lining-nums tabular-nums">
                      {item.quantity}
                    </Td>
                    <Td label="Line" className="lining-nums tabular-nums">
                      {formatCents(item.unitCents * item.quantity, order.currency)}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <dl className="flex flex-col gap-2.5 px-4 py-5 sm:px-6 text-[14px]">
              <div className="flex justify-between gap-6">
                <dt className="text-muted">Subtotal</dt>
                <dd className="lining-nums tabular-nums">
                  {formatCents(order.subtotalCents, order.currency)}
                </dd>
              </div>
              <div className="flex justify-between gap-6">
                <dt className="text-muted">Shipping</dt>
                <dd className="lining-nums tabular-nums">
                  {order.shippingCents === 0
                    ? "Free"
                    : formatCents(order.shippingCents, order.currency)}
                </dd>
              </div>
              <div className="mt-2 flex justify-between gap-6 border-t border-ink/12 pt-3">
                <dt>Total</dt>
                <dd className="font-serif text-[1.5rem] font-normal leading-none lining-nums tabular-nums">
                  {formatCents(order.totalCents, order.currency)}
                </dd>
              </div>
            </dl>
          </Panel>

          {order.customerNote ? (
            <Panel title="Note from the customer">
              <p className="px-4 py-5 sm:px-6 text-[15px] leading-relaxed text-ink-soft">
                {order.customerNote}
              </p>
            </Panel>
          ) : null}
        </div>

        <div className="flex flex-col gap-6 lg:gap-8">
          <Panel
            title="Customer"
            action={
              hasEmail ? (
                <a
                  href={`mailto:${order.customerEmail}?subject=${mailSubject}&body=${mailBody}`}
                  className="text-[11px] uppercase tracking-[0.16em] text-muted hover:text-gold"
                >
                  Reply ↗
                </a>
              ) : null
            }
          >
            <div className="flex flex-col gap-4 p-4 sm:p-6 text-[14px]">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] uppercase tracking-[0.16em] text-faint">
                  Name
                </span>
                <span>{order.customerName}</span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[11px] uppercase tracking-[0.16em] text-faint">
                  Email
                </span>
                <a href={`mailto:${order.customerEmail}`} className="hover:text-gold">
                  {order.customerEmail}
                </a>
              </div>

              {order.customerPhone ? (
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] uppercase tracking-[0.16em] text-faint">
                    Telephone
                  </span>
                  <a href={`tel:${order.customerPhone}`} className="hover:text-gold">
                    {order.customerPhone}
                  </a>
                </div>
              ) : null}

              <div className="flex flex-col gap-1">
                <span className="text-[11px] uppercase tracking-[0.16em] text-faint">
                  Deliver to
                </span>
                <address className="not-italic leading-relaxed">
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

              <p className="border-t border-ink/10 pt-4 text-[12px] leading-relaxed text-faint">
                {hasEmail
                  ? `Invoices go out from ${contact.email}.`
                  : "Invoices go out by hand — arrange payment with the customer directly."}{" "}
                Nothing is charged through the site — confirm here once payment has cleared.
              </p>
            </div>
          </Panel>

          <OrderEditor
            id={order.id}
            status={order.status}
            internalNote={order.internalNote}
          />
        </div>
      </div>
    </>
  );
}
