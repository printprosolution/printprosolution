"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Silently refreshes server-rendered data every `intervalMs`, so the
 * Online Users list stays current without a manual page reload. */
export function AutoRefresh({ intervalMs = 10000 }: { intervalMs?: number }) {
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(() => router.refresh(), intervalMs);
    return () => clearInterval(id);
  }, [router, intervalMs]);

  return null;
}
