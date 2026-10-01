import Link from "next/link";

import {
  Empty,
  FilterTabs,
  PAGE_SIZE,
  PageHeading,
  Pagination,
  Panel,
  RowActions,
  RowLink,
  StatusPill,
  parsePage,
  Table,
  Td,
  Th,
} from "@/components/dashboard/ui";
import { formatCents } from "@/lib/money";
import { prisma } from "@/lib/prisma";
import { formatDateTime, plural } from "@/lib/utils";

const STATUSES = [
  "ALL",
  "PENDING",
  "CONFIRMED",
  "IN_PRODUCTION",
  "SHIPPED",
  "COMPLETED",
  "CANCELLED",
] as const;

type OrderStatus = Exclude<(typeof STATUSES)[number], "ALL">;

export default async function OrdersListPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const { status, page: pageParam } = await searchParams;
  const active = (status ?? "ALL").toUpperCase();

  const where =
    active !== "ALL" && STATUSES.includes(active as (typeof STATUSES)[number])
      ? { status: active as OrderStatus }
      : {};

  const total = await prisma.order.count({ where });
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(parsePage(pageParam), pageCount);

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    select: {
      id: true,
      number: true,
      customerName: true,
      customerEmail: true,
      items: true,
      totalCents: true,
      currency: true,
      status: true,
      createdAt: true,
    },
  });

  return (
    <>
      <PageHeading
        title="Orders"
        subtitle={`${plural(total, "order")} — click an order to see what to send and where.`}
      />

      <Panel
        title="Your orders"
        action={
          <FilterTabs
            label="Filter orders by status"
            options={STATUSES}
            active={active}
            hrefFor={(option) =>
              option === "ALL" ? "/dashboard/orders" : `/dashboard/orders?status=${option}`
            }
          />
        }
      >
        {orders.length === 0 ? (
          <Empty>No orders here.</Empty>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Order</Th>
                <Th>Customer</Th>
                <Th>Items</Th>
                <Th>Amount</Th>
                <Th>Progress</Th>
                <Th>Date</Th>
                  <Th>Options</Th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const pieces = order.items.reduce((sum, item) => sum + item.quantity, 0);
                return (
                  <tr key={order.id}>
                    <Td primary>
                      <Link
                        href={`/dashboard/orders/${order.id}`}
                        className="font-mono text-[13px] hover:text-gold"
                      >
                        {order.number}
                      </Link>
                    </Td>
                    <Td label="Customer">
                      {order.customerName}
                      <span className="mt-1 block text-[14px] text-muted">
                        {order.customerEmail}
                      </span>
                    </Td>
                    <Td label="Items" className="lining-nums tabular-nums text-muted">
                      {pieces}
                    </Td>
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
                );
              })}
            </tbody>
          </Table>
        )}
        <Pagination
          page={page}
          total={total}
          hrefFor={(p) => {
            const params = new URLSearchParams();
            if (active !== "ALL") params.set("status", active);
            if (p > 1) params.set("page", String(p));
            const query = params.toString();
            return query ? `/dashboard/orders?${query}` : "/dashboard/orders";
          }}
        />
      </Panel>
    </>
  );
}
