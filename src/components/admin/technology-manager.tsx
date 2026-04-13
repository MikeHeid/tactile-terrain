"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/admin/image-uploader";
import { Plus, Pencil, Trash2, GripVertical, X, Check } from "lucide-react";

interface TechSection {
  id: string;
  title: string;
  description: string;
  detail: string;
  imageUrl: string | null;
  imageAlt: string;
  badge: string | null;
  sortOrder: number;
}

interface TechnologyManagerProps {
  sections: TechSection[];
}

export function TechnologyManager({ sections }: TechnologyManagerProps) {
  const router = useRouter();
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<TechSection>>({});

  function startEdit(section: TechSection) {
    setEditing(section.id);
    setForm({ ...section });
    setCreating(false);
  }

  function startCreate() {
    setCreating(true);
    setEditing(null);
    setForm({
      title: "",
      description: "",
      detail: "",
      imageUrl: null,
      imageAlt: "",
      badge: null,
      sortOrder: sections.length,
    });
  }

  function cancel() {
    setEditing(null);
    setCreating(false);
    setForm({});
  }

  async function save() {
    if (!form.title || !form.description || !form.detail) return;
    setSaving(true);

    const url = creating ? "/api/admin/technology" : `/api/admin/technology`;
    const method = creating ? "POST" : "PUT";
    const body = creating ? form : { ...form, id: editing };

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setSaving(false);
    cancel();
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this technology section?")) return;
    await fetch("/api/admin/technology", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    router.refresh();
  }

  const isFormOpen = editing || creating;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold font-[family-name:var(--font-space-grotesk)]">
          Technology Sections
        </h1>
        {!isFormOpen && (
          <Button onClick={startCreate}>
            <Plus className="w-4 h-4 mr-2" /> New Section
          </Button>
        )}
      </div>

      {/* Edit / Create form */}
      {isFormOpen && (
        <div className="mb-8 p-6 rounded-lg bg-surface border border-border space-y-4">
          <h2 className="text-lg font-semibold">
            {creating ? "New Section" : `Editing: ${form.title}`}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Title"
              value={form.title || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setForm({ ...form, title: e.target.value })
              }
              required
            />
            <FormField
              label="Badge (optional)"
              value={form.badge || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setForm({ ...form, badge: e.target.value || null })
              }
              placeholder="e.g., Signature Technology"
            />
          </div>

          <FormField
            label="Description"
            as="textarea"
            value={form.description || ""}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setForm({ ...form, description: e.target.value })
            }
            required
          />

          <FormField
            label="Detail (shown in accent sidebar)"
            as="textarea"
            value={form.detail || ""}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setForm({ ...form, detail: e.target.value })
            }
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Image Alt Text"
              value={form.imageAlt || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setForm({ ...form, imageAlt: e.target.value })
              }
            />
            <FormField
              label="Sort Order"
              type="number"
              value={String(form.sortOrder || 0)}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })
              }
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Section Image
            </label>
            {form.imageUrl ? (
              <div className="relative w-48 h-32 rounded-lg overflow-hidden mb-3">
                <Image src={form.imageUrl} alt={form.imageAlt || ""} fill className="object-cover" sizes="192px" />
                <button
                  type="button"
                  onClick={() => setForm({ ...form, imageUrl: null })}
                  className="absolute top-1 right-1 p-1 bg-black/60 rounded-full"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ) : (
              <ImageUploader
                onUploaded={(url) => setForm({ ...form, imageUrl: url })}
              />
            )}
          </div>

          <div className="flex gap-3">
            <Button onClick={save} disabled={saving}>
              {saving ? "Saving..." : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  {creating ? "Create Section" : "Save Changes"}
                </>
              )}
            </Button>
            <Button variant="ghost" onClick={cancel}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Section list */}
      <div className="space-y-3">
        {sections.map((section) => (
          <div
            key={section.id}
            className="flex items-center gap-4 p-4 rounded-lg bg-surface border border-border"
          >
            <GripVertical className="w-4 h-4 text-muted shrink-0" />

            {/* Thumbnail */}
            <div className="relative w-20 h-14 rounded overflow-hidden bg-surface-light shrink-0">
              {section.imageUrl && (
                <Image
                  src={section.imageUrl}
                  alt={section.imageAlt || section.title}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-sm truncate">{section.title}</h3>
                {section.badge && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-accent/10 text-accent shrink-0">
                    {section.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted truncate">{section.description.slice(0, 80)}...</p>
            </div>

            {/* Sort order */}
            <span className="text-xs text-muted shrink-0">#{section.sortOrder}</span>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="ghost" size="sm" onClick={() => startEdit(section)}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(section.id)}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}

        {sections.length === 0 && (
          <p className="text-center text-muted py-12">
            No technology sections yet.
          </p>
        )}
      </div>
    </div>
  );
}
