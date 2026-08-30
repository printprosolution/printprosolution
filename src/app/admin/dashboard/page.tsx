import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Package, MessageSquare, Star, Clock } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardOverviewPage() {
  const [productCount, messageCount, testimonialCount, recentMessages] = await Promise.all([
    prisma.product.count(),
    prisma.contactMessage.count(),
    prisma.testimonial.count(),
    prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const unreadCount = await prisma.contactMessage.count({ where: { read: false } });

  const stats = [
    { icon: Package, label: "Total Products", value: productCount, href: "/admin/dashboard/products" },
    { icon: MessageSquare, label: "Contact Messages", value: messageCount, badge: unreadCount > 0 ? `${unreadCount} new` : undefined, href: "/admin/dashboard/messages" },
    { icon: Star, label: "Testimonials", value: testimonialCount, href: "/admin/dashboard/testimonials" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
      <p className="mt-1 text-sm text-slate-500">Welcome back, Asad. Here&apos;s what&apos;s happening on your site.</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="transition-shadow hover:shadow-premium">
              <CardContent className="flex items-center justify-between pt-6">
                <div>
                  <p className="text-sm font-medium text-slate-500">{s.label}</p>
                  <p className="mt-1 text-3xl font-bold text-slate-900">{s.value}</p>
                  {s.badge && (
                    <span className="mt-1 inline-block rounded-full bg-primary-50 px-2 py-0.5 text-xs font-semibold text-primary-700">
                      {s.badge}
                    </span>
                  )}
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50">
                  <s.icon className="h-6 w-6 text-primary-600" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Recent Messages</h2>
        <Card>
          <CardContent className="pt-6">
            {recentMessages.length === 0 ? (
              <p className="text-sm text-slate-500">No messages yet.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {recentMessages.map((m) => (
                  <li key={m.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{m.name}</p>
                      <p className="text-sm text-slate-500">{m.email}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Clock className="h-3.5 w-3.5" />
                      {formatDate(m.createdAt)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
