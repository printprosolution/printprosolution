import type { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Building2, Clock, ThumbsUp } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await prisma.siteContent.findUnique({ where: { id: "main" } });
  return {
    title: `About Us | ${content?.companyName ?? "PrintPro Solutions Lahore"}`,
    description: content?.aboutText?.slice(0, 155),
  };
}

const stats = [
  { icon: Building2, value: "500+", label: "Machines Deployed" },
  { icon: Users, value: "150+", label: "Business Clients" },
  { icon: Clock, value: "10+", label: "Years of Service" },
  { icon: ThumbsUp, value: "98%", label: "Client Retention" },
];

export default async function AboutPage() {
  const content = await prisma.siteContent.upsert({
    where: { id: "main" },
    update: {},
    create: { id: "main" },
  });

  return (
    <>
      <section className="gradient-hero py-16 text-center text-white">
        <div className="container mx-auto">
          <h1 className="text-4xl text-white md:text-5xl">About {content.companyName}</h1>
        </div>
      </section>

      <section className="section">
        <div className="container mx-auto grid items-center gap-12 md:grid-cols-2">
          <div className="relative h-80 overflow-hidden rounded-2xl shadow-premium md:h-[420px]">
            <Image src={content.aboutImageUrl} alt={content.companyName} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
          </div>
          <div>
            <h2 className="text-3xl">{content.aboutTitle}</h2>
            <p className="mt-6 text-slate-600">{content.aboutText}</p>
          </div>
        </div>
      </section>

      <section className="section bg-primary-900 text-white">
        <div className="container mx-auto grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <s.icon className="mx-auto mb-3 h-8 w-8 text-blue-200" />
              <p className="text-3xl font-extrabold text-white">{s.value}</p>
              <p className="mt-1 text-sm text-blue-100">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container-narrow text-center">
          <h2 className="text-3xl">Our Mission</h2>
          <p className="mt-4 text-slate-600">
            To be Pakistan&apos;s most reliable photocopier and printer rental partner —
            keeping banks, universities and businesses printing without interruption
            through genuine equipment, honest pricing and fast, local support.
          </p>
        </div>
      </section>

      <section className="section bg-slate-50">
        <div className="container mx-auto grid gap-8 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6 text-center">
              <h3 className="mb-2 text-base">Genuine Equipment</h3>
              <p className="text-sm text-slate-600">
                Every Ricoh, Xerox and Canon machine we rent is sourced through
                authorised channels with full service history.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <h3 className="mb-2 text-base">Local, Fast Support</h3>
              <p className="text-sm text-slate-600">
                Our technicians are based in Lahore, meaning shorter response
                times than national vendors.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <h3 className="mb-2 text-base">Transparent Pricing</h3>
              <p className="text-sm text-slate-600">
                No hidden charges — flat monthly rental with clear per-page
                toner billing.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
