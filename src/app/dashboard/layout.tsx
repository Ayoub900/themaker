import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/dashboard/shell";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Workshop",
  robots: { index: false, follow: false },
};

/** Never cache anything behind the login. */
export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Middleware already redirected anonymous navigations; this is the real
  // boundary, and it also gives us the user for the sidebar.
  const session = await getSession();
  if (!session) redirect("/login");

  const [newMessages, newOrders] = await Promise.all([
    prisma.message.count({ where: { status: "NEW" } }),
    prisma.order.count({ where: { status: "PENDING" } }),
  ]);

  return (
    <DashboardShell
      name={session.name}
      email={session.email}
      newMessages={newMessages}
      newOrders={newOrders}
    >
      {children}
    </DashboardShell>
  );
}
