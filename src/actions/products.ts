"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils";
import { unlink } from "fs/promises";
import path from "path";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized: admin login required");
}

export interface ProductFormState {
  success: boolean;
  error?: string;
}

/** Create a product. imageUrl must already be uploaded via /api/upload. */
export async function createProduct(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdmin();

  const name = String(formData.get("name") || "").trim();
  const price = Number(formData.get("price"));
  const priceLabel = String(formData.get("priceLabel") || "/month").trim();
  const category = String(formData.get("category") || "Photocopier").trim();
  const description = String(formData.get("description") || "").trim();
  const specs = String(formData.get("specs") || "").trim() || null;
  const imageUrl = String(formData.get("imageUrl") || "").trim();
  const featured = formData.get("featured") === "on";
  const inStock = formData.get("inStock") === "on";

  if (!name || !price || !description || !imageUrl) {
    return { success: false, error: "Name, price, description and image are all required." };
  }

  let slug = slugify(name);
  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Date.now()}`;
  }

  await prisma.product.create({
    data: { name, slug, price, priceLabel, category, description, specs, imageUrl, featured, inStock },
  });

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/dashboard/products");

  return { success: true };
}

/** Update an existing product. */
export async function updateProduct(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdmin();

  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  const price = Number(formData.get("price"));
  const priceLabel = String(formData.get("priceLabel") || "/month").trim();
  const category = String(formData.get("category") || "Photocopier").trim();
  const description = String(formData.get("description") || "").trim();
  const specs = String(formData.get("specs") || "").trim() || null;
  const imageUrl = String(formData.get("imageUrl") || "").trim();
  const featured = formData.get("featured") === "on";
  const inStock = formData.get("inStock") === "on";

  if (!id || !name || !price || !description || !imageUrl) {
    return { success: false, error: "All fields are required." };
  }

  await prisma.product.update({
    where: { id },
    data: { name, price, priceLabel, category, description, specs, imageUrl, featured, inStock },
  });

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/dashboard/products");

  return { success: true };
}

/** Delete a product and, if the image was a local upload, remove the file too. */
export async function deleteProduct(id: string) {
  await requireAdmin();

  const product = await prisma.product.findUnique({ where: { id } });
  if (product?.imageUrl?.startsWith("/uploads/")) {
    try {
      await unlink(path.join(process.cwd(), "public", product.imageUrl));
    } catch {
      // File may already be missing — safe to ignore.
    }
  }

  await prisma.product.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/dashboard/products");
}
