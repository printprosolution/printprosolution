import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { LoginForm } from "@/components/admin/login-form";

// This is the ONE public entry point into the admin area. It is reached
// either by typing /admin directly or via the "#admin" hash trick handled
// by <AdminHashRedirect /> in the root layout. If a valid session already
// exists (the admin logged in earlier and the 30-day cookie is still
// valid) we skip straight to the dashboard — no repeated password prompts.
export default async function AdminGatePage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/admin/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary-600 text-2xl font-black text-white">
            P
          </div>
          <h1 className="text-xl font-bold text-white">PrintPro Admin</h1>
          <p className="mt-1 text-sm text-slate-400">Restricted area — authorised access only</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
