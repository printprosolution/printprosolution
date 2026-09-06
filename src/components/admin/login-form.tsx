"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertCircle, Lock, Loader2 } from "lucide-react";

interface LoginFormProps {
  hasError?: boolean;
}

/**
 * The actual login submission is a PLAIN native HTML form POST straight to
 * NextAuth's own callback endpoint (/api/auth/callback/admin-login) — no
 * onSubmit handler, no client-side signIn() call. This is deliberate: it
 * works even if something in the page's React hydration misbehaves, since
 * the browser handles the POST natively.
 *
 * The only JavaScript this component needs is a simple fetch on mount to
 * grab a valid CSRF token (a real browser-originated request, so the
 * browser stores the resulting cookie correctly on its own — no manual
 * cookie-forwarding needed, unlike fetching it server-side would require).
 */
export function LoginForm({ hasError }: LoginFormProps) {
  const [csrfToken, setCsrfToken] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch("/api/auth/csrf")
      .then((res) => res.json())
      .then((data) => {
        setCsrfToken(data.csrfToken || "");
        setReady(true);
      })
      .catch(() => setReady(true));
  }, []);

  return (
    <form
      method="POST"
      action="/api/auth/callback/admin-login"
      className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl"
    >
      <input type="hidden" name="csrfToken" value={csrfToken} />
      <input type="hidden" name="callbackUrl" value="/admin/dashboard" />

      {hasError && (
        <div className="flex items-center gap-2 rounded-md bg-red-950 px-4 py-3 text-sm text-red-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          Invalid username or password.
        </div>
      )}

      <div>
        <Label htmlFor="username" className="text-slate-300">Username</Label>
        <Input
          id="username"
          name="username"
          className="border-slate-700 bg-slate-800 text-white"
          autoComplete="username"
          required
        />
      </div>
      <div>
        <Label htmlFor="password" className="text-slate-300">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          className="border-slate-700 bg-slate-800 text-white"
          autoComplete="current-password"
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={!ready}>
        {ready ? <Lock className="h-4 w-4" /> : <Loader2 className="h-4 w-4 animate-spin" />}
        {ready ? "Login" : "Loading..."}
      </Button>
    </form>
  );
}
