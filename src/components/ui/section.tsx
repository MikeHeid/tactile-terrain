import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}

export function Section({ children, className, id, style }: SectionProps) {
  return (
    <section id={id} className={cn("py-20 px-6 md:px-12", className)} style={style}>
      <div className="max-w-7xl mx-auto">{children}</div>
    </section>
  );
}

export function SectionTitle({
  children,
  subtitle,
  className,
}: {
  children: ReactNode;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-12", className)}>
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{children}</h2>
      {subtitle && (
        <p className="mt-4 text-lg text-muted max-w-2xl mx-auto">{subtitle}</p>
      )}
    </div>
  );
}
