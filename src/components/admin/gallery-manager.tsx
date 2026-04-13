"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Star } from "lucide-react";

interface GalleryImage {
  id: string;
  url: string;
  alt: string;
}

interface GalleryItemSummary {
  id: string;
  title: string;
  slug: string;
  category: string;
  featured: boolean;
  sortOrder: number;
  images: GalleryImage[];
}

interface GalleryManagerProps {
  items: GalleryItemSummary[];
}

export function GalleryManager({ items }: GalleryManagerProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Delete this gallery item? This cannot be undone.")) return;
    setDeleting(id);
    try {
      await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold font-[family-name:var(--font-space-grotesk)]">
          Gallery Manager
        </h1>
        <Link href="/admin/gallery/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" /> New Project
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 p-4 rounded-lg bg-surface border border-border"
          >
            {/* Thumbnail */}
            <div className="relative w-16 h-12 rounded overflow-hidden bg-surface-light shrink-0">
              {item.images[0] && (
                <Image
                  src={item.images[0].url}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-sm truncate">{item.title}</h3>
                {item.featured && (
                  <Star className="w-3.5 h-3.5 text-gold fill-gold shrink-0" />
                )}
              </div>
              <p className="text-xs text-muted">{item.category}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <Link href={`/admin/gallery/${item.id}`}>
                <Button variant="ghost" size="sm">
                  <Pencil className="w-4 h-4" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(item.id)}
                disabled={deleting === item.id}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <p className="text-center text-muted py-12">
            No gallery items yet.{" "}
            <Link href="/admin/gallery/new" className="text-accent">
              Add your first project.
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
