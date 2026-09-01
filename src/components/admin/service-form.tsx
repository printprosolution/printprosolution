"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createService, updateService, type ServiceFormState } from "@/actions/services";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/admin/image-uploader";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import type { Service } from "@prisma/client";
import { useEffect } from "react";

const initialState: ServiceFormState = { success: false };

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending}>{pending ? "Saving..." : label}</Button>;
}

export function ServiceForm({ service, onSuccess }: { service?: Service; onSuccess?: () => void }) {
  const action = service ? updateService : createService;
  const [state, formAction] = useFormState(action, initialState);

  useEffect(() => {
    if (state.success && onSuccess) onSuccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success]);

  return (
    <form action={formAction} className="space-y-5">
      {service && <input type="hidden" name="id" value={service.id} />}
      {state.error && (
        <div className="flex items-center gap-2 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" /> {state.error}
        </div>
      )}
      {state.success && (
        <div className="flex items-center gap-2 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" /> Saved successfully.
        </div>
      )}
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={service?.title} required />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={service?.description} required />
      </div>
      <div>
        <Label htmlFor="order">Display Order</Label>
        <Input id="order" name="order" type="number" defaultValue={service?.order ?? 0} />
        <p className="mt-1 text-xs text-slate-500">Lower numbers show first.</p>
      </div>
      <ImageUploader name="imageUrl" label="Service Image" defaultValue={service?.imageUrl} required />
      <SubmitButton label={service ? "Update Service" : "Add Service"} />
    </form>
  );
}
