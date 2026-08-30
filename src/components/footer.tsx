import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

interface FooterProps {
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  companyName: string;
}

export function Footer({
  contactName,
  contactPhone,
  contactEmail,
  contactAddress,
  companyName,
}: FooterProps) {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container mx-auto grid gap-10 py-16 md:grid-cols-4">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-base font-black text-white">
              P
            </div>
            <span className="text-base font-extrabold text-white">
              {companyName}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-slate-400">
            Photocopier and printer rental, toner supply, on-site repair and
            PaperCut print-management for banks, universities and offices
            across Pakistan.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">
            Quick Links
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/services" className="hover:text-primary-400">Services</Link></li>
            <li><Link href="/products" className="hover:text-primary-400">Products</Link></li>
            <li><Link href="/about" className="hover:text-primary-400">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-primary-400">Contact</Link></li>
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
            <li>PaperCut Software Integration</li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">
            Contact
          </h4>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary-400" />
              <span>{contactName} — {contactPhone}</span>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary-400" />
              <span>{contactEmail}</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-400" />
              <span>{contactAddress}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {companyName}. All rights reserved.
      </div>
    </footer>
  );
}
