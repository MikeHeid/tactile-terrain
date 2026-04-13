import { Section, SectionTitle } from "@/components/ui/section";
import { AnimatedSection } from "@/components/ui/animated-section";
import { PenTool, Box, Paintbrush, Truck } from "lucide-react";

const steps = [
  {
    icon: PenTool,
    title: "Design",
    description:
      "GIS data processing and cartographic design. We analyze terrain data, plan interpretive elements, and create detailed designs tailored to the project's narrative.",
  },
  {
    icon: Box,
    title: "Model",
    description:
      "CNC milling and 3D printing transform digital terrain models into physical forms. Precision fabrication captures every ridge, valley, and contour.",
  },
  {
    icon: Paintbrush,
    title: "Finish",
    description:
      "Hand painting, interpretive overlays, LED integration, and interactive elements. Each map is finished by skilled artists and craftspeople.",
  },
  {
    icon: Truck,
    title: "Install",
    description:
      "Custom framing, crating, shipping, and on-site installation. We deliver turnkey map installations ready for public display.",
  },
];

export function ProcessTimeline() {
  return (
    <Section>
      <AnimatedSection>
        <SectionTitle subtitle="From data to display — our end-to-end process">
          How We Work
        </SectionTitle>
      </AnimatedSection>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, i) => (
          <AnimatedSection key={step.title} delay={i * 0.1}>
            <div className="relative">
              {/* Step number */}
              <div className="text-5xl font-bold text-border/50 font-[family-name:var(--font-space-grotesk)] mb-4">
                {String(i + 1).padStart(2, "0")}
              </div>
              <step.icon className="w-8 h-8 text-accent mb-3" />
              <h3 className="text-lg font-semibold font-[family-name:var(--font-space-grotesk)] mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                {step.description}
              </p>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </Section>
  );
}
