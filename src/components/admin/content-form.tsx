"use client";

import { useFormState, useFormStatus } from "react-dom";
import { updateSiteContent, type ContentFormState } from "@/actions/content";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ImageUploader } from "@/components/admin/image-uploader";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import type { SiteContent } from "@prisma/client";

const initialState: ContentFormState = { success: false };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? "Saving..." : "Save Changes"}
    </Button>
  );
}

export function ContentForm({ content }: { content: SiteContent }) {
  const [state, formAction] = useFormState(updateSiteContent, initialState);

  return (
    <form action={formAction} className="space-y-8">
      {state.error && (
        <div className="flex items-center gap-2 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.error}
        </div>
      )}
      {state.success && (
        <div className="flex items-center gap-2 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Website content updated — changes are live now.
        </div>
      )}

      <Card>
        <CardHeader><CardTitle>Branding</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="companyName">Company Name</Label>
            <Input id="companyName" name="companyName" defaultValue={content.companyName} required />
          </div>
          <ImageUploader name="logoUrl" label="Company Logo" defaultValue={content.logoUrl} required />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Vision, Mission &amp; Promise</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="visionText">Our Vision</Label>
            <Textarea id="visionText" name="visionText" defaultValue={content.visionText} />
          </div>
          <div>
            <Label htmlFor="missionText">Our Mission</Label>
            <Textarea id="missionText" name="missionText" defaultValue={content.missionText} />
          </div>
          <div>
            <Label htmlFor="promiseText">Our Promise</Label>
            <Textarea id="promiseText" name="promiseText" defaultValue={content.promiseText} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Homepage Hero</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="heroTitle">Hero Title</Label>
            <Input id="heroTitle" name="heroTitle" defaultValue={content.heroTitle} required />
          </div>
          <div>
            <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
            <Textarea id="heroSubtitle" name="heroSubtitle" defaultValue={content.heroSubtitle} required />
          </div>
          <ImageUploader name="heroImageUrl" label="Hero Image" defaultValue={content.heroImageUrl} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>About Page</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="aboutTitle">About Title</Label>
            <Input id="aboutTitle" name="aboutTitle" defaultValue={content.aboutTitle} />
          </div>
          <div>
            <Label htmlFor="aboutText">About Text</Label>
            <Textarea id="aboutText" name="aboutText" rows={6} defaultValue={content.aboutText} />
          </div>
          <ImageUploader name="aboutImageUrl" label="About Image" defaultValue={content.aboutImageUrl} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Services Page Intro</CardTitle></CardHeader>
        <CardContent>
          <Textarea name="servicesIntro" defaultValue={content.servicesIntro} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Homepage Growth Stats</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="statMachines">Machines Supplied</Label>
            <Input id="statMachines" name="statMachines" type="number" min="0" defaultValue={content.statMachines} />
          </div>
          <div>
            <Label htmlFor="statClients">Business Clients</Label>
            <Input id="statClients" name="statClients" type="number" min="0" defaultValue={content.statClients} />
          </div>
          <div>
            <Label htmlFor="statYears">Years of Service</Label>
            <Input id="statYears" name="statYears" type="number" min="0" defaultValue={content.statYears} />
          </div>
          <div>
            <Label htmlFor="statRetention">Client Retention (%)</Label>
            <Input id="statRetention" name="statRetention" type="number" min="0" max="100" defaultValue={content.statRetention} />
          </div>
          <p className="col-span-2 text-xs text-slate-500">
            These numbers animate upward on the homepage when a visitor scrolls to them.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>PaperCut Highlight Section</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="paperCutTitle">Section Title</Label>
            <Input id="paperCutTitle" name="paperCutTitle" defaultValue={content.paperCutTitle} />
          </div>
          <div>
            <Label htmlFor="paperCutText">Section Text</Label>
            <Textarea id="paperCutText" name="paperCutText" rows={4} defaultValue={content.paperCutText} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="seoTitle">SEO Title (shown in Google search results)</Label>
            <Input id="seoTitle" name="seoTitle" defaultValue={content.seoTitle} />
          </div>
          <div>
            <Label htmlFor="seoDescription">SEO Description</Label>
            <Textarea id="seoDescription" name="seoDescription" defaultValue={content.seoDescription} />
          </div>
          <div>
            <Label htmlFor="seoKeywords">SEO Keywords (comma-separated)</Label>
            <Textarea
              id="seoKeywords"
              name="seoKeywords"
              defaultValue={content.seoKeywords}
              placeholder="photocopier rental Lahore, Ricoh 3510 on rent, ..."
            />
            <p className="mt-1 text-xs text-slate-500">
              Add the exact terms customers search — e.g. your company name once it&apos;s finalised,
              &quot;Ricoh 3510 on rent&quot;, &quot;Xerox printer rental for banks&quot;, &quot;printer rental for universities&quot;.
            </p>
          </div>
        </CardContent>
      </Card>

      <SubmitButton />
    </form>
  );
}
