import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { GalleryForm } from "@/components/admin/gallery-form";
export const dynamic = "force-dynamic";

export default async function EditGalleryItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const item = await prisma.galleryItem.findUnique({
    where: { id },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });

  if (!item) notFound();

  return (
    <AdminShell>
      <h1 className="text-2xl font-bold font-[family-name:var(--font-space-grotesk)] mb-8">
        Edit: {item.title}
      </h1>
      <GalleryForm item={item} />
    </AdminShell>
  );
}
