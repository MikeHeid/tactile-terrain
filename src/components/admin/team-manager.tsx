"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/admin/image-uploader";
import { Plus, Pencil, Trash2, User, X, Check } from "lucide-react";
import Image from "next/image";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  company: string | null;
  imageUrl: string | null;
  sortOrder: number;
}

interface TeamManagerProps {
  members: TeamMember[];
}

type MemberForm = { name: string; role: string; company: string; imageUrl: string };

const emptyForm: MemberForm = { name: "", role: "", company: "", imageUrl: "" };

export function TeamManager({ members: initialMembers }: TeamManagerProps) {
  const router = useRouter();
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<MemberForm>(emptyForm);

  function startEdit(member: TeamMember) {
    setEditing(member.id);
    setCreating(false);
    setForm({
      name: member.name,
      role: member.role,
      company: member.company || "",
      imageUrl: member.imageUrl || "",
    });
  }

  function startCreate() {
    setCreating(true);
    setEditing(null);
    setForm(emptyForm);
  }

  function cancel() {
    setEditing(null);
    setCreating(false);
    setForm(emptyForm);
  }

  async function handleSave() {
    if (!form.name || !form.role) return;
    setSaving(true);

    if (creating) {
      await fetch("/api/admin/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else if (editing) {
      await fetch("/api/admin/team", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editing, ...form }),
      });
    }

    setSaving(false);
    cancel();
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this team member?")) return;
    await fetch("/api/admin/team", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    router.refresh();
  }

  const isFormOpen = editing || creating;

  return (
    <div className="max-w-3xl">
      {/* Edit / Create form */}
      {isFormOpen && (
        <div className="mb-6 p-5 rounded-lg bg-surface border border-border space-y-4">
          <h3 className="text-sm font-semibold">
            {creating ? "New Team Member" : "Edit Member"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Name"
              value={form.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setForm({ ...form, name: e.target.value })
              }
              required
            />
            <FormField
              label="Role"
              value={form.role}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setForm({ ...form, role: e.target.value })
              }
              required
            />
          </div>
          <FormField
            label="Company"
            value={form.company}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setForm({ ...form, company: e.target.value })
            }
          />
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Photo</label>
            {form.imageUrl ? (
              <div className="flex items-center gap-3">
                <div className="relative w-16 h-16 rounded-full overflow-hidden">
                  <Image src={form.imageUrl} alt="Preview" fill className="object-cover" sizes="64px" />
                </div>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, imageUrl: "" })}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  <X className="w-4 h-4 inline mr-1" />Remove
                </button>
              </div>
            ) : (
              <ImageUploader
                onUploaded={(url) => setForm({ ...form, imageUrl: url })}
              />
            )}
          </div>
          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={saving}>
              <Check className="w-4 h-4 mr-2" />
              {saving ? "Saving..." : creating ? "Add Member" : "Save Changes"}
            </Button>
            <Button variant="ghost" onClick={cancel}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Member list */}
      <div className="space-y-3 mb-6">
        {initialMembers.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-4 p-4 rounded-lg bg-surface border border-border"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-light shrink-0">
              {member.imageUrl ? (
                <Image src={member.imageUrl} alt={member.name} width={40} height={40} className="object-cover w-full h-full" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-5 h-5 text-muted" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">{member.name}</p>
              <p className="text-xs text-muted">
                {member.role}
                {member.company && ` — ${member.company}`}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="ghost" size="sm" onClick={() => startEdit(member)}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(member.id)}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {!isFormOpen && (
        <Button variant="secondary" onClick={startCreate}>
          <Plus className="w-4 h-4 mr-2" /> Add Team Member
        </Button>
      )}
    </div>
  );
}
