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
import { prisma } from "@/lib/prisma";
import { formatDateTime, plural } from "@/lib/utils";

const STATUSES = ["ALL", "NEW", "READ", "REPLIED", "ARCHIVED"] as const;
type MessageStatus = Exclude<(typeof STATUSES)[number], "ALL">;

export default async function MessagesListPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const active = (status ?? "ALL").toUpperCase();

  const messages = await prisma.message.findMany({
    where:
      active !== "ALL" && STATUSES.includes(active as (typeof STATUSES)[number])
        ? { status: active as MessageStatus }
        : {},
    orderBy: { createdAt: "desc" },
    take: 200,
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
      <PageHeading title="Inbox" subtitle={plural(messages.length, "message")} />

      <Panel
        title="Messages"
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
          <Empty>Nothing here.</Empty>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Subject</Th>
                <Th>From</Th>
                <Th>About</Th>
                <Th>Status</Th>
                <Th>Received</Th>
              </tr>
            </thead>
            <tbody>
              {messages.map((message) => (
                <tr key={message.id}>
                  <Td primary>
                    <Link
                      href={`/dashboard/messages/${message.id}`}
                      className={`text-[15px] hover:text-gold ${
                        message.status === "NEW" ? "text-ink" : "text-ink-soft"
                      }`}
                    >
                      {message.subject}
                    </Link>
                  </Td>
                  <Td label="From">
                    {message.name}
                    <span className="mt-1 block text-[12px] text-faint">{message.email}</span>
                  </Td>
                  <Td label="About" className="text-muted">
                    {message.topic.toLowerCase()}
                  </Td>
                  <Td label="Status">
                    <StatusPill status={message.status} />
                  </Td>
                  <Td label="Received" className="whitespace-nowrap text-faint">
                    {formatDateTime(message.createdAt)}
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Panel>
    </>
  );
}
