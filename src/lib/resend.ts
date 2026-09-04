import { Resend } from "resend";

// Lazily created so the app doesn't crash at import-time if the env var
// isn't set yet (e.g. during initial setup before RESEND_API_KEY exists).
export function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY is not set. Add it in your Vercel Environment Variables."
    );
  }
  return new Resend(apiKey);
}

// Resend's shared test sender — works immediately with no domain setup.
// You can switch this to an address on your own verified domain later
// (e.g. "noreply@printprolahore.com") once you add + verify that domain
// in the Resend dashboard.
export const EMAIL_FROM = process.env.RESEND_FROM_EMAIL || "PrintPro Solutions <onboarding@resend.dev>";

export async function sendVerificationEmail(to: string, name: string, verifyUrl: string) {
  const resend = getResend();

  await resend.emails.send({
    from: EMAIL_FROM,
    to,
    subject: "Verify your email — PrintPro Solutions",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #1B2A56;">Verify Your Email</h2>
        <p>Hi ${name},</p>
        <p>Thanks for signing up. Please confirm your email address by clicking the button below.</p>
        <p style="margin: 32px 0;">
          <a href="${verifyUrl}" style="background: #1B2A56; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
            Verify Email
          </a>
        </p>
        <p style="color: #64748B; font-size: 13px;">This link expires in 24 hours. If you didn't create this account, you can ignore this email.</p>
      </div>
    `,
  });
}
