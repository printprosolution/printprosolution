"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useFormState, useFormStatus } from "react-dom";
import { resendVerificationEmail, type AuthFormState } from "@/actions/auth-user";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2 } from "lucide-react";

const initialResendState: AuthFormState = { success: false };

function ResendButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="text-xs font-semibold text-primary-600 hover:underline disabled:opacity-50">
      {pending ? "Sending..." : "Resend Verification Email"}
    </button>
  );
}

export function UserLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);

  const [resendState, resendAction] = useFormState(resendVerificationEmail, initialResendState);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setShowResend(false);
    setLoading(true);

    const result = await signIn("user-login", { email, password, redirect: false });

    setLoading(false);

    if (result?.error) {
      setError(result.error);
      if (result.error === "Please verify your email first.") {
        setShowResend(true);
      }
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="flex items-center gap-2 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>

      {showResend && (
        <form action={resendAction} className="rounded-md bg-slate-50 p-4">
          <input type="hidden" name="email" value={email} />
          {resendState.success && (
            <div className="mb-2 flex items-center gap-2 text-xs text-green-700">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
              If that account exists, a new verification email has been sent.
            </div>
          )}
          {resendState.error && (
            <div className="mb-2 flex items-center gap-2 text-xs text-red-700">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              {resendState.error}
            </div>
          )}
          <p className="mb-2 text-xs text-slate-600">Didn&apos;t get the email?</p>
          <ResendButton />
        </form>
      )}
    </div>
  );
}
