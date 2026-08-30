"use client";

import { useState } from "react";
import Image from "next/image";
import type { Product } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/admin/modal";
import { ProductForm } from "@/components/admin/product-form";
import { deleteProduct } from "@/actions/products";
import { Plus, Pencil, Trash2 } from "lucide-react";

export function ProductTable({ products }: { products: Product[] }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    setDeletingId(id);
    await deleteProduct(id);
    setDeletingId(null);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Products</h1>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  No products yet. Click &quot;Add Product&quot; to create your first one.
                </td>
              </tr>
            )}
            {products.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3">
                  <div className="relative h-12 w-12 overflow-hidden rounded-md bg-slate-100">
                    <Image src={p.imageUrl} alt={p.name} fill className="object-cover" />
                  </div>
                </td>
                <td className="px-4 py-3 font-medium text-slate-900">
                  {p.name}
                  {p.featured && <Badge className="ml-2 text-[10px]">Featured</Badge>}
                </td>
                <td className="px-4 py-3 text-slate-600">{p.category}</td>
                <td className="px-4 py-3 text-slate-600">
                  Rs. {p.price.toLocaleString("en-PK")} {p.priceLabel}
                </td>
                <td className="px-4 py-3">
                  <span className={p.inStock ? "text-green-600" : "text-red-600"}>
                    {p.inStock ? "In Stock" : "Unavailable"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditingProduct(p)}
                      className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-primary-600"
                      aria-label="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={deletingId === p.id}
                      className="rounded-md p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <Modal title="Add Product" onClose={() => setShowAddModal(false)}>
          <ProductForm onSuccess={() => setShowAddModal(false)} />
        </Modal>
      )}

      {editingProduct && (
        <Modal title="Edit Product" onClose={() => setEditingProduct(null)}>
          <ProductForm product={editingProduct} onSuccess={() => setEditingProduct(null)} />
        </Modal>
      )}
    </div>
  );
}
