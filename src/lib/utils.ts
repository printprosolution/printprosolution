import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes conditionally without class-order conflicts.
 * Standard shadcn/ui helper used across all UI components.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as PKR currency, e.g. 25000 -> "Rs. 25,000" */
export function formatPKR(amount: number) {
  return `Rs. ${amount.toLocaleString("en-PK")}`;
}

/** Turn "Ricoh MP 3054 Photocopier" into "ricoh-mp-3054-photocopier" */
export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Format a Date for the admin messages table */
export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-PK", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
