import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";

export const dynamic = "force-dynamic";

async function verifyToken(token: string | undefined) {
  if (!token) return { ok: false, message: "Missing verification token." };

  const record = await prisma.verificationToken.findUnique({ where: { token } });
  if (!record) return { ok: false, message: "This verification link is invalid or has already been used." };

  if (record.expiresAt < new Date()) {
    await prisma.verificationToken.delete({ where: { token } });
    return { ok: false, message: "This verification link has expired. Please request a new one from the login page." };
  }

  await prisma.user.update({
    where: { email: record.email },
    data: { emailVerified: true },
  });
  await prisma.verificationToken.delete({ where: { token } });

  return { ok: true, message: "Your email has been verified. You can now login." };
}

export default async function VerifyPage({ searchParams }: { searchParams: { token?: string } }) {
  const result = await verifyToken(searchParams.token);

  return (
    <section className="section flex justify-center">
      <div className="w-full max-w-md text-center">
        {result.ok ? (
          <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-green-600" />
        ) : (
          <XCircle className="mx-auto mb-4 h-14 w-14 text-red-500" />
        )}
        <h1 className="text-2xl">{result.ok ? "Email Verified" : "Verification Failed"}</h1>
        <p className="mt-3 text-slate-600">{result.message}</p>
        <Link href="/login">
          <Button size="lg" className="mt-8">Go to Login</Button>
        </Link>
      </div>
    </section>
  );
}
