"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { heartbeatAndCheckStatus } from "@/actions/auth-user";

const HEARTBEAT_INTERVAL_MS = 15000; // 15 seconds

/**
 * Mounted for logged-in regular users only (see (site)/layout.tsx). Every
 * 15 seconds it:
 *  1. Updates User.lastActiveAt, so the admin's Online Users list is fresh.
 *  2. Checks whether an admin has banned or force-logged-out this account,
 *     and signs the browser out immediately if so.
 */
export function PresenceHeartbeat() {
  const router = useRouter();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    async function tick() {
      try {
        const result = await heartbeatAndCheckStatus();
        if (result.shouldSignOut) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          await signOut({ redirect: false });
          router.push("/login");
          router.refresh();
        }
      } catch {
        // Network hiccup — just try again next interval.
      }
    }

    tick(); // run once immediately on mount
    intervalRef.current = setInterval(tick, HEARTBEAT_INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [router]);

  return null;
}
