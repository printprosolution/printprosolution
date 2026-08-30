import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product-card";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await prisma.siteContent.findUnique({ where: { id: "main" } });
  return {
    title: `Products | ${content?.companyName ?? "PrintPro Solutions Lahore"}`,
    description:
      "Browse Ricoh, Xerox and Canon photocopiers and printers available for monthly rental in Lahore, plus toner and consumables.",
  };
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const activeCategory = searchParams.category;

  const [products, categoriesRaw] = await Promise.all([
    prisma.product.findMany({
      where: activeCategory ? { category: activeCategory } : {},
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.findMany({ select: { category: true }, distinct: ["category"] }),
  ]);

  const categories = categoriesRaw.map((c) => c.category);

  return (
    <section className="section">
      <div className="container mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl">Our Products</h1>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Photocopiers, printers, toner and accessories available for rent or purchase across Lahore and Pakistan.
          </p>
        </div>

        <div className="mb-10 flex flex-wrap justify-center gap-2">
          <Link
            href="/products"
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-semibold",
              !activeCategory
                ? "border-primary-600 bg-primary-600 text-white"
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
            )}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/products?category=${encodeURIComponent(cat)}`}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-semibold",
                activeCategory === cat
                  ? "border-primary-600 bg-primary-600 text-white"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              )}
            >
              {cat}
            </Link>
          ))}
        </div>

        {products.length === 0 ? (
          <p className="text-center text-slate-500">No products found in this category yet.</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
