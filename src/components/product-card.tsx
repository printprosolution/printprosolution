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
        </div>
        <CardContent className="pt-5">
          <div className="mb-3 flex items-center justify-between">
            <Badge>{product.category}</Badge>
            <span className={`flex items-center gap-1.5 text-xs font-semibold ${product.inStock ? "text-green-600" : "text-red-600"}`}>
              <span className={`h-2 w-2 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-500"}`} />
              {product.inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>
          <h3 className="mb-1 text-base">{product.name}</h3>
          <p className="mb-4 line-clamp-3 text-sm text-slate-600">{product.description}</p>
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-primary-700">
              {product.price != null
                ? <>Rs. {product.price.toLocaleString("en-PK")}<span className="text-sm font-normal text-slate-500">{product.priceLabel}</span></>
                : <span className="text-sm font-semibold text-slate-500">Contact for Price</span>}
            </p>
            <span className="text-sm font-semibold text-primary-600">View Details →</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
