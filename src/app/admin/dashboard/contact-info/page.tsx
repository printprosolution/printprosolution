import { prisma } from "@/lib/prisma";
import { ContactInfoForm } from "@/components/admin/contact-info-form";

export const dynamic = "force-dynamic";

export default async function AdminContactInfoPage() {
  const content = await prisma.siteContent.upsert({
    where: { id: "main" },
    update: {},
    create: { id: "main" },
  });

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-slate-900">Contact Info</h1>
      <p className="mb-6 text-sm text-slate-500">
        Shown in the site footer and on the /contact page.
      </p>
      <ContactInfoForm content={content} />
    </div>
  );
}
