import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";

/** Creates a fresh 24-hour verification token for the given email,
 * deleting any older unused tokens for that email first. */
export async function createVerificationToken(email: string) {
  await prisma.verificationToken.deleteMany({ where: { email } });

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await prisma.verificationToken.create({
    data: { email, token, expiresAt },
  });

  return token;
}

export function verifyUrlFor(token: string) {
  const base = process.env.NEXTAUTH_URL || "http://localhost:3000";
  return `${base}/verify?token=${token}`;
}
