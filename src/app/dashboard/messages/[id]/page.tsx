import { notFound } from "next/navigation";

import { markMessageRead } from "@/app/dashboard/actions";
import { MessageEditor } from "@/app/dashboard/messages/message-editor";
import { DashLink, PageHeading, Panel, StatusPill } from "@/components/dashboard/ui";
import { address, hasEmail, site } from "@/config/site";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/utils";

export default async function MessageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const message = await prisma.message.findUnique({ where: { id } });

  if (!message) notFound();

  // Opening a message is what marks it read.
  if (message.status === "NEW") {
    await markMessageRead(message.id);
  }

  const mailSubject = encodeURIComponent(`Re: ${message.subject}`);
  const mailBody = encodeURIComponent(
    `Bonjour ${message.name.split(" ")[0]},\n\n\n\n—\n${site.name}, ${address.oneLine}\n`,
  );

  return (
    <>
      <PageHeading
        title={message.subject}
        subtitle={`${message.name} · ${formatDateTime(message.createdAt)}`}
        action={
          <div className="flex flex-wrap items-center gap-3">
            <StatusPill status={message.status === "NEW" ? "READ" : message.status} />
            <DashLink href="/dashboard/messages">← Inbox</DashLink>
          </div>
        }
      />

      <div className="grid gap-6 lg:gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="flex flex-col gap-6 lg:gap-8">
          <Panel
            title={`About: ${message.topic.toLowerCase()}`}
            action={
              hasEmail ? (
                <a
                  href={`mailto:${message.email}?subject=${mailSubject}&body=${mailBody}`}
                  className="text-[11px] uppercase tracking-[0.16em] text-muted hover:text-gold"
                >
                  Reply by email ↗
                </a>
              ) : null
            }
          >
            <div className="whitespace-pre-wrap px-4 py-5 sm:px-6 sm:py-6 text-[15px] leading-[1.8] text-ink-soft">
              {message.body}
            </div>
          </Panel>

          {message.reply ? (
            <Panel title={`Our reply${message.repliedAt ? ` · ${formatDateTime(message.repliedAt)}` : ""}`}>
              <div className="whitespace-pre-wrap px-4 py-5 sm:px-6 sm:py-6 text-[15px] leading-[1.8] text-muted">
                {message.reply}
              </div>
            </Panel>
          ) : null}
        </div>

        <div className="flex flex-col gap-6 lg:gap-8">
          <Panel title="Sender">
            <div className="flex flex-col gap-4 p-4 sm:p-6 text-[14px]">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] uppercase tracking-[0.16em] text-faint">Name</span>
                <span>{message.name}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] uppercase tracking-[0.16em] text-faint">Email</span>
                {hasEmail ? (
                  <a href={`mailto:${message.email}`} className="hover:text-gold">
                    {message.email}
                  </a>
                ) : (
                  <span>{message.email}</span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] uppercase tracking-[0.16em] text-faint">
                  Received
                </span>
                <span>{formatDateTime(message.createdAt)}</span>
              </div>
            </div>
          </Panel>

          <MessageEditor
            id={message.id}
            status={message.status === "NEW" ? "READ" : message.status}
            reply={message.reply}
          />
        </div>
      </div>
    </>
  );
}
