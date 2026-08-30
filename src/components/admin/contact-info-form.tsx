"use client";

import { useFormState, useFormStatus } from "react-dom";
import { updateContactInfo, type ContentFormState } from "@/actions/content";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import type { SiteContent } from "@prisma/client";

const initialState: ContentFormState = { success: false };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save Contact Info"}
    </Button>
  );
}

export function ContactInfoForm({ content }: { content: SiteContent }) {
  const [state, formAction] = useFormState(updateContactInfo, initialState);

  return (
    <form action={formAction} className="max-w-lg space-y-5">
      {state.error && (
        <div className="flex items-center gap-2 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.error}
        </div>
      )}
      {state.success && (
        <div className="flex items-center gap-2 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Contact info updated across the whole site.
        </div>
      )}

      <div>
        <Label htmlFor="contactName">Contact Person Name</Label>
        <Input id="contactName" name="contactName" defaultValue={content.contactName} required />
      </div>
      <div>
        <Label htmlFor="contactPhone">Phone Number</Label>
        <Input id="contactPhone" name="contactPhone" defaultValue={content.contactPhone} required />
      </div>
      <div>
        <Label htmlFor="contactEmail">Email Address</Label>
        <Input id="contactEmail" name="contactEmail" type="email" defaultValue={content.contactEmail} required />
      </div>
      <div>
        <Label htmlFor="contactAddress">Address / Location</Label>
        <Textarea id="contactAddress" name="contactAddress" defaultValue={content.contactAddress} required />
      </div>

      <SubmitButton />
    </form>
  );
}
