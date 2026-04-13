import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/admin-shell";
import { TeamManager } from "@/components/admin/team-manager";
export const dynamic = "force-dynamic";

export default async function AdminTeamPage() {
  const members = await prisma.teamMember.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <AdminShell>
      <h1 className="text-2xl font-bold font-[family-name:var(--font-space-grotesk)] mb-8">
        Team Members
      </h1>
      <TeamManager members={members} />
    </AdminShell>
  );
}
