"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized: admin login required");
}

export interface ClientLogoFormState {
  success: boolean;
  error?: string;
}

export async function createClientLogo(
  _prevState: ClientLogoFormState,
  formData: FormData
): Promise<ClientLogoFormState> {
  await requireAdmin();

  const name = String(formData.get("name") || "").trim();
  const logoUrl = String(formData.get("logoUrl") || "").trim();
  const order = Number(formData.get("order") || 0);

  if (!name || !logoUrl) {
    return { success: false, error: "Client name and a logo image are both required." };
  }

  await prisma.clientLogo.create({ data: { name, logoUrl, order } });

  revalidatePath("/");
  revalidatePath("/admin/dashboard/clients");

  return { success: true };
}

export async function deleteClientLogo(id: string) {
  await requireAdmin();
  await prisma.clientLogo.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/dashboard/clients");
}
