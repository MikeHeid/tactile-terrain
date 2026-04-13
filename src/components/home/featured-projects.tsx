"use client";

import Image from "next/image";
import Link from "next/link";
import { Section, SectionTitle } from "@/components/ui/section";
import { AnimatedSection } from "@/components/ui/animated-section";
import { MapPin } from "lucide-react";

interface FeaturedProject {
  id: string;
  title: string;
  category: string;
  slug: string;
  images: { url: string; alt: string }[];
}

interface FeaturedProjectsProps {
  projects: FeaturedProject[];
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  if (projects.length === 0) return null;

  return (
    <Section style={{ background: "#EDF0F4" }}>
      <AnimatedSection>
        <SectionTitle subtitle="Selected works from our portfolio">
          Featured Projects
        </SectionTitle>
      </AnimatedSection>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {projects.map((project, i) => (
          <AnimatedSection key={project.id} delay={i * 0.1}>
            <Link href={`/gallery?project=${project.slug}`} className="group block">
              <div className="rounded-xl overflow-hidden border border-[#D4D9E2]/50 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden" style={{ background: "#EDF0F4" }}>
                  {project.images[0] ? (
                    <Image
                      src={project.images[0].url}
                      alt={project.images[0].alt || project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <MapPin className="w-8 h-8" style={{ color: "#D4D9E2" }} />
                    </div>
                  )}
                </div>

                {/* Info below image */}
                <div className="p-4">
                  <span
                    className="inline-block text-xs font-medium uppercase tracking-wider px-2 py-0.5 rounded-full mb-2"
                    style={{ background: "#EDF0F4", color: "#2D7A9C" }}
                  >
                    {project.category}
                  </span>
                  <h3
                    className="text-sm font-semibold font-[family-name:var(--font-space-grotesk)] leading-tight"
                    style={{ color: "#1A1D24" }}
                  >
                    {project.title}
                  </h3>
                </div>
              </div>
            </Link>
          </AnimatedSection>
        ))}
      </div>

      <AnimatedSection delay={0.3}>
        <div className="mt-10 text-center">
          <Link
            href="/gallery"
            className="text-sm font-medium transition-colors"
            style={{ color: "#2D7A9C" }}
          >
            View All Projects →
          </Link>
        </div>
      </AnimatedSection>
    </Section>
  );
}
