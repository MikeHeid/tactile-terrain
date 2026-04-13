import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Section, SectionTitle } from "@/components/ui/section";
import { AnimatedSection } from "@/components/ui/animated-section";
import { TeamGrid } from "@/components/about/team-grid";
import { ProcessTimeline } from "@/components/about/process-timeline";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About",
  description:
    "Tactile Terrain is a collaborative project of artists, designers, and fabricators who bring 3D topographic maps from concept to fully realized works of art.",
};

export default async function AboutPage() {
  const [storyContent, teamMembers] = await Promise.all([
    prisma.siteContent.findUnique({ where: { key: "about_story" } }),
    prisma.teamMember.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  const story =
    storyContent?.content ||
    `Tactile Terrain is a collaborative project of artists, designers & fabricators who bring each map from a concept into a fully realized work of art.

Founded by cartographer James Tyrwhitt-Drake, the studio draws inspiration from the mountains and forests of the qathet region of coastal British Columbia. Our work spans interactive exhibits for national parks, environmental awareness installations, and private commissions that transform how people see and understand landscapes.

We see maps as storytelling tools — works of art that draw people into the world around them. 3D maps intuitively orient people to their environment, visualize information, and communicate narratives through interpretive design. Landscape models create vivid perspectives of any location; they can be used to orient visitors, plan expeditions, facilitate conservation, unite communities, market destinations, and manage resources.`;

  return (
    <div className="pt-24">
      {/* Hero */}
      <Section>
        <AnimatedSection>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-[family-name:var(--font-space-grotesk)] mb-6">
              About Tactile Terrain
            </h1>
            <p className="text-lg text-muted italic">
              &ldquo;These models allow us to see the Earth as if we were giants, reaching
              down to touch the sculpted surface of our world.&rdquo;
            </p>
          </div>
        </AnimatedSection>
      </Section>

      {/* Story */}
      <Section className="bg-surface-light/50">
        <AnimatedSection>
          <SectionTitle>Our Story</SectionTitle>
          <div className="max-w-3xl space-y-4">
            {story.split("\n\n").map((paragraph, i) => (
              <p key={i} className="text-muted leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </AnimatedSection>
      </Section>

      {/* Process */}
      <ProcessTimeline />

      {/* Team */}
      <Section className="bg-surface-light/50">
        <AnimatedSection>
          <SectionTitle subtitle="A collaborative team of artists, designers, and fabricators">
            The Team
          </SectionTitle>
        </AnimatedSection>
        <TeamGrid members={teamMembers} />
      </Section>
    </div>
  );
}
