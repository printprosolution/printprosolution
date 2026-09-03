import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, ArrowUpRight } from "lucide-react";

interface FooterProps {
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  companyName: string;
  logoUrl: string;
}

export function Footer({
  contactName,
  contactPhone,
  contactEmail,
  contactAddress,
  companyName,
  logoUrl,
}: FooterProps) {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-slate-950 to-primary-900 text-slate-300">
      {/* decorative top accent line */}
      <div className="h-1 w-full bg-gradient-to-r from-primary-600 via-blue-400 to-primary-600" />

      {/* subtle CTA strip */}
      <div className="border-b border-white/10">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 py-8 md:flex-row">
          <div className="text-center md:text-left">
            <p className="text-lg font-bold text-white">Need a photocopier on rent?</p>
            <p className="text-sm text-slate-400">Get a free quote — usually within the same day.</p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-primary-800 transition-transform hover:scale-105"
          >
            Get a Free Quote <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="container mx-auto grid gap-10 py-16 md:grid-cols-4">
        <div>
          <div className="relative mb-4 h-10 w-40">
            <Image src={logoUrl} alt={companyName} fill unoptimized className="object-contain object-left brightness-0 invert" />
          </div>
          <p className="text-sm leading-relaxed text-slate-400">
            Photocopier and printer rental, toner supply, on-site repair and
            certified PaperCut print-management for banks, universities and
            offices across Pakistan.
          </p>
          <div className="mt-5 flex gap-3">
            <a href="#" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-primary-600">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="#" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-primary-600">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="#" aria-label="LinkedIn" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-primary-600">
              <Linkedin className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">
            Quick Links
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/services" className="transition-colors hover:text-primary-300">Services</Link></li>
            <li><Link href="/products" className="transition-colors hover:text-primary-300">Products</Link></li>
            <li><Link href="/about" className="transition-colors hover:text-primary-300">About Us</Link></li>
            <li><Link href="/contact" className="transition-colors hover:text-primary-300">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">
            Our Services
          </h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>Photocopier Rental (Monthly)</li>
            <li>Toner &amp; Pages Supply</li>
            <li>On-site Repair &amp; Maintenance</li>
            <li>Bulk Printer/Copier Deals</li>
            <li>PaperCut NG / MF Integration</li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">
            Contact
          </h4>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary-300" />
              <span>{contactName} — {contactPhone}</span>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary-300" />
              <span>{contactEmail}</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-300" />
              <span>{contactAddress}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {companyName}. All rights reserved.
      </div>
    </footer>
  );
}
