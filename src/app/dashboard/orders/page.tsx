import Link from "next/link";

import {
  Empty,
  FilterTabs,
  PageHeading,
  Panel,
  StatusPill,
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
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const active = (status ?? "ALL").toUpperCase();

  const orders = await prisma.order.findMany({
    where:
      active !== "ALL" && STATUSES.includes(active as (typeof STATUSES)[number])
        ? { status: active as OrderStatus }
        : {},
    orderBy: { createdAt: "desc" },
    take: 200,
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
        subtitle={plural(orders.length, "order")}
      />

      <Panel
        title="All orders"
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
          <Empty>No orders with that status.</Empty>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Reference</Th>
                <Th>Customer</Th>
                <Th>Pieces</Th>
                <Th>Total</Th>
                <Th>Status</Th>
                <Th>Placed</Th>
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
                      <span className="mt-1 block text-[12px] text-faint">
                        {order.customerEmail}
                      </span>
                    </Td>
                    <Td label="Pieces" className="lining-nums tabular-nums text-muted">
                      {pieces}
                    </Td>
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
                );
              })}
            </tbody>
          </Table>
        )}
      </Panel>
    </>
  );
}
