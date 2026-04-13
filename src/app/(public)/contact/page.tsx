import type { Metadata } from "next";
import { Section, SectionTitle } from "@/components/ui/section";
import { AnimatedSection } from "@/components/ui/animated-section";
import { ContactForm } from "@/components/contact/contact-form";
import { getStudioInfo } from "@/lib/studio-info";
import { MapPin, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Tactile Terrain for inquiries about 3D topographic maps, custom projects, and installations.",
};

export default async function ContactPage() {
  const studio = await getStudioInfo();

  return (
    <div className="pt-24">
      <Section>
        <AnimatedSection>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-[family-name:var(--font-space-grotesk)] mb-6">
            Contact Us
          </h1>
          <p className="text-lg text-muted max-w-2xl">
            Have a question about our maps or interested in a custom project?
            Send us a message and we&apos;ll get back to you.
          </p>
        </AnimatedSection>
      </Section>

      <Section style={{ background: "#EDF0F4" }}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <AnimatedSection>
              <SectionTitle>Send a Message</SectionTitle>
              <ContactForm />
            </AnimatedSection>
          </div>

          <div>
            <AnimatedSection delay={0.2}>
              <SectionTitle>Studio</SectionTitle>
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{studio.region}</p>
                    <p className="text-sm text-muted">{studio.location}</p>
                  </div>
                </div>

                {studio.etsyUrl && (
                  <div className="flex items-start gap-3">
                    <ExternalLink className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                    <div>
                      <a
                        href={studio.etsyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-accent hover:text-accent-hover transition-colors font-medium"
                      >
                        {studio.etsyLabel} →
                      </a>
                      <p className="text-xs text-muted mt-1">
                        Small relief maps available for $200 CAD
                      </p>
                    </div>
                  </div>
                )}

                <div className="aspect-video rounded-lg flex items-center justify-center mt-6" style={{ background: "#E2E6EC", border: "1px solid #D4D9E2" }}>
                  <p className="text-sm" style={{ color: "#6B7589" }}>Map embed placeholder</p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </Section>
    </div>
  );
}
