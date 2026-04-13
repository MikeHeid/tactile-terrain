"use client";

import { AdminShell } from "@/components/admin/admin-shell";
import { GalleryForm } from "@/components/admin/gallery-form";

export default function NewGalleryItemPage() {
  return (
    <AdminShell>
      <h1 className="text-2xl font-bold font-[family-name:var(--font-space-grotesk)] mb-8">
        New Gallery Item
      </h1>
      <GalleryForm />
    </AdminShell>
  );
}
