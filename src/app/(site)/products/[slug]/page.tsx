import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ArrowLeft, MessageCircle } from "lucide-react";

export const dynamic = "force-dynamic";

async function getProduct(slug: string) {
  return prisma.product.findUnique({ where: { slug } });
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.name} | Rental Photocopier Service in Pakistan`,
    description: product.description.slice(0, 155),
  };
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  const specLines = (product.specs || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const relatedProducts = await prisma.product.findMany({
    where: { category: product.category, NOT: { id: product.id } },
    take: 3,
  });

  return (
    <section className="section">
      <div className="container mx-auto">
        <Link href="/products" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-primary-600">
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Link>

        <div className="grid gap-10 md:grid-cols-2">
          {/* Full, uncropped product image */}
          <div className="relative flex h-80 w-full items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-6 md:h-[480px]">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              unoptimized
              className="object-contain p-6"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {!product.inStock && (
              <div className="absolute left-4 top-4">
                <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">Currently Unavailable</span>
              </div>
            )}
          </div>

          <div>
            <Badge className="mb-4">{product.category}</Badge>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">{product.name}</h1>
            <p className="mt-4 text-slate-600">{product.description}</p>

            <p className="mt-6 text-3xl font-bold text-primary-700">
              Rs. {product.price.toLocaleString("en-PK")}
              <span className="text-base font-normal text-slate-500"> {product.priceLabel}</span>
            </p>

            {specLines.length > 0 && (
              <div className="mt-8">
                <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">Specifications</h2>
                <ul className="space-y-2">
                  {specLines.map((spec, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" />
                      {spec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Link href={`/contact?product=${encodeURIComponent(product.name)}`}>
              <Button size="lg" className="mt-8 w-full sm:w-auto">
                <MessageCircle className="h-4 w-4" /> Send Inquiry
              </Button>
            </Link>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="mb-6 text-2xl font-bold text-slate-900">More in {product.category}</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {relatedProducts.map((p) => (
                <Link key={p.id} href={`/products/${p.slug}`} className="group rounded-xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-premium">
                  <div className="relative mb-3 h-32 w-full bg-slate-50">
                    <Image src={p.imageUrl} alt={p.name} fill unoptimized className="object-contain p-2" />
                  </div>
                  <p className="text-sm font-semibold text-slate-900 group-hover:text-primary-600">{p.name}</p>
                  <p className="text-xs text-slate-500">Rs. {p.price.toLocaleString("en-PK")} {p.priceLabel}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
