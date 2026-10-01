import Link from "next/link";

import {
  DashLink,
  Empty,
  PageHeading,
  Panel,
  RowActions,
  RowLink,
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
      where: { status: "PUBLISHED", stock: { not: null, lte: 2 } },
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
        title={firstName ? `Hello, ${firstName}` : "Welcome"}
        subtitle={
          pendingOrders + newMessages === 0
            ? "You're all caught up. Nothing is waiting for you."
            : "Here is what is waiting for you today."
        }
        action={
          <div className="flex flex-wrap gap-3">
            <DashLink href="/dashboard/products/new" variant="solid">
              + Add a product
            </DashLink>
            <DashLink href="/dashboard/posts/new">+ Write a blog article</DashLink>
          </div>
        }
      />

      <StatRow>
        <StatTile
          label="New orders to confirm"
          value={pendingOrders}
          emphasis={pendingOrders > 0}
          hint={pendingOrders === 0 ? "Nothing to do" : "Click to see them"}
          href="/dashboard/orders?status=PENDING"
        />
        <StatTile
          label="Messages to read"
          value={newMessages}
          emphasis={newMessages > 0}
          hint={newMessages === 0 ? "Nothing to do" : "Click to read them"}
          href="/dashboard/messages?status=NEW"
        />
        <StatTile
          label="Sales in the last 30 days"
          value={formatCents(revenue._sum.totalCents ?? 0)}
          hint="Cancelled orders not counted"
          href="/dashboard/orders"
        />
        <StatTile
          label="Products on your website"
          value={publishedProducts}
          hint={
            draftPosts > 0
              ? `${plural(draftPosts, "article")} not published yet`
              : "See all products"
          }
          href="/dashboard/products"
        />
      </StatRow>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:gap-8">
        <Panel
          title="Latest orders"
          action={
            <Link href="/dashboard/orders" className="text-[15px] text-muted underline hover:text-gold">
              See all orders →
            </Link>
          }
        >
          {recentOrders.length === 0 ? (
            <Empty>No orders yet. When a customer orders, it will appear here.</Empty>
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Order</Th>
                  <Th>Customer</Th>
                  <Th>Amount</Th>
                  <Th>Progress</Th>
                  <Th>Date</Th>
                  <Th>Options</Th>
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
                    <Td label="Amount" className="lining-nums tabular-nums">
                      {formatCents(order.totalCents, order.currency)}
                    </Td>
                    <Td label="Progress">
                      <StatusPill status={order.status} />
                    </Td>
                    <Td label="Date" className="whitespace-nowrap text-muted">
                      {formatDateTime(order.createdAt)}
                    </Td>
                    <Td label="Options">
                      <RowActions>
                        <RowLink tone="solid" href={`/dashboard/orders/${order.id}`}>
                          Open
                        </RowLink>
                      </RowActions>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Panel>

        <div className="flex flex-col gap-6 lg:gap-8">
          <Panel
            title="Latest messages"
            action={
              <Link href="/dashboard/messages" className="text-[15px] text-muted underline hover:text-gold">
                See all →
              </Link>
            }
          >
            {recentMessages.length === 0 ? (
              <Empty>No messages yet.</Empty>
            ) : (
              <ul>
                {recentMessages.map((message) => (
                  <li key={message.id} className="border-b border-ink/8 last:border-0">
                    <Link
                      href={`/dashboard/messages/${message.id}`}
                      className="flex flex-col gap-1.5 px-4 py-4 transition-colors hover:bg-parchment/60 sm:px-6"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[16px] text-ink">{message.subject}</span>
                        <StatusPill status={message.status} />
                      </div>
                      <span className="text-[14px] text-muted">
                        From {message.name} · {formatDateTime(message.createdAt)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          {lowStock.length > 0 ? (
          <Panel title="Almost sold out">
            {(
              <ul>
                {lowStock.map((product) => (
                  <li key={product.id} className="border-b border-ink/8 last:border-0">
                    <Link
                      href={`/dashboard/products/${product.id}`}
                      className="flex items-center justify-between gap-4 px-4 py-3.5 transition-colors hover:bg-parchment/60 sm:px-6"
                    >
                      <span className="text-[16px]">{product.name}</span>
                      <span
                        className={`text-[15px] lining-nums tabular-nums ${product.stock === 0 ? "font-medium text-red-700" : "text-muted"}`}
                      >
                        {product.stock === 0 ? "Sold out" : `${product.stock} left`}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
          ) : null}
        </div>
      </div>
    </>
  );
}
