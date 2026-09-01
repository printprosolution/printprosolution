"use client";
import { useState } from "react";
import Image from "next/image";
import type { ClientLogo } from "@prisma/client";
import { deleteClientLogo } from "@/actions/client-logos";
import { Trash2 } from "lucide-react";

export function ClientLogoTable({ logos }: { logos: ClientLogo[] }) {
  const [busyId, setBusyId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Remove this client logo?")) return;
    setBusyId(id);
    await deleteClientLogo(id);
    setBusyId(null);
  }

  if (logos.length === 0) {
    return <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500">No client logos yet.</div>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {logos.map((c) => (
        <div key={c.id} className="rounded-lg border border-slate-200 bg-white p-4 text-center">
          <div className="relative mx-auto mb-2 h-16 w-full">
            <Image src={c.logoUrl} alt={c.name} fill unoptimized className="object-contain" />
          </div>
          <p className="mb-2 text-xs font-medium text-slate-600">{c.name}</p>
          <button onClick={() => handleDelete(c.id)} disabled={busyId === c.id} className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600">
            <Trash2 className="mx-auto h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
