"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export interface ContactFormState {
  success: boolean;
  error?: string;
}

/**
 * Called from the public /contact form. Anyone can submit this — no auth
 * required — it just writes a ContactMessage row.
 */
export async function submitContactMessage(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const type = String(formData.get("type") || "General Inquiry").trim();
  const message = String(formData.get("message") || "").trim();

  if (!name || !email || !message) {
    return { success: false, error: "Name, email and message are required." };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  await prisma.contactMessage.create({
    data: { name, email, phone: phone || null, type, message },
  });

  // So the admin dashboard's messages table shows the new submission
  // immediately without needing a manual refresh/redeploy.
  revalidatePath("/admin/dashboard/messages");

  return { success: true };
}

/** Admin-only: mark a message as read. */
export async function markMessageRead(id: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  await prisma.contactMessage.update({ where: { id }, data: { read: true } });
  revalidatePath("/admin/dashboard/messages");
}

/** Admin-only: delete a message. */
export async function deleteMessage(id: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  await prisma.contactMessage.delete({ where: { id } });
  revalidatePath("/admin/dashboard/messages");
}
