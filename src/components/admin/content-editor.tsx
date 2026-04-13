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
  studio_region: "Studio — Region Name",
  studio_location: "Studio — Full Location",
  etsy_url: "Studio — Etsy Store URL",
  etsy_label: "Studio — Etsy Link Text",
  footer_tagline: "Footer — Tagline",
  resend_api_key: "Email — Resend API Key",
  notification_email: "Email — Send Notifications To",
  email_from_address: "Email — From Address",
  admin_password: "Admin — Primary Password",
  admin_extra_passwords: "Admin — Additional Passwords (one per line)",
  studio_map_image: "Studio — Map Image URL",
  studio_map_url: "Studio — Map Link (click destination)",
};

// Keys that should use a single-line input instead of textarea
const singleLineKeys = new Set([
  "studio_region",
  "studio_location",
  "etsy_url",
  "etsy_label",
  "resend_api_key",
  "notification_email",
  "email_from_address",
  "admin_password",
  "studio_map_image",
  "studio_map_url",
]);

// Keys that should use password masking
const passwordKeys = new Set([
  "resend_api_key",
  "admin_password",
]);

// Keys managed by dedicated admin pages — hide from text editor
const hiddenKeys = new Set([
  "about_hero_images",
]);

export function ContentEditor({
  content: initialContent,
}: {
  content: SiteContent[];
}) {
  const router = useRouter();
  const [entries, setEntries] = useState(
    initialContent.filter((e) => !hiddenKeys.has(e.key))
  );
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  function updateEntry(key: string, value: string) {
    setEntries((prev) =>
      prev.map((e) => (e.key === key ? { ...e, content: value } : e))
    );
  }

  function toggleReveal(key: string) {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
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

  const inputClass =
    "w-full bg-white border border-border rounded-md px-4 py-2.5 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors";

  return (
    <div className="max-w-3xl space-y-6">
      {entries.map((entry) => {
        const isSingleLine = singleLineKeys.has(entry.key);
        const isPassword = passwordKeys.has(entry.key);
        const isRevealed = revealed.has(entry.key);

        return (
          <div key={entry.key} className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                {labels[entry.key] || entry.key}
              </label>
              <div className="flex items-center gap-2">
                {isPassword && (
                  <button
                    type="button"
                    onClick={() => toggleReveal(entry.key)}
                    className="text-xs text-muted hover:text-foreground transition-colors"
                  >
                    {isRevealed ? "Hide" : "Show"}
                  </button>
                )}
                {saved === entry.key && (
                  <span className="flex items-center gap-1 text-xs text-green-500">
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

            {isSingleLine ? (
              <input
                type={isPassword && !isRevealed ? "password" : "text"}
                value={entry.content}
                onChange={(e) => updateEntry(entry.key, e.target.value)}
                className={inputClass}
              />
            ) : (
              <textarea
                value={entry.content}
                onChange={(e) => updateEntry(entry.key, e.target.value)}
                rows={entry.key === "admin_extra_passwords" ? 4 : 6}
                className={`${inputClass} resize-y`}
              />
            )}
          </div>
        );
      })}

      {entries.length === 0 && (
        <p className="text-center text-muted py-12">
          No site content entries yet. Run the seed script to populate initial content.
        </p>
      )}
    </div>
  );
}
