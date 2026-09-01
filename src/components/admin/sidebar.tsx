"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FileText,
  Phone,
  MessageSquare,
  Star,
  ExternalLink,
  Layers,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoutButton } from "@/components/admin/logout-button";

const links = [
  { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/dashboard/products", label: "Products", icon: Package },
  { href: "/admin/dashboard/services", label: "Services Section", icon: Layers },
  { href: "/admin/dashboard/clients", label: "Client Logos", icon: Building2 },
  { href: "/admin/dashboard/content", label: "Website Content", icon: FileText },
  { href: "/admin/dashboard/contact-info", label: "Contact Info", icon: Phone },
  { href: "/admin/dashboard/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/dashboard/testimonials", label: "Testimonials", icon: Star },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-900 text-slate-300">
      <div className="flex h-16 items-center gap-2 border-b border-slate-800 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-sm font-black text-white">
          P
        </div>
        <span className="text-sm font-bold text-white">PrintPro Admin</span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-slate-800 p-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          <ExternalLink className="h-4 w-4" />
          View Live Site
        </Link>
        <LogoutButton />
      </div>
    </aside>
  );
}
