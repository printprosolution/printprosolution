"use client";

import { useFormState, useFormStatus } from "react-dom";
import { submitContactMessage, type ContactFormState } from "@/actions/messages";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle } from "lucide-react";

const initialState: ContactFormState = { success: false };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? "Sending..." : "Send Message"}
    </Button>
  );
}

export function ContactForm({ defaultMessage }: { defaultMessage?: string } = {}) {
  const [state, formAction] = useFormState(submitContactMessage, initialState);

  return (
    <form action={formAction} className="space-y-5">
      {state.success && (
        <div className="flex items-center gap-2 rounded-md bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          Thank you! Your message has been sent — we&apos;ll get back to you shortly.
        </div>
      )}
      {state.error && (
        <div className="flex items-center gap-2 rounded-md bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          {state.error}
        </div>
      )}

      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" name="name" placeholder="Your name" required />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="you@company.com" required />
        </div>
        <div>
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input id="phone" name="phone" placeholder="03XX-XXXXXXX" />
        </div>
      </div>
      <div>
        <Label htmlFor="type">What is this about?</Label>
        <select
          id="type"
          name="type"
          defaultValue="General Inquiry"
          className="flex h-11 w-full rounded-md border border-input bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
        >
          <option>General Inquiry</option>
          <option>Sales / Get a Quote</option>
          <option>Support / Complaint</option>
          <option>Print Quota Inquiry</option>
        </select>
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Tell us what you need — e.g. number of copiers, monthly page volume, location..."
          defaultValue={defaultMessage}
          required
        />
      </div>
      <SubmitButton />
    </form>
  );
}
