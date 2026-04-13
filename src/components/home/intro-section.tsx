import { Section, SectionTitle } from "@/components/ui/section";
import { AnimatedSection } from "@/components/ui/animated-section";

interface IntroSectionProps {
  text: string;
}

export function IntroSection({ text }: IntroSectionProps) {
  return (
    <Section>
      <AnimatedSection>
        <div className="max-w-3xl mx-auto text-center">
          <SectionTitle className="mb-6">
            Crafting the World in Three Dimensions
          </SectionTitle>
          <p className="text-lg md:text-xl text-muted leading-relaxed">
            {text}
          </p>
        </div>
      </AnimatedSection>
    </Section>
  );
}
