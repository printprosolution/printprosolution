import { prisma } from "@/lib/prisma";
import { TestimonialForm } from "@/components/admin/testimonial-form";
import { TestimonialTable } from "@/components/admin/testimonial-table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-slate-900">Testimonials</h1>
      <p className="mb-6 text-sm text-slate-500">
        The 3 most recent testimonials are shown on the homepage.
      </p>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Add New Testimonial</CardTitle></CardHeader>
          <CardContent>
            <TestimonialForm />
          </CardContent>
        </Card>

        <div>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
            All Testimonials
          </h2>
          <TestimonialTable testimonials={testimonials} />
        </div>
      </div>
    </div>
  );
}
