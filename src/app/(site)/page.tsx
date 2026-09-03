import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedCounter } from "@/components/animated-counter";
import {
  ShieldCheck,
  Clock,
  BadgeCheck,
  Star,
  ArrowRight,
  Building2,
  Users,
  Award,
  ThumbsUp,
  Eye,
  Target,
  HeartHandshake,
  Trophy,
  CheckCircle2,
} from "lucide-react";

export const dynamic = "force-dynamic";

const whyUs = [
  { icon: Clock, title: "Same-Day Support", desc: "Engineers dispatched across Lahore within hours of your call." },
  { icon: BadgeCheck, title: "Genuine Parts & Toner", desc: "No counterfeit consumables — ever." },
  { icon: ShieldCheck, title: "Flexible Contracts", desc: "Monthly plans with no long-term lock-in." },
  { icon: Star, title: "Trusted by Banks & Universities", desc: "Serving institutional clients across Pakistan." },
];

export default async function HomePage() {
  const [content, featuredProducts, testimonials, services, clientLogos] = await Promise.all([
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
    prisma.service.findMany({ orderBy: { order: "asc" } }),
    prisma.clientLogo.findMany({ orderBy: { order: "asc" } }),
  ]);

  const stats = [
    { icon: Building2, value: content.statMachines, suffix: "+", label: "Machines Supplied" },
    { icon: Users, value: content.statClients, suffix: "+", label: "Business Clients" },
    { icon: Award, value: content.statYears, suffix: "+", label: "Years of Service" },
    { icon: ThumbsUp, value: content.statRetention, suffix: "%", label: "Client Retention" },
  ];

  const aboutBlocks = [
    { icon: Eye, title: "Our Vision", text: content.visionText },
    { icon: Target, title: "Our Mission", text: content.missionText },
    { icon: HeartHandshake, title: "Our Promise", text: content.promiseText },
  ];

  return (
    <>
      {/* HERO */}
      <section className="gradient-hero relative overflow-hidden text-white">
        <div className="container mx-auto grid items-center gap-12 py-20 md:grid-cols-2 md:py-28">
          <div>
            <Badge className="mb-6 border-white/20 bg-white/10 text-white">
              Pakistan's Leading Rental Photocopier Service
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
              alt="Rental photocopier service in Pakistan"
              fill
              priority
              unoptimized
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
          <span>Certified PaperCut Setup</span>
        </div>
      </section>

      {/* ABOUT US / VISION / MISSION / PROMISE */}
      <section className="section">
        <div className="container mx-auto">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="text-3xl md:text-4xl">About Us</h2>
            <p className="mt-4 text-slate-600">{content.aboutText}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {aboutBlocks.map((b) => (
              <Card key={b.title}>
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50">
                    <b.icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="mb-2 text-base">{b.title}</h3>
                  <p className="text-sm text-slate-600">{b.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ACHIEVEMENTS / MILESTONES */}
      {content.achievementsText.trim() && (
        <section className="section bg-primary-900 text-white">
          <div className="container mx-auto">
            <div className="mx-auto mb-10 max-w-xl text-center">
              <Trophy className="mx-auto mb-4 h-9 w-9 text-blue-200" />
              <h2 className="text-3xl text-white md:text-4xl">Our Achievements</h2>
            </div>
            <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
              {content.achievementsText
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean)
                .map((line, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-lg bg-white/5 p-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-300" />
                    <span className="text-sm text-blue-50">{line}</span>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* SERVICES (admin-editable, images from database) */}
      {services.length > 0 && (
        <section className="section bg-slate-50">
          <div className="container mx-auto">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <h2 className="text-3xl md:text-4xl">Our Services</h2>
              <p className="mt-4 text-slate-600">{content.servicesIntro}</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <Card key={s.id} className="overflow-hidden transition-shadow hover:shadow-premium">
                  <div className="relative h-44 w-full">
                    <Image src={s.imageUrl} alt={s.title} fill unoptimized className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                  </div>
                  <CardContent className="pt-5">
                    <h3 className="mb-2 text-base">{s.title}</h3>
                    <p className="text-sm text-slate-600">{s.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PAPERCUT HIGHLIGHT — real official logos, distinct teal accent so
          it visually reads as a specialist partnership, not just another service */}
      <section className="section bg-gradient-to-br from-teal-800 via-teal-700 to-cyan-700 text-white">
        <div className="container mx-auto grid items-center gap-12 md:grid-cols-2">
          <div>
            <div className="mb-6 inline-flex items-center rounded-xl bg-white px-5 py-3 shadow-lg">
              <div className="relative h-9 w-40">
                <Image src="/logos/papercut-mark.png" alt="PaperCut" fill unoptimized className="object-contain object-left" />
              </div>
            </div>
            <h2 className="text-3xl text-white md:text-4xl">{content.paperCutTitle}</h2>
            <p className="mt-5 text-teal-50">{content.paperCutText}</p>
            <Link href="/services#papercut">
              <Button size="lg" variant="white" className="mt-8 text-teal-700">
                Learn More <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="space-y-4">
            <div className="rounded-xl bg-white p-5">
              <div className="relative h-10 w-36">
                <Image src="/logos/papercut-mf.png" alt="PaperCut MF" fill unoptimized className="object-contain object-left" />
              </div>
              <p className="mt-3 text-xs text-teal-950">Turns your copier's touchscreen into a secure release station and scanning hub.</p>
            </div>
            <div className="rounded-xl bg-white p-5">
              <div className="relative h-10 w-36">
                <Image src="/logos/papercut-hive.png" alt="PaperCut Hive" fill unoptimized className="object-contain object-left" />
              </div>
              <p className="mt-3 text-xs text-teal-950">Cloud-based print management for organisations of any size, zero servers required.</p>
            </div>
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
                <Link key={p.id} href={`/products/${p.slug}`}>
                  <Card className="h-full overflow-hidden transition-shadow hover:shadow-premium">
                    <div className="relative flex h-52 w-full items-center justify-center bg-slate-50">
                      <Image src={p.imageUrl} alt={p.name} fill unoptimized className="object-contain p-4" sizes="(max-width: 768px) 100vw, 33vw" />
                    </div>
                    <CardContent className="pt-5">
                      <h3 className="mb-1 text-base">{p.name}</h3>
                      <p className="mb-3 line-clamp-2 text-sm text-slate-600">{p.description}</p>
                      <p className="text-lg font-bold text-primary-700">
                        {p.price != null
                          ? <>Rs. {p.price.toLocaleString("en-PK")}<span className="text-sm font-normal text-slate-500">{p.priceLabel}</span></>
                          : <span className="text-sm font-semibold text-slate-500">Contact for Price</span>}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* WHY US + ANIMATED STATS */}
      <section className="section bg-primary-900 text-white">
        <div className="container mx-auto">
          <h2 className="mb-14 text-center text-3xl text-white md:text-4xl">Why Choose Us?</h2>
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

          <div className="mt-16 grid grid-cols-2 gap-8 border-t border-white/10 pt-14 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <s.icon className="mx-auto mb-3 h-8 w-8 text-blue-200" />
                <p className="text-4xl font-extrabold text-white">
                  <AnimatedCounter target={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-1 text-sm text-blue-100">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR CLIENTS — "Trusted By" strip */}
      {clientLogos.length > 0 && (
        <section className="border-b border-slate-100 bg-white py-14">
          <div className="container mx-auto">
            <h2 className="mb-2 text-center text-2xl">Our Clients</h2>
            <p className="mb-8 text-center text-xs font-bold uppercase tracking-widest text-slate-400">
              Trusted By Businesses Across Pakistan
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
              {clientLogos.map((c) => (
                <div key={c.id} className="flex flex-col items-center gap-2 grayscale transition hover:grayscale-0">
                  <div className="relative h-12 w-28">
                    <Image src={c.logoUrl} alt={c.name} fill unoptimized className="object-contain" />
                  </div>
                  <span className="text-xs font-medium text-slate-400">{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS / REVIEWS */}
      {testimonials.length > 0 && (
        <section className="section bg-slate-50">
          <div className="container mx-auto">
            <h2 className="mb-14 text-center text-3xl md:text-4xl">Client Reviews</h2>
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
