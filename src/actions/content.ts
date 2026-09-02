"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized: admin login required");
}

export interface ContentFormState {
  success: boolean;
  error?: string;
}

/** Updates homepage hero, about section, services intro and SEO fields. */
export async function updateSiteContent(
  _prevState: ContentFormState,
  formData: FormData
): Promise<ContentFormState> {
  await requireAdmin();

  const companyName = String(formData.get("companyName") || "").trim();
  const logoUrl = String(formData.get("logoUrl") || "").trim();
  const visionText = String(formData.get("visionText") || "").trim();
  const missionText = String(formData.get("missionText") || "").trim();
  const promiseText = String(formData.get("promiseText") || "").trim();
  const heroTitle = String(formData.get("heroTitle") || "").trim();
  const heroSubtitle = String(formData.get("heroSubtitle") || "").trim();
  const heroImageUrl = String(formData.get("heroImageUrl") || "").trim();
  const aboutTitle = String(formData.get("aboutTitle") || "").trim();
  const aboutText = String(formData.get("aboutText") || "").trim();
  const aboutImageUrl = String(formData.get("aboutImageUrl") || "").trim();
  const servicesIntro = String(formData.get("servicesIntro") || "").trim();
  const seoTitle = String(formData.get("seoTitle") || "").trim();
  const seoDescription = String(formData.get("seoDescription") || "").trim();
  const seoKeywords = String(formData.get("seoKeywords") || "").trim();
  const statMachines = Number(formData.get("statMachines") || 500);
  const statClients = Number(formData.get("statClients") || 150);
  const statYears = Number(formData.get("statYears") || 10);
  const statRetention = Number(formData.get("statRetention") || 98);
  const paperCutTitle = String(formData.get("paperCutTitle") || "").trim();
  const paperCutText = String(formData.get("paperCutText") || "").trim();

  if (!companyName || !heroTitle || !heroSubtitle) {
    return { success: false, error: "Company name, hero title and subtitle are required." };
  }

  const data = {
    companyName,
    logoUrl,
    visionText,
    missionText,
    promiseText,
    heroTitle,
    heroSubtitle,
    heroImageUrl,
    aboutTitle,
    aboutText,
    aboutImageUrl,
    servicesIntro,
    seoTitle,
    seoDescription,
    seoKeywords,
    statMachines,
    statClients,
    statYears,
    statRetention,
    paperCutTitle,
    paperCutText,
  };

  await prisma.siteContent.upsert({
    where: { id: "main" },
    update: data,
    create: { id: "main", ...data },
  });

  // Every public page reads SiteContent, so revalidate the whole site.
  revalidatePath("/", "layout");

  return { success: true };
}

/** Updates only the contact-details section (phone, email, address, contact person). */
export async function updateContactInfo(
  _prevState: ContentFormState,
  formData: FormData
): Promise<ContentFormState> {
  await requireAdmin();

  const contactName = String(formData.get("contactName") || "").trim();
  const contactPhone = String(formData.get("contactPhone") || "").trim();
  const contactEmail = String(formData.get("contactEmail") || "").trim();
  const contactAddress = String(formData.get("contactAddress") || "").trim();

  if (!contactName || !contactPhone || !contactEmail || !contactAddress) {
    return { success: false, error: "All contact fields are required." };
  }

  await prisma.siteContent.upsert({
    where: { id: "main" },
    update: { contactName, contactPhone, contactEmail, contactAddress },
    create: { id: "main", contactName, contactPhone, contactEmail, contactAddress },
  });

  revalidatePath("/", "layout");

  return { success: true };
}
