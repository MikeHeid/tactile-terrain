"use client";

import { useState, type FormEvent } from "react";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { Upload, CheckCircle } from "lucide-react";

const projectTypes = [
  { value: "government", label: "Government / Parks Installation" },
  { value: "hotel", label: "Hotel / Hospitality" },
  { value: "conservation", label: "Conservation / Environmental" },
  { value: "data-viz", label: "Data Visualization" },
  { value: "art", label: "Art Commission / Gallery" },
  { value: "personal", label: "Personal / Gift" },
  { value: "other", label: "Other" },
];

const budgetRanges = [
  { value: "under-5k", label: "Under $5,000 CAD" },
  { value: "5k-15k", label: "$5,000 - $15,000 CAD" },
  { value: "15k-50k", label: "$15,000 - $50,000 CAD" },
  { value: "50k-plus", label: "$50,000+ CAD" },
  { value: "unsure", label: "Not sure yet" },
];

export function InquiryForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [file, setFile] = useState<File | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    if (file) {
      formData.set("file", file);
    }

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Submission failed");
    }
  }

  if (status === "success") {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold font-[family-name:var(--font-space-grotesk)] mb-2">
          Inquiry Submitted
        </h3>
        <p className="text-muted">
          Thank you for your interest. We&apos;ll review your project details and
          get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Name" name="name" required placeholder="Your full name" />
        <FormField label="Email" name="email" type="email" required placeholder="you@example.com" />
      </div>

      <FormField label="Organization" name="organization" placeholder="Company or institution (optional)" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Project Type"
          name="projectType"
          as="select"
          required
          options={projectTypes}
        />
        <FormField
          label="Budget Range"
          name="budgetRange"
          as="select"
          options={budgetRanges}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Scale / Size" name="scale" placeholder="e.g., 3×4 ft, 1:20000" />
        <FormField label="Timeline" name="timeline" placeholder="e.g., 6 months, Q3 2026" />
      </div>

      <FormField
        label="Project Description"
        name="description"
        as="textarea"
        required
        placeholder="Tell us about the landscape, intended audience, interpretive elements, and any special requirements..."
      />

      {/* File upload */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-foreground">
          Reference File <span className="text-muted">(optional)</span>
        </label>
        <div
          className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-accent/50 transition-colors"
          onClick={() => document.getElementById("file-input")?.click()}
        >
          <Upload className="w-6 h-6 text-muted mx-auto mb-2" />
          {file ? (
            <p className="text-sm text-foreground">{file.name}</p>
          ) : (
            <p className="text-sm text-muted">
              Click to upload a reference map, brief, or image
            </p>
          )}
          <input
            id="file-input"
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png,.tiff,.doc,.docx"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>
      </div>

      {errorMsg && <p className="text-red-400 text-sm">{errorMsg}</p>}

      <Button type="submit" size="lg" disabled={status === "submitting"}>
        {status === "submitting" ? "Submitting..." : "Submit Inquiry"}
      </Button>
    </form>
  );
}
