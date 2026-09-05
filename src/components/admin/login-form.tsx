"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertCircle, Lock } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    e.stopPropagation();
    setError(null);
    setLoading(true);

    try {
      const result = await signIn("admin-login", {
        username,
        password,
        redirect: false,
      });

      setLoading(false);

      if (result?.error) {
        setError("Invalid username or password.");
        return;
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setLoading(false);
      setError("Something went wrong contacting the server. Please check your internet connection and try again.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl"
    >
      {error && (
        <div className="flex items-center gap-2 rounded-md bg-red-950 px-4 py-3 text-sm text-red-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
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
      <Button type="submit" className="w-full" disabled={loading}>
        <Lock className="h-4 w-4" />
        {loading ? "Signing in..." : "Login"}
      </Button>
    </form>
  );
}
