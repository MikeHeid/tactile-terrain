import type { Metadata } from "next";
import Image from "next/image";
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
  const [storyContent, teamMembers, heroImagesContent] = await Promise.all([
    prisma.siteContent.findUnique({ where: { key: "about_story" } }),
    prisma.teamMember.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.siteContent.findUnique({ where: { key: "about_hero_images" } }),
  ]);

  const story =
    storyContent?.content ||
    `Tactile Terrain is a collaborative project of artists, designers & fabricators who bring each map from a concept into a fully realized work of art.

Founded by cartographer James Tyrwhitt-Drake, the studio draws inspiration from the mountains and forests of the qathet region of coastal British Columbia.

We see maps as storytelling tools — works of art that draw people into the world around them.`;

  let heroImages: { url: string; alt: string }[] = [];
  try {
    heroImages = heroImagesContent?.content ? JSON.parse(heroImagesContent.content) : [];
  } catch {
    heroImages = [];
  }

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

      {/* Workshop photos */}
      {heroImages.length > 0 && (
        <Section style={{ background: "#EDF0F4" }}>
          <AnimatedSection>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {heroImages.map((img, i) => (
                <div
                  key={i}
                  className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-md animate-[imageLoad_0.6s_ease-out_both]"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <Image
                    src={img.url}
                    alt={img.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    loading={i < 2 ? "eager" : "lazy"}
                  />
                  <div
                    className="absolute inset-0 mix-blend-multiply opacity-5"
                    style={{ background: "linear-gradient(135deg, #1A2D42, #2D7A9C)" }}
                  />
                </div>
              ))}
            </div>
          </AnimatedSection>
        </Section>
      )}

      {/* Story */}
      <Section>
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
      <Section style={{ background: "#EDF0F4" }}>
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
