"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/admin/image-uploader";
import { Plus, Trash2, User } from "lucide-react";
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

export function TeamManager({ members: initialMembers }: TeamManagerProps) {
  const router = useRouter();
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    role: "",
    company: "",
    imageUrl: "",
  });

  async function handleAdd() {
    if (!newMember.name || !newMember.role) return;
    setSaving(true);

    await fetch("/api/admin/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMember),
    });

    setNewMember({ name: "", role: "", company: "", imageUrl: "" });
    setShowAdd(false);
    setSaving(false);
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

  return (
    <div className="max-w-3xl">
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(member.id)}
              className="text-red-400 hover:text-red-300"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {showAdd ? (
        <div className="p-4 rounded-lg bg-surface border border-border space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Name"
              value={newMember.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewMember({ ...newMember, name: e.target.value })
              }
              required
            />
            <FormField
              label="Role"
              value={newMember.role}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewMember({ ...newMember, role: e.target.value })
              }
              required
            />
          </div>
          <FormField
            label="Company"
            value={newMember.company}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewMember({ ...newMember, company: e.target.value })
            }
          />
          {newMember.imageUrl ? (
            <div className="relative w-20 h-20 rounded-full overflow-hidden">
              <Image src={newMember.imageUrl} alt="Preview" fill className="object-cover" />
            </div>
          ) : (
            <ImageUploader
              onUploaded={(url) => setNewMember({ ...newMember, imageUrl: url })}
            />
          )}
          <div className="flex gap-3">
            <Button onClick={handleAdd} disabled={saving}>
              {saving ? "Saving..." : "Add Member"}
            </Button>
            <Button variant="ghost" onClick={() => setShowAdd(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button variant="secondary" onClick={() => setShowAdd(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Team Member
        </Button>
      )}
    </div>
  );
}
