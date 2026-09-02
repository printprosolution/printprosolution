import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@prisma/client";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`}>
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-premium">
        <div className="relative flex h-56 w-full items-center justify-center bg-slate-50 p-4">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            unoptimized
            className="object-contain p-4"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {!product.inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-sm font-bold text-white">
              Currently Unavailable
            </div>
          )}
        </div>
        <CardContent className="pt-5">
          <Badge className="mb-3">{product.category}</Badge>
          <h3 className="mb-1 text-base">{product.name}</h3>
          <p className="mb-4 line-clamp-3 text-sm text-slate-600">{product.description}</p>
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-primary-700">
              Rs. {product.price.toLocaleString("en-PK")}
              <span className="text-sm font-normal text-slate-500">{product.priceLabel}</span>
            </p>
            <span className="text-sm font-semibold text-primary-600">View Details →</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
