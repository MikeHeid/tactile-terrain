"use client";

import Image from "next/image";
import { AnimatedSection } from "@/components/ui/animated-section";
import { User } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  company: string | null;
  imageUrl: string | null;
}

interface TeamGridProps {
  members: TeamMember[];
}

export function TeamGrid({ members }: TeamGridProps) {
  if (members.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {members.map((member, i) => (
        <AnimatedSection key={member.id} delay={i * 0.08}>
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-surface border border-border">
              {member.imageUrl ? (
                <Image
                  src={member.imageUrl}
                  alt={member.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-10 h-10 text-muted" />
                </div>
              )}
            </div>
            <h3 className="font-semibold text-sm font-[family-name:var(--font-space-grotesk)]">
              {member.name}
            </h3>
            <p className="text-xs text-muted mt-1">{member.role}</p>
            {member.company && (
              <p className="text-xs text-muted/60 mt-0.5">{member.company}</p>
            )}
          </div>
        </AnimatedSection>
      ))}
    </div>
  );
}
