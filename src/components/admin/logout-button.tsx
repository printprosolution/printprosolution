"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/admin" })}
      className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-red-950/50"
    >
      <LogOut className="h-4 w-4" />
      Logout
    </button>
  );
}
