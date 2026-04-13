"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface SiteContent {
  id: string;
  key: string;
  content: string;
}

const labels: Record<string, string> = {
  about_story: "About — Company Story",
  about_process: "About — Process Description",
  technology_intro: "Technology — Introduction",
  custom_orders_intro: "Custom Orders — Introduction",
};

export function ContentEditor({
  content: initialContent,
}: {
  content: SiteContent[];
}) {
  const router = useRouter();
  const [entries, setEntries] = useState(initialContent);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  function updateEntry(key: string, value: string) {
    setEntries((prev) =>
      prev.map((e) => (e.key === key ? { ...e, content: value } : e))
    );
  }

  async function saveEntry(entry: SiteContent) {
    setSaving(entry.key);
    setSaved(null);

    await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: entry.key, content: entry.content }),
    });

    setSaving(null);
    setSaved(entry.key);
    router.refresh();
    setTimeout(() => setSaved(null), 3000);
  }

  return (
    <div className="max-w-3xl space-y-8">
      {entries.map((entry) => (
        <div key={entry.key} className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">
              {labels[entry.key] || entry.key}
            </label>
            <div className="flex items-center gap-2">
              {saved === entry.key && (
                <span className="flex items-center gap-1 text-xs text-green-400">
                  <CheckCircle className="w-3 h-3" /> Saved
                </span>
              )}
              <Button
                size="sm"
                onClick={() => saveEntry(entry)}
                disabled={saving === entry.key}
              >
                {saving === entry.key ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
          <textarea
            value={entry.content}
            onChange={(e) => updateEntry(entry.key, e.target.value)}
            rows={8}
            className="w-full bg-surface border border-border rounded-md px-4 py-3 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/50 resize-y"
          />
        </div>
      ))}

      {entries.length === 0 && (
        <p className="text-center text-muted py-12">
          No site content entries yet. Run the seed script to populate initial content.
        </p>
      )}
    </div>
  );
}
