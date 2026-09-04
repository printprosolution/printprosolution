"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createVerificationToken, verifyUrlFor } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/resend";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export interface AuthFormState {
  success: boolean;
  error?: string;
}

/** Public signup — creates the user as unverified and emails a link. */
export async function signUpUser(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!name || !email || !password) {
    return { success: false, error: "Name, email and password are all required." };
  }
  if (password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { success: false, error: "An account with this email already exists. Please login instead." };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: { name, email, passwordHash },
  });

  const token = await createVerificationToken(email);

  try {
    await sendVerificationEmail(email, name, verifyUrlFor(token));
  } catch (err) {
    // The account still exists — they can use "Resend Verification Email"
    // on the login page once the email service is working.
    console.error("Failed to send verification email:", err);
    return {
      success: true,
      error: "Account created, but the verification email couldn't be sent right now. Use 'Resend Verification Email' on the login page to try again.",
    };
  }

  return { success: true };
}

/** Called from the login page's "Resend Verification Email" link. */
export async function resendVerificationEmail(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();

  if (!email) {
    return { success: false, error: "Enter your email address first." };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // Don't reveal whether the account exists.
    return { success: true };
  }
  if (user.emailVerified) {
    return { success: false, error: "This email is already verified — you can login." };
  }

  const token = await createVerificationToken(email);
  await sendVerificationEmail(email, user.name, verifyUrlFor(token));

  return { success: true };
}

/**
 * Presence heartbeat: called periodically by <PresenceHeartbeat /> while a
 * user is browsing the site, so the admin's "Online Users" list is
 * accurate. Also doubles as the enforcement point for Force Logout / Ban —
 * it reports back whether the caller should be signed out.
 */
export async function heartbeatAndCheckStatus(): Promise<{
  shouldSignOut: boolean;
  reason?: string;
}> {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!session || !email || (session.user as { role?: string })?.role !== "user") {
    return { shouldSignOut: false };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { shouldSignOut: true, reason: "Your account no longer exists." };
  }
  if (user.banned) {
    return { shouldSignOut: true, reason: "Your account has been banned." };
  }

  const tokenIssuedAt = (session as unknown as { issuedAt?: number }).issuedAt;
  if (user.forceLogoutAt && tokenIssuedAt && user.forceLogoutAt.getTime() > tokenIssuedAt) {
    return { shouldSignOut: true, reason: "You have been logged out by an administrator." };
  }

  await prisma.user.update({
    where: { email },
    data: { lastActiveAt: new Date() },
  });

  return { shouldSignOut: false };
}
