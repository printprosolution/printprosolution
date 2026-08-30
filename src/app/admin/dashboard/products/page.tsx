import { prisma } from "@/lib/prisma";
import { ProductTable } from "@/components/admin/product-table";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return <ProductTable products={products} />;
}
