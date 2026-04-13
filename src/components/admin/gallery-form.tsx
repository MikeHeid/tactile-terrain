"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/admin/image-uploader";
import { X } from "lucide-react";

interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  sortOrder: number;
}

interface GalleryItemData {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  scale: string | null;
  year: string | null;
  location: string | null;
  sortOrder: number;
  featured: boolean;
  images: GalleryImage[];
}

const categories = [
  { value: "Government", label: "Government" },
  { value: "Conservation", label: "Conservation" },
  { value: "Installation", label: "Installation" },
  { value: "Personal", label: "Personal" },
];

export function GalleryForm({ item }: { item?: GalleryItemData }) {
  const router = useRouter();
  const [images, setImages] = useState<{ url: string; alt: string }[]>(
    item?.images?.map((img) => ({ url: img.url, alt: img.alt })) || []
  );
  const [featured, setFeatured] = useState(item?.featured || false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleImageUploaded(url: string) {
    setImages((prev) => [...prev, { url, alt: "" }]);
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      scale: formData.get("scale") as string || undefined,
      year: formData.get("year") as string || undefined,
      location: formData.get("location") as string || undefined,
      sortOrder: parseInt(formData.get("sortOrder") as string) || 0,
      featured,
      images,
    };

    try {
      const url = item ? `/api/admin/gallery/${item.id}` : "/api/admin/gallery";
      const method = item ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Failed to save");
      }

      router.push("/admin/gallery");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Title"
          name="title"
          required
          defaultValue={item?.title}
          placeholder="Project title"
        />
        <FormField
          label="Slug"
          name="slug"
          required
          defaultValue={item?.slug}
          placeholder="project-title"
        />
      </div>

      <FormField
        label="Description"
        name="description"
        as="textarea"
        required
        defaultValue={item?.description}
        placeholder="Full project description..."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField
          label="Category"
          name="category"
          as="select"
          required
          defaultValue={item?.category}
          options={categories}
        />
        <FormField label="Scale" name="scale" defaultValue={item?.scale || ""} placeholder="e.g., 1:20000" />
        <FormField label="Year" name="year" defaultValue={item?.year || ""} placeholder="e.g., 2022" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Location" name="location" defaultValue={item?.location || ""} placeholder="e.g., British Columbia" />
        <FormField label="Sort Order" name="sortOrder" type="number" defaultValue={String(item?.sortOrder || 0)} />
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="w-4 h-4 rounded border-border bg-surface text-accent focus:ring-accent"
        />
        <span className="text-sm font-medium">Featured on homepage</span>
      </label>

      {/* Image management */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-3">
          Images
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {images.map((img, i) => (
            <div key={i} className="relative group aspect-[4/3] rounded-lg overflow-hidden bg-surface">
              <Image src={img.url} alt={img.alt || "Gallery image"} fill className="object-cover" sizes="200px" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 p-1 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
        <ImageUploader onUploaded={handleImageUploaded} />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : item ? "Update Project" : "Create Project"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
