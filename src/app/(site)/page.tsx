import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Copy,
  Wrench,
  Package,
  ShieldCheck,
  Clock,
  BadgeCheck,
  Star,
  ArrowRight,
  Printer,
} from "lucide-react";

export const dynamic = "force-dynamic";

const services = [
  {
    icon: Copy,
    title: "Photocopier Rental (Monthly)",
    desc: "Ricoh, Xerox and Canon photocopiers on flexible monthly rental plans — no heavy upfront investment.",
  },
  {
    icon: Package,
    title: "Toner & Pages Supply",
    desc: "Genuine and compatible toner, drums and consumables delivered across Lahore, on schedule.",
  },
  {
    icon: Wrench,
    title: "On-site Repair & Maintenance",
    desc: "Certified technicians for same-day breakdown support and scheduled preventive maintenance.",
  },
  {
    icon: Printer,
    title: "Bulk Printer/Copier Deals",
    desc: "Volume pricing for banks, universities and large offices needing multiple units — GCS-style bulk deals.",
  },
  {
    icon: ShieldCheck,
    title: "PaperCut Software Integration",
    desc: "Track, control and cut printing costs with PaperCut print-management, configured and supported end-to-end.",
  },
];

const whyUs = [
  { icon: Clock, title: "Same-Day Support", desc: "Engineers dispatched across Lahore within hours of your call." },
  { icon: BadgeCheck, title: "Genuine Parts & Toner", desc: "No counterfeit consumables — ever." },
  { icon: ShieldCheck, title: "Flexible Contracts", desc: "Monthly plans with no long-term lock-in." },
  { icon: Star, title: "Trusted by Banks & Universities", desc: "Serving institutional clients across Pakistan." },
];

export default async function HomePage() {
  const [content, featuredProducts, testimonials] = await Promise.all([
    prisma.siteContent.upsert({
      where: { id: "main" },
      update: {},
      create: { id: "main" },
    }),
    prisma.product.findMany({
      where: { featured: true },
      take: 3,
      orderBy: { createdAt: "desc" },
    }),
    prisma.testimonial.findMany({ take: 6, orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <>
      {/* HERO */}
      <section className="gradient-hero relative overflow-hidden text-white">
        <div className="container mx-auto grid items-center gap-12 py-20 md:grid-cols-2 md:py-28">
          <div>
            <Badge className="mb-6 border-white/20 bg-white/10 text-white">
              #1 Photocopier Rental Company in Lahore, Pakistan
            </Badge>
            <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
              {content.heroTitle}
            </h1>
            <p className="mt-6 max-w-xl text-lg text-blue-100">
              {content.heroSubtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/contact">
                <Button size="lg" variant="white">
                  Request a Free Quote <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/services">
                <Button size="lg" variant="outline" className="border-white text-white bg-transparent hover:bg-white/10">
                  Explore Services
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative h-72 w-full overflow-hidden rounded-2xl shadow-2xl md:h-96">
            <Image
              src={content.heroImageUrl}
              alt="Photocopier and printer rental in Lahore, Pakistan"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-b border-slate-100 bg-white py-6">
        <div className="container mx-auto flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm font-semibold text-slate-500">
          <span>Ricoh MP 3510 Rental</span>
          <span className="text-slate-300">•</span>
          <span>Xerox WorkCentre Rental</span>
          <span className="text-slate-300">•</span>
          <span>Copier Rental for Banks</span>
          <span className="text-slate-300">•</span>
          <span>Copier Rental for Universities</span>
          <span className="text-slate-300">•</span>
          <span>PaperCut Certified Setup</span>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section bg-slate-50">
        <div className="container mx-auto">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="text-3xl md:text-4xl">Our Services</h2>
            <p className="mt-4 text-slate-600">{content.servicesIntro}</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {services.map((s) => (
              <Card key={s.title} className="transition-shadow hover:shadow-premium">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50">
                    <s.icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="mb-2 text-base">{s.title}</h3>
                  <p className="text-sm text-slate-600">{s.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      {featuredProducts.length > 0 && (
        <section className="section">
          <div className="container mx-auto">
            <div className="mb-12 flex items-end justify-between">
              <h2 className="text-3xl md:text-4xl">Popular Rentals</h2>
              <Link href="/products" className="text-sm font-semibold text-primary-600 hover:underline">
                View all products →
              </Link>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {featuredProducts.map((p) => (
                <Card key={p.id} className="overflow-hidden">
                  <div className="relative h-52 w-full">
                    <Image src={p.imageUrl} alt={p.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                  </div>
                  <CardContent className="pt-5">
                    <h3 className="mb-1 text-base">{p.name}</h3>
                    <p className="mb-3 line-clamp-2 text-sm text-slate-600">{p.description}</p>
                    <p className="text-lg font-bold text-primary-700">
                      Rs. {p.price.toLocaleString("en-PK")}
                      <span className="text-sm font-normal text-slate-500">{p.priceLabel}</span>
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* WHY US */}
      <section className="section bg-primary-900 text-white">
        <div className="container mx-auto">
          <h2 className="mb-14 text-center text-3xl text-white md:text-4xl">Why Choose PrintPro?</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {whyUs.map((w) => (
              <div key={w.title} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
                  <w.icon className="h-6 w-6 text-blue-200" />
                </div>
                <h3 className="mb-2 text-base text-white">{w.title}</h3>
                <p className="text-sm text-blue-100">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="section bg-slate-50">
          <div className="container mx-auto">
            <h2 className="mb-14 text-center text-3xl md:text-4xl">What Our Clients Say</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {testimonials.slice(0, 3).map((t) => (
                <Card key={t.id}>
                  <CardContent className="pt-6">
                    <div className="mb-3 flex gap-1">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-primary-600 text-primary-600" />
                      ))}
                    </div>
                    <p className="mb-4 text-sm italic text-slate-700">&ldquo;{t.message}&rdquo;</p>
                    <p className="text-sm font-bold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.company}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section">
        <div className="container mx-auto">
          <div className="gradient-hero flex flex-col items-center justify-between gap-6 rounded-2xl px-8 py-14 text-center text-white md:flex-row md:text-left">
            <div>
              <h2 className="text-2xl text-white md:text-3xl">Ready to rent your next photocopier?</h2>
              <p className="mt-2 text-blue-100">Get a free, no-obligation quote within the same day.</p>
            </div>
            <Link href="/contact">
              <Button size="lg" variant="white">
                Contact Us Now <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
