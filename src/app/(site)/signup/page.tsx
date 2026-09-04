import type { Metadata } from "next";
import Link from "next/link";
import { SignupForm } from "@/components/signup-form";

export const metadata: Metadata = { title: "Sign Up" };

export default function SignupPage() {
  return (
    <section className="section flex justify-center">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl">Create an Account</h1>
          <p className="mt-2 text-sm text-slate-500">Sign up to get started.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <SignupForm />
        </div>
        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}
