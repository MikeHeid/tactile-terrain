import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/admin-shell";
import { AboutImagesManager } from "@/components/admin/about-images-manager";

export const dynamic = "force-dynamic";

export default async function AdminAboutPage() {
  const heroImagesContent = await prisma.siteContent.findUnique({
    where: { key: "about_hero_images" },
  });

  let images: { url: string; alt: string }[] = [];
  try {
    images = heroImagesContent?.content ? JSON.parse(heroImagesContent.content) : [];
  } catch {
    images = [];
  }

  return (
    <AdminShell>
      <h1 className="text-2xl font-bold font-[family-name:var(--font-space-grotesk)] mb-8">
        About Page — Workshop Photos
      </h1>
      <p className="text-sm text-muted mb-6">
        These photos appear above &ldquo;Our Story&rdquo; on the About page. Drag to reorder, click to replace, or remove.
      </p>
      <AboutImagesManager images={images} />
    </AdminShell>
  );
}
