"use client";

import { useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { AdminSidebar } from "@/components/admin/sidebar";

interface AdminShellProps {
  companyName: string;
  logoUrl: string;
  children: React.ReactNode;
}

/**
 * Responsive shell for the admin dashboard.
 * - Desktop (md+): sidebar always visible on the left, exactly like before.
 * - Mobile: sidebar becomes a slide-in drawer, opened via a hamburger in a
 *   slim top bar, so the dashboard content gets full width instead of
 *   being squeezed next to a fixed 256px sidebar.
 */
export function AdminShell({ companyName, logoUrl, children }: AdminShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      {/* Mobile top bar */}
      <div className="flex h-14 items-center justify-between border-b border-slate-200 bg-slate-900 px-4 md:hidden">
        <div className="relative h-7 w-28">
          <Image src={logoUrl} alt={companyName} fill unoptimized className="object-contain object-left brightness-0 invert" />
        </div>
        <button
          onClick={() => setDrawerOpen(true)}
          className="rounded-md p-2 text-white hover:bg-white/10"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Desktop sidebar (always visible) */}
      <div className="hidden md:block">
        <AdminSidebar companyName={companyName} logoUrl={logoUrl} />
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDrawerOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 max-w-[80vw]">
            <div className="relative h-full">
              <button
                onClick={() => setDrawerOpen(false)}
                className="absolute right-3 top-3 z-10 rounded-md bg-white/10 p-1.5 text-white hover:bg-white/20"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
              <AdminSidebar companyName={companyName} logoUrl={logoUrl} onNavigate={() => setDrawerOpen(false)} />
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        <main className="mx-auto max-w-6xl p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
