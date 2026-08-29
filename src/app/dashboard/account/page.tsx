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
      <PageHeading title="Account" subtitle="Your sign-in and how this dashboard behaves." />

      <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-6 lg:gap-8">
          <Panel title="You">
            <dl className="flex flex-col gap-4 p-4 sm:p-6 text-[14px]">
              <div className="flex justify-between gap-6">
                <dt className="text-faint">Name</dt>
                <dd>{user?.name}</dd>
              </div>
              <div className="flex justify-between gap-6">
                <dt className="text-faint">Email</dt>
                <dd>{user?.email}</dd>
              </div>
              <div className="flex justify-between gap-6">
                <dt className="text-faint">Role</dt>
                <dd>{user?.role.toLowerCase()}</dd>
              </div>
              <div className="flex justify-between gap-6">
                <dt className="text-faint">Last signed in</dt>
                <dd>{formatDateTime(user?.lastLoginAt)}</dd>
              </div>
              <div className="flex justify-between gap-6">
                <dt className="text-faint">Account created</dt>
                <dd>{formatDateTime(user?.createdAt)}</dd>
              </div>
            </dl>
          </Panel>

          <Panel title="How the session works">
            <div className="flex flex-col gap-3 p-4 sm:p-6 text-[13px] leading-relaxed text-muted">
              <p>
                Signing in sets one httpOnly cookie holding a signed token. It lasts{" "}
                {dashboard.sessionMaxAge / 3600} hours and carries nothing but your account
                id, name and role — no password, no personal data.
              </p>
              <p>
                After {dashboard.loginMaxAttempts} failed attempts, that email and network
                address are locked out for {dashboard.loginLockMinutes} minutes. Wrong
                emails and wrong passwords take the same time to fail, so the login cannot
                be used to find out which accounts exist.
              </p>
              <p>
                Signing out clears the cookie everywhere. There is no password reset by
                email; if you are locked out, reset it with the seed script.
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
