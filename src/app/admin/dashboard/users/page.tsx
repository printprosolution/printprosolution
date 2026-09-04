import { prisma } from "@/lib/prisma";
import { UsersTable } from "@/components/admin/users-table";
import { AutoRefresh } from "@/components/admin/auto-refresh";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({ orderBy: { lastActiveAt: "desc" } });
  const onlineCount = users.filter(
    (u) => !u.banned && u.lastActiveAt && Date.now() - new Date(u.lastActiveAt).getTime() < 45000
  ).length;

  return (
    <div>
      <AutoRefresh />
      <h1 className="mb-1 text-2xl font-bold text-slate-900">Online Users</h1>
      <p className="mb-6 text-sm text-slate-500">
        {onlineCount} online now · {users.length} total registered users. Updates automatically every 10 seconds.
      </p>
      <UsersTable users={users} />
    </div>
  );
}
