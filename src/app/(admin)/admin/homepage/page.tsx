import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/admin-shell";
import { HomepageEditor } from "@/components/admin/homepage-editor";
export const dynamic = "force-dynamic";

export default async function AdminHomepagePage() {
  const [content, galleryItems] = await Promise.all([
    prisma.homepageContent.findUnique({ where: { id: "singleton" } }),
    prisma.galleryItem.findMany({
      select: { id: true, title: true, featured: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  return (
    <AdminShell>
      <h1 className="text-2xl font-bold font-[family-name:var(--font-space-grotesk)] mb-8">
        Homepage Content
      </h1>
      <HomepageEditor
        content={content}
        galleryItems={galleryItems}
      />
    </AdminShell>
  );
}
