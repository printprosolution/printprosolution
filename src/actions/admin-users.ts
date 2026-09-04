"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string })?.role !== "admin") {
    throw new Error("Unauthorized: admin login required");
  }
}

/** Force Logout / Kick — ends their current session within ~15 seconds
 * (the next presence heartbeat tick) without banning them. */
export async function kickUser(id: string) {
  await requireAdmin();
  await prisma.user.update({
    where: { id },
    data: { forceLogoutAt: new Date() },
  });
  revalidatePath("/admin/dashboard/users");
}

/** Ban — blocks future logins AND ends any current session. */
export async function banUser(id: string) {
  await requireAdmin();
  await prisma.user.update({
    where: { id },
    data: { banned: true, forceLogoutAt: new Date() },
  });
  revalidatePath("/admin/dashboard/users");
}

export async function unbanUser(id: string) {
  await requireAdmin();
  await prisma.user.update({
    where: { id },
    data: { banned: false },
  });
  revalidatePath("/admin/dashboard/users");
}
