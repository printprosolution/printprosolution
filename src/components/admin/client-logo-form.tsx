"use client";
import { useFormState, useFormStatus } from "react-dom";
import { createClientLogo, type ClientLogoFormState } from "@/actions/client-logos";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/admin/image-uploader";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useEffect, useRef } from "react";

const initialState: ClientLogoFormState = { success: false };

function SubmitButton() {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending}>{pending ? "Adding..." : "Add Client"}</Button>;
}

export function ClientLogoForm() {
  const [state, formAction] = useFormState(createClientLogo, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      {state.error && (
        <div className="flex items-center gap-2 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" /> {state.error}
        </div>
      )}
      {state.success && (
        <div className="flex items-center gap-2 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" /> Client added.
        </div>
      )}
      <div>
        <Label htmlFor="name">Client / Company Name</Label>
        <Input id="name" name="name" required />
      </div>
      <ImageUploader name="logoUrl" label="Client Logo" required />
      <SubmitButton />
    </form>
  );
}
