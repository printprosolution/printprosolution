"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createTestimonial, type TestimonialFormState } from "@/actions/testimonials";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/admin/image-uploader";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useEffect, useRef } from "react";

const initialState: TestimonialFormState = { success: false };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Adding..." : "Add Testimonial"}
    </Button>
  );
}

export function TestimonialForm() {
  const [state, formAction] = useFormState(createTestimonial, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      {state.error && (
        <div className="flex items-center gap-2 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.error}
        </div>
      )}
      {state.success && (
        <div className="flex items-center gap-2 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Testimonial added.
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Client Name</Label>
          <Input id="name" name="name" required />
        </div>
        <div>
          <Label htmlFor="company">Company / Title</Label>
          <Input id="company" name="company" placeholder="e.g. Operations Manager, ABC Bank" required />
        </div>
      </div>

      <div>
        <Label htmlFor="message">Testimonial Message</Label>
        <Textarea id="message" name="message" required />
      </div>

      <div>
        <Label htmlFor="rating">Rating (1-5)</Label>
        <select
          id="rating"
          name="rating"
          defaultValue="5"
          className="flex h-11 w-full rounded-md border border-input bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 sm:w-40"
        >
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>{r} Stars</option>
          ))}
        </select>
      </div>

      <ImageUploader name="imageUrl" label="Client Photo (optional)" />

      <SubmitButton />
    </form>
  );
}
