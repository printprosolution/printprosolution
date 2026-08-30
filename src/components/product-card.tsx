import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Product } from "@prisma/client";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-premium">
      <div className="relative h-56 w-full bg-slate-100">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover"
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
          <Link href="/contact">
            <Button size="sm" variant="outline">Enquire</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
