"use client";

import { useFormState, useFormStatus } from "react-dom";
import { signUpUser, type AuthFormState } from "@/actions/auth-user";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Mail } from "lucide-react";

const initialState: AuthFormState = { success: false };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? "Creating Account..." : "Sign Up"}
    </Button>
  );
}

export function SignupForm() {
  const [state, formAction] = useFormState(signUpUser, initialState);

  if (state.success && !state.error) {
    return (
      <div className="rounded-md bg-green-50 p-6 text-center">
        <Mail className="mx-auto mb-3 h-10 w-10 text-green-600" />
        <p className="font-semibold text-green-800">Check your email</p>
        <p className="mt-1 text-sm text-green-700">
          We&apos;ve sent a verification link to your email address. Please verify
          your email before logging in.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      {state.error && (
        <div className="flex items-center gap-2 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.error}
        </div>
      )}
      {state.success && (
        <div className="flex items-center gap-2 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Account created.
        </div>
      )}

      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" name="name" required />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" minLength={6} required />
        <p className="mt-1 text-xs text-slate-500">At least 6 characters.</p>
      </div>

      <SubmitButton />
    </form>
  );
}
