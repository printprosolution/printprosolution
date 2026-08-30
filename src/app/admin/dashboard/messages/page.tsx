import { prisma } from "@/lib/prisma";
import { MessagesTable } from "@/components/admin/messages-table";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-slate-900">Contact Form Submissions</h1>
      <p className="mb-6 text-sm text-slate-500">
        Every message submitted through the public /contact page appears here in real time.
      </p>
      <MessagesTable messages={messages} />
    </div>
  );
}
