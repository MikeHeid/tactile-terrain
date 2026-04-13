"use client";

import { useState, useCallback } from "react";
import { Upload, Loader2 } from "lucide-react";

interface ImageUploaderProps {
  onUploaded: (url: string) => void;
}

export function ImageUploader({ onUploaded }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const upload = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) return;
      if (file.size > 10 * 1024 * 1024) {
        alert("File must be under 10MB");
        return;
      }

      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Upload failed");

        const { url } = await res.json();
        onUploaded(url);
      } catch (err) {
        alert(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [onUploaded]
  );

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) upload(file);
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
        dragOver ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"
      }`}
      onClick={() => document.getElementById("admin-image-input")?.click()}
    >
      {uploading ? (
        <Loader2 className="w-6 h-6 text-accent mx-auto animate-spin" />
      ) : (
        <>
          <Upload className="w-6 h-6 text-muted mx-auto mb-2" />
          <p className="text-sm text-muted">
            Drop an image here or click to upload
          </p>
        </>
      )}
      <input
        id="admin-image-input"
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleChange}
        disabled={uploading}
      />
    </div>
  );
}
