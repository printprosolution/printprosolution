"use client";

import { useState, useTransition } from "react";
import type { ContactMessage } from "@prisma/client";
import { markMessageRead, deleteMessage } from "@/actions/messages";
import { formatDate } from "@/lib/utils";
import { Trash2, Mail, MailOpen, X } from "lucide-react";

export function MessagesTable({ messages }: { messages: ContactMessage[] }) {
  const [isPending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [openMessage, setOpenMessage] = useState<ContactMessage | null>(null);

  function handleMarkRead(id: string) {
    setBusyId(id);
    startTransition(async () => {
      await markMessageRead(id);
      setBusyId(null);
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this message?")) return;
    setBusyId(id);
    startTransition(async () => {
      await deleteMessage(id);
      setBusyId(null);
    });
  }

  function openFull(m: ContactMessage) {
    setOpenMessage(m);
    if (!m.read) handleMarkRead(m.id);
  }

  if (messages.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500">
        No contact form submissions yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email / Phone</th>
            <th className="px-4 py-3">Message</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {messages.map((m) => (
            <tr
              key={m.id}
              className={`cursor-pointer hover:bg-slate-50 ${m.read ? "" : "bg-primary-50/30"}`}
              onClick={() => openFull(m)}
            >
              <td className="whitespace-nowrap px-4 py-3 text-slate-500">{formatDate(m.createdAt)}</td>
              <td className="px-4 py-3 font-medium text-slate-900">{m.name}</td>
              <td className="px-4 py-3 text-slate-600">
                <div>{m.email}</div>
                {m.phone && <div className="text-xs text-slate-400">{m.phone}</div>}
              </td>
              <td className="max-w-xs px-4 py-3 text-slate-600">
                <p className="line-clamp-2">{m.message}</p>
                <span className="text-xs font-medium text-primary-600">Tap to read full message</span>
              </td>
              <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleMarkRead(m.id)}
                    disabled={isPending && busyId === m.id}
                    className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-primary-600"
                    aria-label={m.read ? "Read" : "Mark as read"}
                    title={m.read ? "Already read" : "Mark as read"}
                  >
                    {m.read ? <MailOpen className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => handleDelete(m.id)}
                    disabled={isPending && busyId === m.id}
                    className="rounded-md p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {openMessage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpenMessage(null)}
        >
          <div
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">Message from {openMessage.name}</h2>
              <button
                onClick={() => setOpenMessage(null)}
                className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4 p-6">
              <div className="text-sm text-slate-500">
                {formatDate(openMessage.createdAt)}
              </div>
              <div className="space-y-1 text-sm">
                <p><span className="font-semibold text-slate-700">Email:</span> {openMessage.email}</p>
                {openMessage.phone && (
                  <p><span className="font-semibold text-slate-700">Phone:</span> {openMessage.phone}</p>
                )}
              </div>
              <div className="rounded-md bg-slate-50 p-4 text-sm leading-relaxed text-slate-800 whitespace-pre-wrap">
                {openMessage.message}
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    handleDelete(openMessage.id);
                    setOpenMessage(null);
                  }}
                  className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" /> Delete Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
