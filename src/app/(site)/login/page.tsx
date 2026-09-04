import type { Metadata } from "next";
import Link from "next/link";
import { UserLoginForm } from "@/components/user-login-form";

export const metadata: Metadata = { title: "Login" };

export default function LoginPage() {
  return (
    <section className="section flex justify-center">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl">Login</h1>
          <p className="mt-2 text-sm text-slate-500">Welcome back.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <UserLoginForm />
        </div>
        <p className="mt-6 text-center text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold text-primary-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </section>
  );
}
