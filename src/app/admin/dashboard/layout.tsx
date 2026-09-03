import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminSessionProvider } from "@/components/admin/session-provider";

// Server-side guard (middleware.ts also protects this route, this is a
// belt-and-braces second check so the layout never even renders content
// for a logged-out visitor if middleware is ever bypassed/misconfigured).
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin");
  }

  const content = await prisma.siteContent.upsert({
    where: { id: "main" },
    update: {},
    create: { id: "main" },
  });

  return (
    <AdminSessionProvider>
      <AdminShell companyName={content.companyName} logoUrl={content.logoUrl}>
        {children}
      </AdminShell>
    </AdminSessionProvider>
  );
}
