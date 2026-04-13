import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { GalleryGrid } from "@/components/gallery/gallery-grid";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Explore our portfolio of 3D topographic maps and landscape models — from national park installations to custom commissions.",
};

export default async function GalleryPage() {
  const items = await prisma.galleryItem.findMany({
    include: { images: { orderBy: { sortOrder: "asc" } } },
    orderBy: { sortOrder: "asc" },
  });

  const categories = [...new Set(items.map((item) => item.category))].sort();

  return (
    <div className="pt-24 pb-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-[family-name:var(--font-space-grotesk)]">
            Our Work
          </h1>
          <p className="mt-4 text-lg text-muted max-w-2xl">
            A portfolio of 3D topographic maps and landscape models crafted for
            parks, museums, conservation groups, and private commissions.
          </p>
        </div>

        <GalleryGrid items={items} categories={categories} />
      </div>
    </div>
  );
}
