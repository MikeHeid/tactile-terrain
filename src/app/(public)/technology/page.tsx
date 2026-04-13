import type { Metadata } from "next";
import { Section, SectionTitle } from "@/components/ui/section";
import { AnimatedSection } from "@/components/ui/animated-section";
import {
  Globe,
  Cpu,
  Printer,
  Paintbrush,
  Monitor,
  Lightbulb,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Technology",
  description:
    "Learn about the intersection of GIS data processing, CNC fabrication, and interactive digital overlays that power Tactile Terrain's 3D maps.",
};

const techSections = [
  {
    icon: Globe,
    title: "GIS Data Processing",
    description:
      "Every map begins with high-resolution geographic information system (GIS) data. We source digital elevation models (DEMs), bathymetric surveys, and satellite imagery to build an accurate digital representation of the terrain. This data is processed to determine optimal scale, vertical exaggeration, and the geographic extent of the final model.",
    detail:
      "Cartographic scale represents the relationship between model size and real-world terrain. Scale choices involve trade-offs between detail visibility, relief height, and geographic area coverage.",
  },
  {
    icon: Cpu,
    title: "CNC Milling",
    description:
      "Digital terrain models are translated into toolpaths for computer numerical control (CNC) milling machines. High-density foam or wood substrates are carved with sub-millimeter precision, capturing every ridge, valley, and coastal contour of the landscape.",
    detail:
      "Multi-axis milling allows us to reproduce complex overhangs and steep terrain features that would be impossible with simple 2.5D cutting.",
  },
  {
    icon: Printer,
    title: "3D Printing",
    description:
      "For certain projects, stereolithography (SLA) or fused deposition modeling (FDM) 3D printing is used to produce terrain models or small-scale interpretive elements. This is especially valuable for complex geometries like cave systems or intricate coastal features.",
    detail:
      "Small relief maps available through our Etsy store are produced using high-resolution 3D printing at scales suitable for desktop display.",
  },
  {
    icon: Paintbrush,
    title: "Hand Finishing & Painting",
    description:
      "Skilled painters apply terrain coloring, vegetation textures, water features, and interpretive elements by hand. This process transforms a raw CNC-carved blank into a vivid, accurate representation of the landscape. Road networks, trails, and boundary lines are carefully applied.",
    detail:
      "Decorative icons mark viewpoints, campsites, and cultural sites. Hiking trails are color-coded by difficulty. Place names appear in multiple languages where culturally appropriate.",
  },
  {
    icon: Monitor,
    title: "Interactive Digital Overlays",
    description:
      "Many of our installations incorporate embedded LEDs connected to push buttons, allowing visitors to illuminate specific features — mountain peaks, cultural sites, or geographic boundaries. Legends and labels can be presented in multiple languages, including Indigenous languages.",
    detail:
      "Button-activated lighting systems are engineered to be durable for high-traffic public installations while remaining intuitive for visitors of all ages.",
  },
  {
    icon: Lightbulb,
    title: "Luminous Cartographs",
    description:
      "Our Luminous Cartograph technology uses projected light to create dynamic visualizations on the surface of a 3D terrain model. Visitors can cycle through views showing elevation, geological strata, light and shadow movement, historical events like wildfires, simulated weather, and seasonal changes — all controlled via touchscreen.",
    detail:
      "This technology bridges the gap between physical and digital mapping, offering an interactive experience that static maps cannot provide.",
  },
];

export default function TechnologyPage() {
  return (
    <div className="pt-24">
      <Section>
        <AnimatedSection>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-[family-name:var(--font-space-grotesk)] mb-6">
              Our Technology
            </h1>
            <p className="text-lg text-muted">
              At the intersection of geographic science, precision fabrication,
              and interpretive art — our process transforms raw terrain data into
              immersive physical experiences.
            </p>
          </div>
        </AnimatedSection>
      </Section>

      {techSections.map((section, i) => (
        <Section
          key={section.title}
          className={i % 2 === 0 ? "bg-surface-light/50" : ""}
        >
          <AnimatedSection>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-1">
                <section.icon className="w-10 h-10 text-accent" />
              </div>
              <div className="lg:col-span-7">
                <h2 className="text-2xl font-bold font-[family-name:var(--font-space-grotesk)] mb-4">
                  {section.title}
                </h2>
                <p className="text-muted leading-relaxed mb-4">
                  {section.description}
                </p>
                <p className="text-sm text-muted/70 leading-relaxed border-l-2 border-accent/30 pl-4">
                  {section.detail}
                </p>
              </div>
              <div className="lg:col-span-4">
                {/* Placeholder for future diagrams */}
                <div className="aspect-square rounded-lg bg-surface-light border border-border/50 flex items-center justify-center">
                  <section.icon className="w-16 h-16 text-border/50" />
                </div>
              </div>
            </div>
          </AnimatedSection>
        </Section>
      ))}
    </div>
  );
}
