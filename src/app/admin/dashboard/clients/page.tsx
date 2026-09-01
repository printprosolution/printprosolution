import { prisma } from "@/lib/prisma";
import { ClientLogoForm } from "@/components/admin/client-logo-form";
import { ClientLogoTable } from "@/components/admin/client-logo-table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AdminClientsPage() {
  const logos = await prisma.clientLogo.findMany({ orderBy: { order: "asc" } });
  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-slate-900">Client Logos</h1>
      <p className="mb-6 text-sm text-slate-500">Shown as a "Trusted By" strip on the homepage.</p>
      <div className="grid gap-8 lg:grid-cols-2">
        <Card><CardHeader><CardTitle>Add Client</CardTitle></CardHeader><CardContent><ClientLogoForm /></CardContent></Card>
        <div><ClientLogoTable logos={logos} /></div>
      </div>
    </div>
  );
}
