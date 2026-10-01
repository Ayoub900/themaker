import Link from "next/link";

import {
  Empty,
  FilterTabs,
  PAGE_SIZE,
  PageHeading,
  Pagination,
  Panel,
  RowDelete,
  RowActions,
  RowLink,
  StatusPill,
  parsePage,
  Table,
  Td,
  Th,
} from "@/components/dashboard/ui";
import { deleteMessage } from "@/app/dashboard/actions";
import { prisma } from "@/lib/prisma";
import { formatDateTime, plural } from "@/lib/utils";

const STATUSES = ["ALL", "NEW", "READ", "REPLIED", "ARCHIVED"] as const;
type MessageStatus = Exclude<(typeof STATUSES)[number], "ALL">;

export default async function MessagesListPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const { status, page: pageParam } = await searchParams;
  const active = (status ?? "ALL").toUpperCase();

  const where =
    active !== "ALL" && STATUSES.includes(active as (typeof STATUSES)[number])
      ? { status: active as MessageStatus }
      : {};

  const total = await prisma.message.count({ where });
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(parsePage(pageParam), pageCount);

  const messages = await prisma.message.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    select: {
      id: true,
      name: true,
      email: true,
      subject: true,
      topic: true,
      status: true,
      createdAt: true,
    },
  });

  return (
    <>
      <PageHeading title="Messages" subtitle={`${plural(total, "message")} from people who wrote to you through the website.`} />

      <Panel
        title="Your messages"
        action={
          <FilterTabs
            label="Filter messages by status"
            options={STATUSES}
            active={active}
            hrefFor={(option) =>
              option === "ALL" ? "/dashboard/messages" : `/dashboard/messages?status=${option}`
            }
          />
        }
      >
        {messages.length === 0 ? (
          <Empty>No messages here.</Empty>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Subject</Th>
                <Th>From</Th>
                <Th>About</Th>
                <Th>Read?</Th>
                <Th>Date</Th>
                  <Th>Options</Th>
              </tr>
            </thead>
            <tbody>
              {messages.map((message) => (
                <tr key={message.id}>
                  <Td primary>
                    <Link
                      href={`/dashboard/messages/${message.id}`}
                      className={`text-[17px] hover:text-gold ${
                        message.status === "NEW" ? "font-semibold text-ink" : "text-ink-soft"
                      }`}
                    >
                      {message.subject}
                    </Link>
                  </Td>
                  <Td label="From">
                    {message.name}
                    <span className="mt-1 block text-[14px] text-muted">{message.email}</span>
                  </Td>
                  <Td label="About" className="text-muted">
                    {message.topic.toLowerCase()}
                  </Td>
                  <Td label="Read?">
                    <StatusPill status={message.status} />
                  </Td>
                  <Td label="Date" className="whitespace-nowrap text-muted">
                    {formatDateTime(message.createdAt)}
                  </Td>
                  <Td label="Options">
                    <RowActions>
                      <RowLink tone="solid" href={`/dashboard/messages/${message.id}`}>
                        Read
                      </RowLink>
                      <RowDelete
                        id={message.id}
                        action={deleteMessage}
                        confirm="Delete this message for good? This cannot be undone."
                      />
                    </RowActions>
                  </Td>
                </tr>
              ))}
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
            return query ? `/dashboard/messages?${query}` : "/dashboard/messages";
          }}
        />
      </Panel>
    </>
  );
}
