"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, User, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

interface NavbarProps {
  contactPhone: string;
  companyName: string;
  logoUrl: string;
  userName?: string | null; // present only when a regular user is logged in
}

export function Navbar({ contactPhone, companyName, logoUrl, userName }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur">
      <div className="container mx-auto flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-10 w-36 shrink-0">
            <Image src={logoUrl} alt={companyName} fill unoptimized className="object-contain object-left" priority />
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-semibold text-slate-600 transition-colors hover:text-primary-600",
                pathname === link.href && "text-primary-600"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <a
            href={`tel:${contactPhone.replace(/[^\d+]/g, "")}`}
            className="flex items-center gap-2 text-sm font-semibold text-slate-700"
          >
            <Phone className="h-4 w-4 text-primary-600" />
            {contactPhone}
          </a>
          {userName ? (
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                <User className="h-4 w-4 text-primary-600" /> {userName}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-red-600"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          ) : (
            <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-primary-600">
              Login
            </Link>
          )}
          <Link href="/contact">
            <Button size="sm">Get a Quote</Button>
          </Link>
        </div>

        <button
          className="md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-slate-100 bg-white md:hidden">
          <div className="container mx-auto flex flex-col gap-1 py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-primary-50 hover:text-primary-700"
              >
                {link.label}
              </Link>
            ))}
            {userName ? (
              <button
                onClick={() => { setOpen(false); signOut({ callbackUrl: "/" }); }}
                className="rounded-md px-3 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                Logout ({userName})
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-primary-50 hover:text-primary-700"
              >
                Login
              </Link>
            )}
            <Link href="/contact" onClick={() => setOpen(false)} className="mt-2">
              <Button className="w-full">Get a Quote</Button>
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
