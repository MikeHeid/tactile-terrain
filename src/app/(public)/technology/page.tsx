import type { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Section, SectionTitle } from "@/components/ui/section";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Cpu } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Technology",
  description:
    "Learn about the intersection of GIS data processing, CNC fabrication, and interactive digital overlays that power Tactile Terrain's 3D maps.",
};

export default async function TechnologyPage() {
  const sections = await prisma.technologySection.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="pt-24">
      <Section>
        <AnimatedSection>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-[family-name:var(--font-space-grotesk)] mb-6">
              Our Technology
            </h1>
            <p className="text-lg" style={{ color: "#6B7589" }}>
              At the intersection of geographic science, precision fabrication,
              and interpretive art — our process transforms raw terrain data into
              immersive physical experiences.
            </p>
          </div>
        </AnimatedSection>
      </Section>

      {sections.map((section, i) => (
        <Section
          key={section.id}
          style={i % 2 === 0 ? { background: "#EDF0F4" } : undefined}
        >
          <AnimatedSection>
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center`}>
              {/* Image */}
              <div className={i % 2 !== 0 ? "lg:order-2" : ""}>
                <div className="relative aspect-[3/2] rounded-xl overflow-hidden shadow-lg" style={{ background: "#EDF0F4" }}>
                  {section.imageUrl ? (
                    <>
                      <Image
                        src={section.imageUrl}
                        alt={section.imageAlt || section.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        loading={i === 0 ? "eager" : "lazy"}
                      />
                      <div
                        className="absolute inset-0 mix-blend-multiply opacity-10"
                        style={{ background: "linear-gradient(135deg, #1A2D42, #2D7A9C)" }}
                      />
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Cpu className="w-16 h-16" style={{ color: "#D4D9E2" }} />
                    </div>
                  )}
                </div>
              </div>

              {/* Text */}
              <div className={i % 2 !== 0 ? "lg:order-1" : ""}>
                <span
                  className="inline-block text-xs font-medium uppercase tracking-wider px-3 py-1 rounded-full mb-4"
                  style={{
                    background: section.badge ? "#2D7A9C" : "#EDF0F4",
                    color: section.badge ? "#ffffff" : "#2D7A9C",
                  }}
                >
                  {section.badge || `0${i + 1}`}
                </span>
                <h2 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-space-grotesk)] mb-4" style={{ color: "#1A1D24" }}>
                  {section.title}
                </h2>
                <p className="leading-relaxed mb-4" style={{ color: "#6B7589" }}>
                  {section.description}
                </p>
                <p
                  className="text-sm leading-relaxed border-l-2 pl-4"
                  style={{ color: "#6B7589", opacity: 0.8, borderColor: "#2D7A9C" }}
                >
                  {section.detail}
                </p>
              </div>
            </div>
          </AnimatedSection>
        </Section>
      ))}

      {/* CTA */}
      <Section style={{ background: "#EDF0F4" }}>
        <AnimatedSection>
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-space-grotesk)] mb-4" style={{ color: "#1A1D24" }}>
              See the Results
            </h2>
            <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: "#6B7589" }}>
              Explore our portfolio of completed projects — from national park installations to private commissions.
            </p>
            <a
              href="/gallery"
              className="inline-flex items-center justify-center px-7 py-3 text-base font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2"
              style={{ background: "#2D7A9C", color: "#ffffff" }}
            >
              Our Work →
            </a>
          </div>
        </AnimatedSection>
      </Section>
    </div>
  );
}
