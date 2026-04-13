import type { Metadata } from "next";
import { Section, SectionTitle } from "@/components/ui/section";
import { AnimatedSection } from "@/components/ui/animated-section";
import { InquiryForm } from "@/components/custom-orders/inquiry-form";
import { Building2, Landmark, BarChart3, Palette } from "lucide-react";

export const metadata: Metadata = {
  title: "Custom Orders",
  description:
    "Commission a custom 3D topographic map for your hotel, visitor centre, gallery, or data visualization project.",
};

const useCases = [
  {
    icon: Landmark,
    title: "Government & Parks",
    description:
      "Interactive visitor centre installations with LED-illuminated features, multilingual legends, and interpretive overlays for national and provincial parks.",
  },
  {
    icon: Building2,
    title: "Hotels & Hospitality",
    description:
      "Stunning lobby centerpieces that orient guests to the surrounding landscape and create memorable first impressions.",
  },
  {
    icon: BarChart3,
    title: "Data Visualization",
    description:
      "Physical 3D representations of geographic data for research institutions, planning agencies, and educational settings.",
  },
  {
    icon: Palette,
    title: "Art Commissions",
    description:
      "Gallery-quality landscape models for exhibitions, private collections, and public art installations.",
  },
];

export default function CustomOrdersPage() {
  return (
    <div className="pt-24">
      <Section>
        <AnimatedSection>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-[family-name:var(--font-space-grotesk)] mb-6">
              Custom Projects
            </h1>
            <p className="text-lg text-muted">
              Every Tactile Terrain map is a unique collaboration. We work
              closely with clients to design and fabricate 3D topographic models
              tailored to their specific landscape, scale, and interpretive
              requirements.
            </p>
          </div>
        </AnimatedSection>
      </Section>

      {/* Use cases */}
      <Section className="bg-surface-light/50">
        <AnimatedSection>
          <SectionTitle>Typical Use Cases</SectionTitle>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {useCases.map((uc, i) => (
            <AnimatedSection key={uc.title} delay={i * 0.1}>
              <div className="p-6 rounded-lg border border-border/50 bg-white shadow-sm">
                <uc.icon className="w-8 h-8 text-accent mb-3" />
                <h3 className="text-lg font-semibold font-[family-name:var(--font-space-grotesk)] mb-2">
                  {uc.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {uc.description}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </Section>

      {/* Process */}
      <Section>
        <AnimatedSection>
          <SectionTitle subtitle="Four factors determine the cost of a custom map: size & scale, feature complexity, interpretive content, and framing">
            The Custom Process
          </SectionTitle>
          <p className="text-muted max-w-3xl mb-4">
            Maps with interpretive elements are priced on an individual basis
            after consultation. Size is the most significant cost driver, scaling
            approximately with surface area. Standard sizes range from 2×3 ft to
            4×8 ft rectangular, and 2 to 4-foot diameter circular models.
          </p>
          <p className="text-muted max-w-3xl">
            Fill out the inquiry form below and we&apos;ll get back to you with a
            preliminary consultation to discuss your project.
          </p>
        </AnimatedSection>
      </Section>

      {/* Inquiry form */}
      <Section className="bg-surface-light/50" id="inquiry-form">
        <AnimatedSection>
          <SectionTitle subtitle="Tell us about your project and we'll follow up with a consultation">
            Project Inquiry
          </SectionTitle>
        </AnimatedSection>
        <div className="max-w-2xl">
          <InquiryForm />
        </div>
      </Section>
    </div>
  );
}
