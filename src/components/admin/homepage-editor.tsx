"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface HomepageContent {
  heroTagline: string;
  introText: string;
}

interface GalleryItemRef {
  id: string;
  title: string;
  featured: boolean;
}

interface HomepageEditorProps {
  content: HomepageContent | null;
  galleryItems: GalleryItemRef[];
}

export function HomepageEditor({ content, galleryItems }: HomepageEditorProps) {
  const router = useRouter();
  const [featured, setFeatured] = useState<Set<string>>(
    new Set(galleryItems.filter((g) => g.featured).map((g) => g.id))
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function toggleFeatured(id: string) {
    setFeatured((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    const formData = new FormData(e.currentTarget);

    try {
      await fetch("/api/admin/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          heroTagline: formData.get("heroTagline"),
          introText: formData.get("introText"),
          featuredIds: Array.from(featured),
        }),
      });

      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <FormField
        label="Hero Tagline"
        name="heroTagline"
        as="textarea"
        required
        defaultValue={content?.heroTagline || ""}
        placeholder="Main headline on the homepage hero..."
      />

      <FormField
        label="Introduction Text"
        name="introText"
        as="textarea"
        required
        defaultValue={content?.introText || ""}
        placeholder="Brief introduction paragraph below the hero..."
      />

      {/* Featured projects */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-3">
          Featured Projects (shown on homepage)
        </label>
        <div className="space-y-2 max-h-60 overflow-y-auto p-3 rounded-lg bg-surface border border-border">
          {galleryItems.map((item) => (
            <label key={item.id} className="flex items-center gap-3 cursor-pointer py-1">
              <input
                type="checkbox"
                checked={featured.has(item.id)}
                onChange={() => toggleFeatured(item.id)}
                className="w-4 h-4 rounded border-border bg-surface text-accent focus:ring-accent"
              />
              <span className="text-sm">{item.title}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
        {saved && (
          <span className="flex items-center gap-1 text-sm text-green-400">
            <CheckCircle className="w-4 h-4" /> Saved
          </span>
        )}
      </div>
    </form>
  );
}
