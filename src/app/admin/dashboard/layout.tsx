import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminSessionProvider } from "@/components/admin/session-provider";
import { prisma } from "@/lib/prisma";

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
      <div className="flex min-h-screen bg-slate-50">
        <AdminSidebar companyName={content.companyName} logoUrl={content.logoUrl} />
        <div className="flex-1 overflow-y-auto">
          <main className="mx-auto max-w-6xl p-8">{children}</main>
        </div>
      </div>
    </AdminSessionProvider>
  );
}
