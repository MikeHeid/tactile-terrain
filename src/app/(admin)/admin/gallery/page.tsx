import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/admin-shell";
import { GalleryManager } from "@/components/admin/gallery-manager";
export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const items = await prisma.galleryItem.findMany({
    include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <AdminShell>
      <GalleryManager items={items} />
    </AdminShell>
  );
}
