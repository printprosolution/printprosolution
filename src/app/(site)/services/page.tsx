import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { CheckCircle2, PrinterCheck, ShieldCheck, Users, FileBarChart, Lock } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await prisma.siteContent.findUnique({ where: { id: "main" } });
  return {
    title: `Services | ${content?.companyName ?? "PrintPro Solutions Lahore"}`,
    description:
      "Photocopier rental, toner supply, on-site repair, bulk copier deals and certified PaperCut NG/MF print-management for banks, universities and offices in Lahore, Pakistan.",
  };
}

const paperCutFeatures = [
  { icon: FileBarChart, title: "Usage Reporting", desc: "See exactly who prints what, and where costs are coming from, department by department." },
  { icon: Lock, title: "Secure Pull Printing", desc: "Jobs only print when the user badges in at the device — nothing left sitting in the output tray." },
  { icon: ShieldCheck, title: "Quotas & Cost Control", desc: "Set print/copy quotas per user or group and cut wasteful printing significantly." },
  { icon: Users, title: "Built for Institutions", desc: "The platform of choice for universities, banks and large enterprises worldwide." },
];

export default async function ServicesPage() {
  const [content, services] = await Promise.all([
    prisma.siteContent.upsert({
      where: { id: "main" },
      update: {},
      create: { id: "main" },
    }),
    prisma.service.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <>
      <section className="gradient-hero py-16 text-center text-white">
        <div className="container mx-auto">
          <h1 className="text-4xl text-white md:text-5xl">Our Services</h1>
          <p className="mx-auto mt-4 max-w-2xl text-blue-100">{content.servicesIntro}</p>
        </div>
      </section>

      {services.map((s, i) => (
        <section key={s.id} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
          <div className="container mx-auto grid items-center gap-12 py-16 md:grid-cols-2 md:py-20">
            <div className={i % 2 === 1 ? "md:order-2" : ""}>
              <h2 className="text-2xl md:text-3xl">{s.title}</h2>
              <p className="mt-4 text-slate-600">{s.description}</p>
              <Link href="/contact">
                <Button className="mt-8">Ask About This Service</Button>
              </Link>
            </div>
            <div className={`relative h-72 overflow-hidden rounded-2xl shadow-premium md:h-96 ${i % 2 === 1 ? "md:order-1" : ""}`}>
              <Image src={s.imageUrl} alt={s.title} fill unoptimized className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
          </div>
        </section>
      ))}

      {/* PAPERCUT — dedicated presentation-style section, distinct teal
          accent so it visually separates itself as a specialist offering */}
      <section id="papercut" className="bg-gradient-to-b from-slate-900 to-teal-950 py-20 text-white">
        <div className="container mx-auto">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-6 inline-flex items-center gap-3 rounded-xl bg-white px-6 py-3 shadow-lg">
              <PrinterCheck className="h-8 w-8 text-teal-600" />
              <span className="text-2xl font-black tracking-tight text-teal-700">PaperCut<span className="text-slate-400">®</span></span>
            </div>
            <h2 className="text-3xl text-white md:text-4xl">{content.paperCutTitle}</h2>
            <p className="mt-5 text-teal-100">{content.paperCutText}</p>
          </div>

          <div className="mx-auto mt-14 grid max-w-4xl gap-6 sm:grid-cols-2">
            {paperCutFeatures.map((f) => (
              <div key={f.title} className="rounded-xl border border-white/10 bg-white/5 p-6">
                <f.icon className="mb-3 h-6 w-6 text-teal-300" />
                <h3 className="mb-1 text-base text-white">{f.title}</h3>
                <p className="text-sm text-teal-100">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-14 max-w-4xl rounded-2xl border border-teal-400/30 bg-teal-500/10 p-8">
            <p className="mb-5 text-center text-xs font-bold uppercase tracking-widest text-teal-200">
              Editions We Deploy
            </p>
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="text-center">
                <p className="text-lg font-bold text-white">PaperCut NG</p>
                <p className="mt-1 text-xs text-teal-100">Print management for organisations of any size</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-white">PaperCut MF</p>
                <p className="mt-1 text-xs text-teal-100">Turns copier touchscreens into secure release stations</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-white">PaperCut Hive</p>
                <p className="mt-1 text-xs text-teal-100">Cloud-based print management, zero servers required</p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link href="/contact">
              <Button size="lg" variant="white" className="text-teal-700">
                Talk to a PaperCut Specialist
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
