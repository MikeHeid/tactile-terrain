"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/admin/image-uploader";
import { Plus, Trash2, CheckCircle } from "lucide-react";

interface AboutImage {
  url: string;
  alt: string;
}

export function AboutImagesManager({ images: initial }: { images: AboutImage[] }) {
  const router = useRouter();
  const [images, setImages] = useState<AboutImage[]>(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [adding, setAdding] = useState(false);

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  function addImage(url: string) {
    setImages((prev) => [...prev, { url, alt: "Workshop photo" }]);
    setAdding(false);
  }

  function updateAlt(index: number, alt: string) {
    setImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, alt } : img))
    );
  }

  async function save() {
    setSaving(true);
    setSaved(false);

    await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "about_hero_images", content: JSON.stringify(images) }),
    });

    setSaving(false);
    setSaved(true);
    router.refresh();
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="max-w-4xl">
      {/* Image grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {images.map((img, i) => (
          <div key={i} className="space-y-2">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-surface-light border border-border group">
              <Image
                src={img.url}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="200px"
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
            <input
              type="text"
              value={img.alt}
              onChange={(e) => updateAlt(i, e.target.value)}
              placeholder="Alt text..."
              className="w-full text-xs bg-white border border-border rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-accent/30"
            />
          </div>
        ))}

        {/* Add button */}
        {adding ? (
          <div className="aspect-[4/3] flex items-center justify-center">
            <div className="w-full">
              <ImageUploader onUploaded={addImage} />
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="aspect-[4/3] rounded-lg border-2 border-dashed border-border hover:border-accent/50 flex flex-col items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-6 h-6 text-muted" />
            <span className="text-xs text-muted">Add Photo</span>
          </button>
        )}
      </div>

      {/* Save */}
      <div className="flex items-center gap-3">
        <Button onClick={save} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
        {saved && (
          <span className="flex items-center gap-1 text-sm text-green-500">
            <CheckCircle className="w-4 h-4" /> Saved
          </span>
        )}
      </div>
    </div>
  );
}
