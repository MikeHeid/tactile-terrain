"use client";

import { useEffect, useCallback, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, MapPin } from "lucide-react";

interface LightboxImage {
  url: string;
  alt: string;
}

interface LightboxProps {
  images: LightboxImage[];
  initialIndex?: number;
  title?: string;
  description?: string;
  metadata?: { label: string; value: string }[];
  onClose: () => void;
}

export function Lightbox({
  images,
  initialIndex = 0,
  title,
  description,
  metadata,
  onClose,
}: LightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const hasImages = images.length > 0;

  const next = useCallback(() => {
    if (hasImages) setIndex((i) => (i + 1) % images.length);
  }, [images.length, hasImages]);

  const prev = useCallback(() => {
    if (hasImages) setIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length, hasImages]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, next, prev]);

  const current = hasImages ? images[index] : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl max-h-[90vh] mx-4 flex flex-col md:flex-row gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image area */}
        {current ? (
          <div className="relative flex-1 min-h-[300px] md:min-h-[500px]">
            <Image
              src={current.url}
              alt={current.alt || title || "Gallery image"}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 70vw"
              priority
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors text-white"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors text-white"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/60 rounded-full text-sm text-white/70">
                {index + 1} / {images.length}
              </div>
            )}
          </div>
        ) : (
          /* No images — show placeholder */
          <div className="flex-1 min-h-[300px] md:min-h-[400px] flex items-center justify-center rounded-lg bg-white/5">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-white/30 mx-auto mb-3" />
              <p className="text-white/50 text-sm">No images available yet</p>
            </div>
          </div>
        )}

        {/* Info panel */}
        {(title || description) && (
          <div className="md:w-80 p-6 bg-white rounded-lg overflow-y-auto max-h-[40vh] md:max-h-[80vh]">
            {title && (
              <h3 className="text-xl font-bold font-[family-name:var(--font-space-grotesk)] text-[#1A1D24] mb-3">
                {title}
              </h3>
            )}
            {metadata && metadata.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {metadata.map((m) => (
                  <span
                    key={m.label}
                    className="text-xs px-2 py-1 bg-[#EDF0F4] rounded text-[#1A1D24]"
                  >
                    {m.label}: {m.value}
                  </span>
                ))}
              </div>
            )}
            {description && (
              <p className="text-sm text-[#6B7589] leading-relaxed">{description}</p>
            )}
          </div>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 md:top-0 md:-right-12 p-2 hover:bg-white/10 rounded-full transition-colors text-white"
          aria-label="Close lightbox"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
