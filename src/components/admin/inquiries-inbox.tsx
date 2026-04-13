"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Mail, FileText, Circle, ExternalLink } from "lucide-react";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string | Date;
}

interface CustomOrderInquiry {
  id: string;
  name: string;
  email: string;
  organization: string | null;
  projectType: string;
  scale: string | null;
  timeline: string | null;
  budgetRange: string | null;
  description: string;
  fileUrl: string | null;
  read: boolean;
  createdAt: string | Date;
}

interface InquiriesInboxProps {
  contacts: ContactSubmission[];
  inquiries: CustomOrderInquiry[];
}

export function InquiriesInbox({ contacts, inquiries }: InquiriesInboxProps) {
  const router = useRouter();
  const [tab, setTab] = useState<"contacts" | "custom">("contacts");
  const [expanded, setExpanded] = useState<string | null>(null);

  async function markRead(id: string, type: "contact" | "custom") {
    await fetch(`/api/admin/inquiries/${id}/read`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    });
    router.refresh();
  }

  function toggleExpand(id: string, read: boolean, type: "contact" | "custom") {
    setExpanded(expanded === id ? null : id);
    if (!read) markRead(id, type);
  }

  const unreadContacts = contacts.filter((c) => !c.read).length;
  const unreadInquiries = inquiries.filter((i) => !i.read).length;

  return (
    <div>
      {/* Tab buttons */}
      <div className="flex gap-4 mb-6 border-b border-border">
        <button
          onClick={() => setTab("contacts")}
          className={cn(
            "flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-colors",
            tab === "contacts"
              ? "border-accent text-accent"
              : "border-transparent text-muted hover:text-foreground"
          )}
        >
          <Mail className="w-4 h-4" />
          Contact Messages
          {unreadContacts > 0 && (
            <span className="text-xs bg-accent/20 text-accent px-1.5 py-0.5 rounded-full">
              {unreadContacts}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab("custom")}
          className={cn(
            "flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-colors",
            tab === "custom"
              ? "border-accent text-accent"
              : "border-transparent text-muted hover:text-foreground"
          )}
        >
          <FileText className="w-4 h-4" />
          Custom Orders
          {unreadInquiries > 0 && (
            <span className="text-xs bg-accent/20 text-accent px-1.5 py-0.5 rounded-full">
              {unreadInquiries}
            </span>
          )}
        </button>
      </div>

      {/* Contact messages */}
      {tab === "contacts" && (
        <div className="space-y-2">
          {contacts.map((c) => (
            <div
              key={c.id}
              className={cn(
                "p-4 rounded-lg border cursor-pointer transition-colors",
                c.read
                  ? "bg-surface border-border"
                  : "bg-surface-light border-accent/30"
              )}
              onClick={() => toggleExpand(c.id, c.read, "contact")}
            >
              <div className="flex items-center gap-3">
                {!c.read && <Circle className="w-2 h-2 fill-accent text-accent shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{c.name}</span>
                    <span className="text-xs text-muted">{c.email}</span>
                  </div>
                  <p className="text-sm text-muted truncate">{c.subject}</p>
                </div>
                <span className="text-xs text-muted shrink-0">
                  {new Date(c.createdAt).toLocaleDateString()}
                </span>
              </div>
              {expanded === c.id && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-muted whitespace-pre-wrap">{c.message}</p>
                  <a
                    href={`mailto:${c.email}`}
                    className="text-sm text-accent hover:text-accent-hover mt-3 inline-block"
                  >
                    Reply to {c.email} →
                  </a>
                </div>
              )}
            </div>
          ))}
          {contacts.length === 0 && (
            <p className="text-center text-muted py-12">No contact messages yet.</p>
          )}
        </div>
      )}

      {/* Custom order inquiries */}
      {tab === "custom" && (
        <div className="space-y-2">
          {inquiries.map((inq) => (
            <div
              key={inq.id}
              className={cn(
                "p-4 rounded-lg border cursor-pointer transition-colors",
                inq.read
                  ? "bg-surface border-border"
                  : "bg-surface-light border-accent/30"
              )}
              onClick={() => toggleExpand(inq.id, inq.read, "custom")}
            >
              <div className="flex items-center gap-3">
                {!inq.read && <Circle className="w-2 h-2 fill-accent text-accent shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{inq.name}</span>
                    {inq.organization && (
                      <span className="text-xs text-muted">({inq.organization})</span>
                    )}
                  </div>
                  <p className="text-sm text-muted">{inq.projectType}</p>
                </div>
                <span className="text-xs text-muted shrink-0">
                  {new Date(inq.createdAt).toLocaleDateString()}
                </span>
              </div>
              {expanded === inq.id && (
                <div className="mt-4 pt-4 border-t border-border space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {inq.scale && (
                      <div><span className="text-xs text-muted block">Scale</span><span className="text-sm">{inq.scale}</span></div>
                    )}
                    {inq.timeline && (
                      <div><span className="text-xs text-muted block">Timeline</span><span className="text-sm">{inq.timeline}</span></div>
                    )}
                    {inq.budgetRange && (
                      <div><span className="text-xs text-muted block">Budget</span><span className="text-sm">{inq.budgetRange}</span></div>
                    )}
                    <div><span className="text-xs text-muted block">Email</span><span className="text-sm">{inq.email}</span></div>
                  </div>
                  <p className="text-sm text-muted whitespace-pre-wrap">{inq.description}</p>
                  {inq.fileUrl && (
                    <a
                      href={inq.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-accent hover:text-accent-hover inline-flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" /> View attached file
                    </a>
                  )}
                  <a
                    href={`mailto:${inq.email}`}
                    className="text-sm text-accent hover:text-accent-hover block"
                  >
                    Reply to {inq.email} →
                  </a>
                </div>
              )}
            </div>
          ))}
          {inquiries.length === 0 && (
            <p className="text-center text-muted py-12">No custom order inquiries yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
