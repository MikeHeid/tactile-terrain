import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { LoadingImage } from "@/components/ui/loading-image";
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

  const paragraphs = story.split("\n\n").filter(Boolean);

  return (
    <div className="pt-24">
      {/* Our Story — heading + text + photos all together */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <AnimatedSection>
            {/* Page title + quote */}
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-[family-name:var(--font-space-grotesk)] mb-3">
              About Tactile Terrain
            </h1>
            <p className="text-base text-muted italic mb-10 max-w-2xl">
              &ldquo;These models allow us to see the Earth as if we were giants, reaching
              down to touch the sculpted surface of our world.&rdquo;
            </p>

            {/* Story content with photos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              {/* Text */}
              <div>
                <h2 className="text-2xl font-bold tracking-tight font-[family-name:var(--font-space-grotesk)] mb-5" style={{ color: "#1A1D24" }}>
                  Our Story
                </h2>
                <div className="space-y-4">
                  {paragraphs.map((paragraph, i) => (
                    <p key={i} className="text-muted leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Photos — masonry-style collage */}
              {heroImages.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {heroImages.map((img, i) => (
                    <div
                      key={i}
                      className={`relative rounded-lg overflow-hidden shadow-md animate-[imageLoad_0.6s_ease-out_both] ${
                        i === 0 ? "col-span-2 aspect-[2/1]" : "aspect-[4/3]"
                      }`}
                      style={{ animationDelay: `${i * 0.12}s` }}
                    >
                      <LoadingImage
                        src={img.url}
                        alt={img.alt}
                        fill
                        containerClassName="absolute inset-0"
                        className="object-cover"
                        sizes={i === 0 ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 1024px) 50vw, 25vw"}
                        loading={i < 2 ? "eager" : "lazy"}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </AnimatedSection>
        </div>
      </section>

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
