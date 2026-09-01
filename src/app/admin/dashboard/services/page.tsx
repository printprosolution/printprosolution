import { prisma } from "@/lib/prisma";
import { ServiceTable } from "@/components/admin/service-table";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });
  return <ServiceTable services={services} />;
}
