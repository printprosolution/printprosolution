"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized: admin login required");
}

export interface TestimonialFormState {
  success: boolean;
  error?: string;
}

export async function createTestimonial(
  _prevState: TestimonialFormState,
  formData: FormData
): Promise<TestimonialFormState> {
  await requireAdmin();

  const name = String(formData.get("name") || "").trim();
  const company = String(formData.get("company") || "").trim();
  const message = String(formData.get("message") || "").trim();
  const rating = Number(formData.get("rating") || 5);
  const imageUrl = String(formData.get("imageUrl") || "").trim() || null;

  if (!name || !company || !message) {
    return { success: false, error: "Name, company and message are required." };
  }

  await prisma.testimonial.create({
    data: { name, company, message, rating, imageUrl },
  });

  revalidatePath("/");
  revalidatePath("/admin/dashboard/testimonials");

  return { success: true };
}

export async function deleteTestimonial(id: string) {
  await requireAdmin();
  await prisma.testimonial.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/dashboard/testimonials");
}
