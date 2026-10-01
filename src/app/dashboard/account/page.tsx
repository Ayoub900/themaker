import { redirect } from "next/navigation";

import { PasswordForm } from "@/app/dashboard/account/password-form";
import { PageHeading, Panel } from "@/components/dashboard/ui";
import { dashboard } from "@/config/site";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/utils";

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { email: true, name: true, role: true, lastLoginAt: true, createdAt: true },
  });

  return (
    <>
      <PageHeading title="Account" subtitle="Your details and your password." />

      <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-6 lg:gap-8">
          <Panel title="Your details">
            <dl className="flex flex-col gap-4 p-4 sm:p-6 text-[16px]">
              <div className="flex justify-between gap-6">
                <dt className="text-muted">Name</dt>
                <dd>{user?.name}</dd>
              </div>
              <div className="flex justify-between gap-6">
                <dt className="text-muted">Email</dt>
                <dd>{user?.email}</dd>
              </div>
              <div className="flex justify-between gap-6">
                <dt className="text-muted">Role</dt>
                <dd>{user?.role.toLowerCase()}</dd>
              </div>
              <div className="flex justify-between gap-6">
                <dt className="text-muted">Last logged in</dt>
                <dd>{formatDateTime(user?.lastLoginAt)}</dd>
              </div>
              <div className="flex justify-between gap-6">
                <dt className="text-muted">Account created</dt>
                <dd>{formatDateTime(user?.createdAt)}</dd>
              </div>
            </dl>
          </Panel>

          <Panel title="Good to know">
            <div className="flex flex-col gap-3 p-4 sm:p-6 text-[16px] leading-relaxed text-muted">
              <p>
                You stay logged in for {dashboard.sessionMaxAge / 3600} hours. After that
                you will be asked to log in again.
              </p>
              <p>
                If the password is wrong {dashboard.loginMaxAttempts} times in a row, login
                is paused for {dashboard.loginLockMinutes} minutes. Just wait and try again.
              </p>
              <p>
                If you forget your password, ask your web developer to reset it.
              </p>
            </div>
          </Panel>
        </div>

        <div className="flex flex-col gap-6 lg:gap-8">
          <PasswordForm />
        </div>
      </div>
    </>
  );
}
