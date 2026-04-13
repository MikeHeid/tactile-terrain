import { prisma } from "@/lib/prisma";

export async function getStudioInfo() {
  const [region, location, etsyUrl, etsyLabel, footerTagline] = await Promise.all([
    prisma.siteContent.findUnique({ where: { key: "studio_region" } }),
    prisma.siteContent.findUnique({ where: { key: "studio_location" } }),
    prisma.siteContent.findUnique({ where: { key: "etsy_url" } }),
    prisma.siteContent.findUnique({ where: { key: "etsy_label" } }),
    prisma.siteContent.findUnique({ where: { key: "footer_tagline" } }),
  ]);

  return {
    region: region?.content || "qathet region",
    location: location?.content || "Coastal British Columbia, Canada",
    etsyUrl: etsyUrl?.content || "https://tactileterrain.etsy.com",
    etsyLabel: etsyLabel?.content || "Visit our Etsy Store",
    footerTagline: footerTagline?.content || "Precision 3D topographic maps and immersive geographic installations.",
  };
}
