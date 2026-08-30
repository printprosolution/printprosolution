"use client";

import type { Testimonial } from "@prisma/client";
import { deleteTestimonial } from "@/actions/testimonials";
import { Star, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";

export function TestimonialTable({ testimonials }: { testimonials: Testimonial[] }) {
  const [isPending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);

  function handleDelete(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    setBusyId(id);
    startTransition(async () => {
      await deleteTestimonial(id);
      setBusyId(null);
    });
  }

  if (testimonials.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500">
        No testimonials yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {testimonials.map((t) => (
        <div key={t.id} className="flex items-start justify-between rounded-lg border border-slate-200 bg-white p-5">
          <div>
            <div className="mb-1 flex gap-0.5">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-primary-600 text-primary-600" />
              ))}
            </div>
            <p className="mb-2 text-sm italic text-slate-700">&ldquo;{t.message}&rdquo;</p>
            <p className="text-sm font-semibold text-slate-900">{t.name}</p>
            <p className="text-xs text-slate-500">{t.company}</p>
          </div>
          <button
            onClick={() => handleDelete(t.id)}
            disabled={isPending && busyId === t.id}
            className="rounded-md p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
            aria-label="Delete testimonial"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
