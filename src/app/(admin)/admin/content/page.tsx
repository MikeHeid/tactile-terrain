import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/admin-shell";
import { ContentEditor } from "@/components/admin/content-editor";
export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const content = await prisma.siteContent.findMany({
    orderBy: { key: "asc" },
  });

  return (
    <AdminShell>
      <h1 className="text-2xl font-bold font-[family-name:var(--font-space-grotesk)] mb-8">
        Site Content
      </h1>
      <ContentEditor content={content} />
    </AdminShell>
  );
}
