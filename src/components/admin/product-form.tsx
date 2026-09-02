"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createProduct, updateProduct, type ProductFormState } from "@/actions/products";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/admin/image-uploader";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import type { Product } from "@prisma/client";
import { useState, useEffect } from "react";

const initialState: ProductFormState = { success: false };

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : label}
    </Button>
  );
}

const CATEGORIES = ["Photocopier", "Printer", "Toner", "Accessory"];

export function ProductForm({
  product,
  onSuccess,
}: {
  product?: Product;
  onSuccess?: () => void;
}) {
  const action = product ? updateProduct : createProduct;
  const [state, formAction] = useFormState(action, initialState);
  const [category, setCategory] = useState(product?.category || "Photocopier");

  // Fire onSuccess once the action reports success (e.g. to close a modal).
  useEffect(() => {
    if (state.success && onSuccess) onSuccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success]);

  return (
    <form action={formAction} className="space-y-5">
      {product && <input type="hidden" name="id" value={product.id} />}

      {state.error && (
        <div className="flex items-center gap-2 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.error}
        </div>
      )}
      {state.success && (
        <div className="flex items-center gap-2 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Saved successfully.
        </div>
      )}

      <div>
        <Label htmlFor="name">Product Name</Label>
        <Input id="name" name="name" defaultValue={product?.name} required />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="price">Price (PKR)</Label>
          <Input id="price" name="price" type="number" min="0" step="1" defaultValue={product?.price} required />
        </div>
        <div>
          <Label htmlFor="priceLabel">Price Label</Label>
          <Input id="priceLabel" name="priceLabel" placeholder="/month" defaultValue={product?.priceLabel || "/month"} />
        </div>
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <select
          id="category"
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="flex h-11 w-full rounded-md border border-input bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={product?.description} required />
      </div>

      <div>
        <Label htmlFor="specs">Specifications (one per line, optional)</Label>
        <Textarea id="specs" name="specs" rows={5} placeholder={"35 pages per minute\nDuplex printing\nA3 paper support\nWi-Fi connectivity"} defaultValue={product?.specs || ""} />
        <p className="mt-1 text-xs text-slate-500">Each line shows as a bullet point on the product page.</p>
      </div>

      <ImageUploader name="imageUrl" label="Product Image" defaultValue={product?.imageUrl} required />

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" name="featured" defaultChecked={product?.featured} className="h-4 w-4 rounded border-slate-300" />
          Show on homepage (featured)
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" name="inStock" defaultChecked={product?.inStock ?? true} className="h-4 w-4 rounded border-slate-300" />
          In stock / available
        </label>
      </div>

      <SubmitButton label={product ? "Update Product" : "Add Product"} />
    </form>
  );
}
