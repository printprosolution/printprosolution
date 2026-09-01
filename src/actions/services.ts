"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized: admin login required");
}

export interface ServiceFormState {
  success: boolean;
  error?: string;
}

export async function createService(
  _prevState: ServiceFormState,
  formData: FormData
): Promise<ServiceFormState> {
  await requireAdmin();

  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const imageUrl = String(formData.get("imageUrl") || "").trim();
  const order = Number(formData.get("order") || 0);

  if (!title || !description || !imageUrl) {
    return { success: false, error: "Title, description and an image are all required." };
  }

  await prisma.service.create({ data: { title, description, imageUrl, order } });

  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath("/admin/dashboard/services");

  return { success: true };
}

export async function updateService(
  _prevState: ServiceFormState,
  formData: FormData
): Promise<ServiceFormState> {
  await requireAdmin();

  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const imageUrl = String(formData.get("imageUrl") || "").trim();
  const order = Number(formData.get("order") || 0);

  if (!id || !title || !description || !imageUrl) {
    return { success: false, error: "Title, description and an image are all required." };
  }

  await prisma.service.update({ where: { id }, data: { title, description, imageUrl, order } });

  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath("/admin/dashboard/services");

  return { success: true };
}

export async function deleteService(id: string) {
  await requireAdmin();
  await prisma.service.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath("/admin/dashboard/services");
}
