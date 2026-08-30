import type { Metadata } from "next";
import "./globals.css";
import { prisma } from "@/lib/prisma";
import { AdminHashRedirect } from "@/components/admin-hash-redirect";

// The root layout wraps BOTH the public (site) pages and the /admin
// section. It intentionally does NOT render the Navbar/Footer — those
// live in src/app/(site)/layout.tsx — so the admin dashboard gets a
// clean, distraction-free layout of its own.

export async function generateMetadata(): Promise<Metadata> {
  // Ensure a content row exists even on a brand-new, unseeded database.
  const content = await prisma.siteContent.upsert({
    where: { id: "main" },
    update: {},
    create: { id: "main" },
  });

  return {
    title: content.seoTitle,
    description: content.seoDescription,
    keywords: content.seoKeywords,
    metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
    openGraph: {
      title: content.seoTitle,
      description: content.seoDescription,
      siteName: content.companyName,
      images: [content.heroImageUrl],
      locale: "en_PK",
      type: "website",
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Watches for printprolahore.com/#admin on every page and
            redirects to the real, server-protected /admin route. */}
        <AdminHashRedirect />
        {children}
      </body>
    </html>
  );
}
