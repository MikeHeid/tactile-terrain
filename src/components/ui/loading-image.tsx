"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

type LoadingImageProps = Omit<ImageProps, "onLoad"> & {
  containerClassName?: string;
};

export function LoadingImage({ containerClassName, className, alt, ...props }: LoadingImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      {/* Shimmer skeleton */}
      {!loaded && (
        <div className="absolute inset-0 skeleton-shimmer" />
      )}

      <Image
        {...props}
        alt={alt}
        className={cn(
          "transition-all duration-500",
          loaded ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-sm scale-[1.02]",
          className
        )}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
