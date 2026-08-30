"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Implements the "secret" admin entry point: printprolahore.com#admin
 *
 * IMPORTANT technical note (worth understanding, not a bug):
 * URL hash fragments (everything after "#") are NEVER sent to the server —
 * browsers strip them before making the HTTP request. That means a real
 * Next.js server route can never see "#admin" directly. This component
 * solves that the standard way real sites do it: it runs in the browser,
 * reads window.location.hash after the page has loaded, and if it matches
 * "#admin" it pushes the visitor to the real (server-protected) /admin
 * route. Security still lives entirely on the server via NextAuth +
 * middleware.ts — this component is only a convenience redirect, not the
 * security boundary.
 *
 * Mounted once in the root layout so it works from any page
 * (e.g. printprolahore.com/#admin or printprolahore.com/about#admin).
 */
export function AdminHashRedirect() {
  const router = useRouter();

  useEffect(() => {
    function checkHash() {
      if (window.location.hash.toLowerCase() === "#admin") {
        router.push("/admin");
      }
    }

    checkHash(); // handle the hash already being present on first load
    window.addEventListener("hashchange", checkHash);
    return () => window.removeEventListener("hashchange", checkHash);
  }, [router]);

  return null;
}
