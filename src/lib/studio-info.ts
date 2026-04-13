import { prisma } from "@/lib/prisma";

export async function getStudioInfo() {
  const [region, location, etsyUrl, etsyLabel, footerTagline, mapImage, mapUrl] = await Promise.all([
    prisma.siteContent.findUnique({ where: { key: "studio_region" } }),
    prisma.siteContent.findUnique({ where: { key: "studio_location" } }),
    prisma.siteContent.findUnique({ where: { key: "etsy_url" } }),
    prisma.siteContent.findUnique({ where: { key: "etsy_label" } }),
    prisma.siteContent.findUnique({ where: { key: "footer_tagline" } }),
    prisma.siteContent.findUnique({ where: { key: "studio_map_image" } }),
    prisma.siteContent.findUnique({ where: { key: "studio_map_url" } }),
  ]);

  return {
    region: region?.content || "qathet region",
    location: location?.content || "Coastal British Columbia, Canada",
    etsyUrl: etsyUrl?.content || "https://tactileterrain.etsy.com",
    etsyLabel: etsyLabel?.content || "Visit our Etsy Store",
    footerTagline: footerTagline?.content || "Precision 3D topographic maps and immersive geographic installations.",
    mapImage: mapImage?.content || "",
    mapUrl: mapUrl?.content || "https://maps.google.com/?q=qathet+region+british+columbia",
  };
}
