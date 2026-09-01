"use client";
import { useState } from "react";
import Image from "next/image";
import type { Service } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/admin/modal";
import { ServiceForm } from "@/components/admin/service-form";
import { deleteService } from "@/actions/services";
import { Plus, Pencil, Trash2 } from "lucide-react";

export function ServiceTable({ services }: { services: Service[] }) {
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Delete this service?")) return;
    setBusyId(id);
    await deleteService(id);
    setBusyId(null);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Services Section</h1>
        <Button onClick={() => setShowAdd(true)}><Plus className="h-4 w-4" /> Add Service</Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.length === 0 && (
          <p className="col-span-full rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500">
            No services yet. Add your first one — these show on the homepage and /services page.
          </p>
        )}
        {services.map((s) => (
          <div key={s.id} className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            <div className="relative h-36 w-full bg-slate-100">
              <Image src={s.imageUrl} alt={s.title} fill unoptimized className="object-cover" />
            </div>
            <div className="p-4">
              <h3 className="mb-1 text-sm font-semibold text-slate-900">{s.title}</h3>
              <p className="mb-3 line-clamp-2 text-xs text-slate-500">{s.description}</p>
              <div className="flex justify-end gap-2">
                <button onClick={() => setEditing(s)} className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-primary-600"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => handleDelete(s.id)} disabled={busyId === s.id} className="rounded-md p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {showAdd && (
        <Modal title="Add Service" onClose={() => setShowAdd(false)}>
          <ServiceForm onSuccess={() => setShowAdd(false)} />
        </Modal>
      )}
      {editing && (
        <Modal title="Edit Service" onClose={() => setEditing(null)}>
          <ServiceForm service={editing} onSuccess={() => setEditing(null)} />
        </Modal>
      )}
    </div>
  );
}
