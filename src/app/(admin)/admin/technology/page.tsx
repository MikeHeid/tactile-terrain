import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/admin-shell";
import { TechnologyManager } from "@/components/admin/technology-manager";

export const dynamic = "force-dynamic";

export default async function AdminTechnologyPage() {
  const sections = await prisma.technologySection.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <AdminShell>
      <TechnologyManager sections={sections} />
    </AdminShell>
  );
}
