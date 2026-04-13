import { Section, SectionTitle } from "@/components/ui/section";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Building2, Landmark, BarChart3, Palette, Trees } from "lucide-react";

const clients = [
  { icon: Landmark, label: "Government & Parks", description: "National parks, visitor centres, and public installations" },
  { icon: Building2, label: "Hotels & Hospitality", description: "Lobby features and guest experience pieces" },
  { icon: Trees, label: "Conservation", description: "Environmental awareness and education tools" },
  { icon: BarChart3, label: "Data Visualization", description: "GIS-based topographic data models" },
  { icon: Palette, label: "Installation Art", description: "Gallery exhibitions and commissioned artworks" },
];

export function ClientsSection() {
  return (
    <Section>
      <AnimatedSection>
        <SectionTitle
          subtitle="Our maps serve diverse clients across sectors that value precision and storytelling"
          center
        >
          Who We Work With
        </SectionTitle>
      </AnimatedSection>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {clients.map((client, i) => (
          <AnimatedSection key={client.label} delay={i * 0.08}>
            <div className="text-center p-6 rounded-lg bg-white border border-border/50 hover:border-accent/30 hover:shadow-md transition-all">
              <client.icon className="w-8 h-8 text-accent mx-auto mb-3" />
              <h3 className="text-sm font-semibold font-[family-name:var(--font-space-grotesk)]">
                {client.label}
              </h3>
              <p className="text-xs text-muted mt-2 leading-relaxed">
                {client.description}
              </p>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </Section>
  );
}
