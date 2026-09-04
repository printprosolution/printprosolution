"use client";

import { useState, useTransition } from "react";
import type { User } from "@prisma/client";
import { kickUser, banUser, unbanUser } from "@/actions/admin-users";
import { formatDate } from "@/lib/utils";
import { LogOut, Ban, ShieldCheck } from "lucide-react";

const ONLINE_THRESHOLD_MS = 45 * 1000; // heartbeat pings every 15s

function isOnline(lastActiveAt: Date | null) {
  if (!lastActiveAt) return false;
  return Date.now() - new Date(lastActiveAt).getTime() < ONLINE_THRESHOLD_MS;
}

export function UsersTable({ users }: { users: User[] }) {
  const [isPending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);

  function handleKick(id: string) {
    if (!confirm("Force logout this user? Their session will end within ~15 seconds.")) return;
    setBusyId(id);
    startTransition(async () => {
      await kickUser(id);
      setBusyId(null);
    });
  }

  function handleBan(id: string) {
    if (!confirm("Ban this user? They will be logged out and unable to login again until unbanned.")) return;
    setBusyId(id);
    startTransition(async () => {
      await banUser(id);
      setBusyId(null);
    });
  }

  function handleUnban(id: string) {
    setBusyId(id);
    startTransition(async () => {
      await unbanUser(id);
      setBusyId(null);
    });
  }

  if (users.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500">
        No registered users yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Last Active</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {users.map((u) => {
            const online = !u.banned && isOnline(u.lastActiveAt);
            const busy = isPending && busyId === u.id;
            return (
              <tr key={u.id}>
                <td className="px-4 py-3 font-medium text-slate-900">{u.name}</td>
                <td className="px-4 py-3 text-slate-600">{u.email}</td>
                <td className="px-4 py-3 text-slate-500">
                  {u.lastActiveAt ? formatDate(u.lastActiveAt) : "Never"}
                </td>
                <td className="px-4 py-3">
                  {u.banned ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600">
                      <span className="h-2 w-2 rounded-full bg-red-500" /> Banned
                    </span>
                  ) : online ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-600">
                      <span className="h-2 w-2 rounded-full bg-green-500" /> Online
                    </span>
                  ) : !u.emailVerified ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600">
                      <span className="h-2 w-2 rounded-full bg-amber-500" /> Unverified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                      <span className="h-2 w-2 rounded-full bg-slate-300" /> Offline
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    {online && (
                      <button
                        onClick={() => handleKick(u.id)}
                        disabled={busy}
                        className="flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                        title="Force Logout"
                      >
                        <LogOut className="h-3.5 w-3.5" /> Kick
                      </button>
                    )}
                    {u.banned ? (
                      <button
                        onClick={() => handleUnban(u.id)}
                        disabled={busy}
                        className="flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-50"
                      >
                        <ShieldCheck className="h-3.5 w-3.5" /> Unban
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBan(u.id)}
                        disabled={busy}
                        className="flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                      >
                        <Ban className="h-3.5 w-3.5" /> Ban
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
