import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PresenceHeartbeat } from "@/components/presence-heartbeat";

// Always fetch fresh SiteContent so admin dashboard edits (hero text,
// contact info, etc.) reflect on the public site immediately.
export const dynamic = "force-dynamic";

async function getSiteContent() {
  return prisma.siteContent.upsert({
    where: { id: "main" },
    update: {},
    create: { id: "main" },
  });
}

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = await getSiteContent();
  const session = await getServerSession(authOptions);
  const isRegularUser = (session?.user as { role?: string } | undefined)?.role === "user";
  const userName = isRegularUser ? session?.user?.name : null;

  return (
    <>
      {isRegularUser && <PresenceHeartbeat />}
      <Navbar contactPhone={content.contactPhone} companyName={content.companyName} logoUrl={content.logoUrl} userName={userName} />
      <main className="min-h-screen">{children}</main>
      <Footer
        companyName={content.companyName}
        logoUrl={content.logoUrl}
        contactName={content.contactName}
        contactPhone={content.contactPhone}
        contactEmail={content.contactEmail}
        contactAddress={content.contactAddress}
      />
    </>
  );
}
