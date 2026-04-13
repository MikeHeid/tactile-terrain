"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Lightbox } from "@/components/ui/lightbox";
import { MapPin, Calendar, Maximize2 } from "lucide-react";

interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  sortOrder: number;
}

interface GalleryItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  scale: string | null;
  year: string | null;
  location: string | null;
  images: GalleryImage[];
}

interface GalleryGridProps {
  items: GalleryItem[];
  categories: string[];
}

export function GalleryGrid({ items, categories }: GalleryGridProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const filtered = activeCategory
    ? items.filter((item) => item.category === activeCategory)
    : items;

  return (
    <>
      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-10">
        <button
          onClick={() => setActiveCategory(null)}
          className={cn(
            "px-4 py-2 text-sm rounded-full border transition-colors",
            !activeCategory
              ? "bg-accent text-white border-accent"
              : "border-border text-muted hover:text-foreground hover:border-foreground/30"
          )}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-4 py-2 text-sm rounded-full border transition-colors",
              activeCategory === cat
                ? "bg-accent text-white border-accent"
                : "border-border text-muted hover:text-foreground hover:border-foreground/30"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Uniform grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="group cursor-pointer rounded-xl overflow-hidden border border-border/40 bg-white shadow-sm hover:shadow-lg transition-all duration-300"
            onClick={() => setLightboxItem(item)}
          >
            {/* Image — fixed aspect ratio */}
            <div className="relative aspect-[4/3] overflow-hidden" style={{ background: "#EDF0F4" }}>
              {item.images[0] ? (
                <>
                  <Image
                    src={item.images[0].url}
                    alt={item.images[0].alt || item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading="lazy"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <Maximize2 className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <MapPin className="w-10 h-10 text-[#D4D9E2]" />
                </div>
              )}

              {/* Image count badge */}
              {item.images.length > 1 && (
                <div className="absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-medium text-white" style={{ background: "rgba(0,0,0,0.5)" }}>
                  {item.images.length} photos
                </div>
              )}
            </div>

            {/* Card info — always visible */}
            <div className="p-4">
              {/* Category badge */}
              <span
                className="inline-block text-xs font-medium uppercase tracking-wider px-2 py-0.5 rounded-full mb-2"
                style={{ background: "#EDF0F4", color: "#2D7A9C" }}
              >
                {item.category}
              </span>

              <h3 className="text-base font-semibold font-[family-name:var(--font-space-grotesk)] leading-tight" style={{ color: "#1A1D24" }}>
                {item.title}
              </h3>

              {/* Metadata row */}
              <div className="flex items-center gap-3 mt-2 text-xs" style={{ color: "#6B7589" }}>
                {item.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {item.location}
                  </span>
                )}
                {item.year && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {item.year}
                  </span>
                )}
                {item.scale && (
                  <span>{item.scale}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center py-16" style={{ color: "#6B7589" }}>
          No projects found in this category.
        </p>
      )}

      {/* Lightbox */}
      {lightboxItem && (
        <Lightbox
          images={lightboxItem.images.map((img) => ({
            url: img.url,
            alt: img.alt || lightboxItem.title,
          }))}
          title={lightboxItem.title}
          description={lightboxItem.description}
          metadata={[
            ...(lightboxItem.scale ? [{ label: "Scale", value: lightboxItem.scale }] : []),
            ...(lightboxItem.year ? [{ label: "Year", value: lightboxItem.year }] : []),
            ...(lightboxItem.location ? [{ label: "Location", value: lightboxItem.location }] : []),
          ]}
          onClose={() => setLightboxItem(null)}
        />
      )}
    </>
  );
}
