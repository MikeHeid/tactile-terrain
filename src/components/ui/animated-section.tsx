"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedSection({
  children,
  className,
  delay = 0,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [jsReady, setJsReady] = useState(false);

  useEffect(() => {
    // Mark JS as hydrated — only then do we enable animation classes
    setJsReady(true);

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
          observer.unobserve(el);
        }
      },
      { rootMargin: "-60px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        // Only apply animation styles after JS hydrates — server render is always visible
        jsReady && !hasAnimated && "opacity-0 translate-y-6",
        jsReady && hasAnimated && "opacity-100 translate-y-0",
        "transition-all duration-700 ease-out",
        className
      )}
      style={{
        transitionDelay: hasAnimated ? `${delay * 1000}ms` : "0ms",
      }}
    >
      {children}
    </div>
  );
}
