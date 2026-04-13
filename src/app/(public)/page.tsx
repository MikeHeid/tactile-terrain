import { prisma } from "@/lib/prisma";
import { Hero } from "@/components/home/hero";
import { IntroSection } from "@/components/home/intro-section";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { ClientsSection } from "@/components/home/clients-section";
import { CtaBanner } from "@/components/home/cta-banner";
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [homepageContent, featuredProjects] = await Promise.all([
    prisma.homepageContent.findUnique({ where: { id: "singleton" } }),
    prisma.galleryItem.findMany({
      where: { featured: true },
      include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
      orderBy: { sortOrder: "asc" },
      take: 4,
    }),
  ]);

  const tagline =
    homepageContent?.heroTagline ||
    "We design and fabricate 3D topographic maps to help people connect with the landscapes that matter to them.";
  const introText =
    homepageContent?.introText ||
    "These models allow us to see the Earth as if we were giants, reaching down to touch the sculpted surface of our world. 3D maps intuitively orient people to their environment, visualize information, and communicate narratives through interpretive design.";

  return (
    <>
      <Hero tagline={tagline} />
      <IntroSection text={introText} />
      <FeaturedProjects projects={featuredProjects} />
      <ClientsSection />
      <CtaBanner />
    </>
  );
}
