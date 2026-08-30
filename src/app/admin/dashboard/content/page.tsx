import { prisma } from "@/lib/prisma";
import { ContentForm } from "@/components/admin/content-form";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const content = await prisma.siteContent.upsert({
    where: { id: "main" },
    update: {},
    create: { id: "main" },
  });

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-slate-900">Website Content</h1>
      <p className="mb-6 text-sm text-slate-500">
        Edit the homepage, about page and SEO copy. Changes go live on the site immediately.
      </p>
      <ContentForm content={content} />
    </div>
  );
}
