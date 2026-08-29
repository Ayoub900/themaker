import Link from "next/link";

import {
  DashLink,
  Empty,
  PageHeading,
  Panel,
  StatRow,
  StatTile,
  StatusPill,
  Table,
  Td,
  Th,
} from "@/components/dashboard/ui";
import { getSession } from "@/lib/auth";
import { formatCents } from "@/lib/money";
import { prisma } from "@/lib/prisma";
import { daysAgo, formatDateTime, plural } from "@/lib/utils";

export default async function DashboardOverview() {
  const session = await getSession();

  const thirtyDaysAgo = daysAgo(30);

  const [
    pendingOrders,
    newMessages,
    publishedProducts,
    draftPosts,
    lowStock,
    revenue,
    recentOrders,
    recentMessages,
  ] = await Promise.all([
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.message.count({ where: { status: "NEW" } }),
    prisma.product.count({ where: { status: "PUBLISHED" } }),
    prisma.post.count({ where: { status: "DRAFT" } }),
    prisma.product.findMany({
      where: { status: "PUBLISHED", stock: { lte: 2 } },
      orderBy: { stock: "asc" },
      take: 5,
      select: { id: true, name: true, slug: true, stock: true, reference: true },
    }),
    prisma.order.aggregate({
      _sum: { totalCents: true },
      where: {
        createdAt: { gte: thirtyDaysAgo },
        status: { notIn: ["CANCELLED"] },
      },
    }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        number: true,
        customerName: true,
        totalCents: true,
        currency: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.message.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        subject: true,
        topic: true,
        status: true,
        createdAt: true,
      },
    }),
  ]);

  const firstName = session?.name?.split(" ")[0] ?? "";

  return (
    <>
      <PageHeading
        title={firstName ? `Hello, ${firstName}` : "Overview"}
        subtitle="What needs a decision today."
        action={
          <div className="flex flex-wrap gap-3">
            <DashLink href="/dashboard/products/new">New product</DashLink>
            <DashLink href="/dashboard/posts/new" variant="solid">
              New journal post
            </DashLink>
          </div>
        }
      />

      <StatRow>
        <StatTile
          label="Orders awaiting you"
          value={pendingOrders}
          emphasis={pendingOrders > 0}
          hint={pendingOrders === 0 ? "Nothing to confirm" : "Needs confirming"}
          href="/dashboard/orders?status=PENDING"
        />
        <StatTile
          label="Unread messages"
          value={newMessages}
          emphasis={newMessages > 0}
          hint={newMessages === 0 ? "Inbox clear" : "Waiting on a reply"}
          href="/dashboard/messages?status=NEW"
        />
        <StatTile
          label="Last 30 days"
          value={formatCents(revenue._sum.totalCents ?? 0)}
          hint="Excluding cancellations"
          href="/dashboard/orders"
        />
        <StatTile
          label="Catalogue"
          value={publishedProducts}
          hint={plural(draftPosts, "journal draft")}
          href="/dashboard/products"
        />
      </StatRow>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:gap-8">
        <Panel
          title="Recent orders"
          action={
            <Link
              href="/dashboard/orders"
              className="text-[11px] uppercase tracking-[0.16em] text-muted hover:text-gold"
            >
              All orders →
            </Link>
          }
        >
          {recentOrders.length === 0 ? (
            <Empty>No orders yet.</Empty>
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Reference</Th>
                  <Th>Customer</Th>
                  <Th>Total</Th>
                  <Th>Status</Th>
                  <Th>Placed</Th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <Td primary>
                      <Link
                        href={`/dashboard/orders/${order.id}`}
                        className="font-mono text-[13px] hover:text-gold"
                      >
                        {order.number}
                      </Link>
                    </Td>
                    <Td label="Customer">{order.customerName}</Td>
                    <Td label="Total" className="lining-nums tabular-nums">
                      {formatCents(order.totalCents, order.currency)}
                    </Td>
                    <Td label="Status">
                      <StatusPill status={order.status} />
                    </Td>
                    <Td label="Placed" className="whitespace-nowrap text-faint">
                      {formatDateTime(order.createdAt)}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Panel>

        <div className="flex flex-col gap-6 lg:gap-8">
          <Panel
            title="Inbox"
            action={
              <Link
                href="/dashboard/messages"
                className="text-[11px] uppercase tracking-[0.16em] text-muted hover:text-gold"
              >
                All →
              </Link>
            }
          >
            {recentMessages.length === 0 ? (
              <Empty>Nothing waiting.</Empty>
            ) : (
              <ul>
                {recentMessages.map((message) => (
                  <li key={message.id} className="border-b border-ink/8 last:border-0">
                    <Link
                      href={`/dashboard/messages/${message.id}`}
                      className="flex flex-col gap-1.5 px-4 py-4 transition-colors hover:bg-parchment/60 sm:px-6"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[14px] text-ink">{message.subject}</span>
                        <StatusPill status={message.status} />
                      </div>
                      <span className="text-[12px] text-faint">
                        {message.name} · {message.topic.toLowerCase()} ·{" "}
                        {formatDateTime(message.createdAt)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="Running low">
            {lowStock.length === 0 ? (
              <Empty>Everything is stocked.</Empty>
            ) : (
              <ul>
                {lowStock.map((product) => (
                  <li key={product.id} className="border-b border-ink/8 last:border-0">
                    <Link
                      href={`/dashboard/products/${product.id}`}
                      className="flex items-center justify-between gap-4 px-4 py-3.5 transition-colors hover:bg-parchment/60 sm:px-6"
                    >
                      <span className="text-[14px]">{product.name}</span>
                      <span
                        className={`text-[13px] lining-nums tabular-nums ${product.stock === 0 ? "text-gold" : "text-faint"}`}
                      >
                        {product.stock === 0 ? "out" : `${product.stock} left`}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </>
  );
}
