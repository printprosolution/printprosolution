import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Copy, Package, Wrench, Printer, ShieldCheck, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await prisma.siteContent.findUnique({ where: { id: "main" } });
  return {
    title: `Services | ${content?.companyName ?? "PrintPro Solutions Lahore"}`,
    description:
      "Photocopier rental, toner supply, on-site repair, bulk copier deals and PaperCut print-management for banks, universities and offices in Lahore, Pakistan.",
  };
}

const serviceSections = [
  {
    id: "photocopier-rental",
    icon: Copy,
    title: "Photocopier Rental on Monthly Basis",
    image:
      "https://images.unsplash.com/photo-1612815154858-60aa4c59eabd?q=80&w=1200&auto=format&fit=crop",
    body:
      "Renting a photocopier is the smartest way to keep your office running without a large upfront investment. PrintPro Solutions Lahore rents out high-volume machines such as the Ricoh MP 3510 and Xerox WorkCentre 7845 on simple monthly contracts — popular with banks, universities, schools and corporate offices across Lahore and the rest of Pakistan. Every rental includes delivery, installation and operator training.",
    points: [
      "Flexible month-to-month or annual contracts",
      "Ricoh, Xerox and Canon machines available",
      "Free delivery, installation and training in Lahore",
      "Upgrade or swap machines as your volume grows",
    ],
  },
  {
    id: "toner-supply",
    icon: Package,
    title: "Toner & Pages Supply",
    image:
      "https://images.unsplash.com/photo-1585313319701-b2e5b3f1a5f4?q=80&w=1200&auto=format&fit=crop",
    body:
      "Running out of toner mid-month is one of the most common (and avoidable) office headaches. We supply genuine and high-quality compatible toner cartridges, drums and consumables for all major brands, with scheduled deliveries so active rental clients never run dry.",
    points: [
      "Genuine and compatible toner for all major brands",
      "Scheduled and on-demand delivery across Lahore",
      "Pay-per-page billing options available",
      "Bulk pricing for high-volume offices",
    ],
  },
  {
    id: "repair-maintenance",
    icon: Wrench,
    title: "On-site Repair and Maintenance",
    image:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop",
    body:
      "Every rental and sale from PrintPro comes with a dedicated maintenance plan. Our certified technicians provide same-day, on-site breakdown support along with scheduled preventive maintenance, so your Ricoh, Xerox or Canon machine keeps running at peak performance year-round.",
    points: [
      "Same-day on-site technician dispatch in Lahore",
      "Scheduled preventive maintenance visits",
      "Genuine spare parts stocked locally",
      "Priority SLA for bank and university clients",
    ],
  },
  {
    id: "bulk-deals",
    icon: Printer,
    title: "Bulk Printer/Copier Deals",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
    body:
      "Need copiers across multiple branches or departments? Like GCS, we offer volume-based bulk deals for banks, universities and large corporate groups — a single contract, one point of contact, and consistent pricing across every unit deployed.",
    points: [
      "Volume discounts on 5+ units",
      "Single contract across multiple branches/campuses",
      "Dedicated account manager",
      "Consolidated monthly billing",
    ],
  },
  {
    id: "papercut",
    icon: ShieldCheck,
    title: "PaperCut Software Integration for Print Management",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    body:
      "Control who prints what, cut wasteful printing, and get full visibility into your organisation's usage with PaperCut — the print-management platform trusted by universities and enterprises worldwide. PrintPro handles the complete setup: installation, user-quota configuration, secure print release and ongoing support, fully integrated with your rented Ricoh or Xerox fleet.",
    points: [
      "Full PaperCut installation and configuration",
      "Print quotas and cost-center reporting",
      "Secure “pull printing” / follow-me printing",
      "Ideal for universities, banks and large offices",
    ],
  },
];

export default async function ServicesPage() {
  const content = await prisma.siteContent.upsert({
    where: { id: "main" },
    update: {},
    create: { id: "main" },
  });

  return (
    <>
      <section className="gradient-hero py-16 text-center text-white">
        <div className="container mx-auto">
          <h1 className="text-4xl text-white md:text-5xl">Our Services</h1>
          <p className="mx-auto mt-4 max-w-2xl text-blue-100">{content.servicesIntro}</p>
        </div>
      </section>

      {serviceSections.map((s, i) => (
        <section key={s.id} id={s.id} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
          <div className="container mx-auto grid items-center gap-12 py-16 md:grid-cols-2 md:py-20">
            <div className={i % 2 === 1 ? "md:order-2" : ""}>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50">
                <s.icon className="h-6 w-6 text-primary-600" />
              </div>
              <h2 className="text-2xl md:text-3xl">{s.title}</h2>
              <p className="mt-4 text-slate-600">{s.body}</p>
              <ul className="mt-6 space-y-3">
                {s.points.map((pt) => (
                  <li key={pt} className="flex items-start gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />
                    {pt}
                  </li>
                ))}
              </ul>
              <Link href="/contact">
                <Button className="mt-8">Ask About This Service</Button>
              </Link>
            </div>
            <div className={`relative h-72 overflow-hidden rounded-2xl shadow-premium md:h-96 ${i % 2 === 1 ? "md:order-1" : ""}`}>
              <Image src={s.image} alt={s.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
