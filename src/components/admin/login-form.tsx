"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertCircle, Lock } from "lucide-react";

export function LoginForm() {
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    // Let NextAuth handle the full redirect itself (POST credentials ->
    // set session cookie -> redirect to callbackUrl on success, or back
    // to /admin?error=... on failure). This avoids the client-side race
    // condition where router.push() could fire before the session cookie
    // was actually written by the browser.
    await signIn("admin-login", {
      username,
      password,
      callbackUrl: "/admin/dashboard",
    });
    // Note: no code runs after this on success — the browser navigates
    // away. setSubmitting(false) is only reached if signIn itself throws.
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl"
    >
      {urlError && (
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
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border-slate-700 bg-slate-800 text-white"
          autoComplete="current-password"
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={submitting}>
        <Lock className="h-4 w-4" />
        {submitting ? "Signing in..." : "Login"}
      </Button>
    </form>
  );
}
