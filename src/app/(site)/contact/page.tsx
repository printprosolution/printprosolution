import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ContactForm } from "@/components/contact-form";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await prisma.siteContent.findUnique({ where: { id: "main" } });
  return {
    title: `Contact Us | ${content?.companyName ?? "PrintPro Solutions Lahore"}`,
    description:
      "Get a free quote for photocopier rental, toner supply or on-site repair in Lahore, Pakistan. Call, email or send us a message.",
  };
}

export default async function ContactPage() {
  const content = await prisma.siteContent.upsert({
    where: { id: "main" },
    update: {},
    create: { id: "main" },
  });

  return (
    <section className="section">
      <div className="container mx-auto grid gap-12 md:grid-cols-2">
        <div>
          <h1 className="text-3xl md:text-4xl">Get In Touch</h1>
          <p className="mt-4 text-slate-600">
            Tell us about your office and printing needs — we&apos;ll get back to you with a
            free quote, usually within the same business day.
          </p>

          <div className="mt-8 space-y-5">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary-50">
                <Phone className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{content.contactName}</p>
                <a href={`tel:${content.contactPhone.replace(/[^\d+]/g, "")}`} className="text-sm text-slate-600 hover:text-primary-600">
                  {content.contactPhone}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary-50">
                <Mail className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Email</p>
                <a href={`mailto:${content.contactEmail}`} className="text-sm text-slate-600 hover:text-primary-600">
                  {content.contactEmail}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary-50">
                <MapPin className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Location</p>
                <p className="text-sm text-slate-600">{content.contactAddress}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary-50">
                <Clock className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Working Hours</p>
                <p className="text-sm text-slate-600">Mon – Sat, 9:00 AM – 7:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
