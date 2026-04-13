import Link from "next/link";
import { Section } from "@/components/ui/section";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Button } from "@/components/ui/button";

export function CtaBanner() {
  return (
    <Section className="bg-surface-light/50">
      <AnimatedSection>
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-[family-name:var(--font-space-grotesk)] mb-4">
            Have a Landscape in Mind?
          </h2>
          <p className="text-muted text-lg mb-8">
            From national parks to hotel lobbies, we craft custom 3D maps
            tailored to your vision and specifications.
          </p>
          <Link href="/custom-orders">
            <Button variant="gold" size="lg">
              Start a Custom Project
            </Button>
          </Link>
        </div>
      </AnimatedSection>
    </Section>
  );
}
