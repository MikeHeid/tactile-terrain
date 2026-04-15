import Database from "better-sqlite3";
import { PrismaClient } from "@prisma/client";
import path from "node:path";

const sqlitePath = path.join(process.cwd(), "prisma", "dev.db");
const sqlite = new Database(sqlitePath, { readonly: true });
const pg = new PrismaClient();

type Row = Record<string, unknown>;

function all(sql: string): Row[] {
  return sqlite.prepare(sql).all() as Row[];
}

function toDate(v: unknown): Date {
  if (v instanceof Date) return v;
  if (typeof v === "number") return new Date(v);
  if (typeof v === "string") return new Date(v);
  return new Date();
}

async function main() {
  console.log("Reading SQLite:", sqlitePath);

  const tables = [
    "GalleryItem",
    "GalleryImage",
    "HomepageContent",
    "TeamMember",
    "SiteContent",
    "TechnologySection",
    "ContactSubmission",
    "CustomOrderInquiry",
  ];
  for (const t of tables) {
    const n = (sqlite.prepare(`SELECT COUNT(*) as c FROM ${t}`).get() as { c: number }).c;
    console.log(`  ${t}: ${n}`);
  }

  console.log("\nWiping Postgres tables (preserve order)...");
  await pg.galleryImage.deleteMany();
  await pg.galleryItem.deleteMany();
  await pg.homepageContent.deleteMany();
  await pg.teamMember.deleteMany();
  await pg.siteContent.deleteMany();
  await pg.technologySection.deleteMany();
  await pg.contactSubmission.deleteMany();
  await pg.customOrderInquiry.deleteMany();

  console.log("\nImporting GalleryItem...");
  const items = all("SELECT * FROM GalleryItem");
  for (const r of items) {
    await pg.galleryItem.create({
      data: {
        id: r.id as string,
        title: r.title as string,
        slug: r.slug as string,
        description: r.description as string,
        category: r.category as string,
        scale: (r.scale as string) ?? null,
        year: (r.year as string) ?? null,
        location: (r.location as string) ?? null,
        sortOrder: Number(r.sortOrder ?? 0),
        featured: Boolean(r.featured),
        createdAt: toDate(r.createdAt),
        updatedAt: toDate(r.updatedAt),
      },
    });
  }

  console.log("Importing GalleryImage...");
  const imgs = all("SELECT * FROM GalleryImage");
  for (const r of imgs) {
    await pg.galleryImage.create({
      data: {
        id: r.id as string,
        url: r.url as string,
        alt: (r.alt as string) ?? "",
        sortOrder: Number(r.sortOrder ?? 0),
        galleryItemId: r.galleryItemId as string,
      },
    });
  }

  console.log("Importing HomepageContent...");
  for (const r of all("SELECT * FROM HomepageContent")) {
    await pg.homepageContent.create({
      data: {
        id: r.id as string,
        heroTagline: r.heroTagline as string,
        introText: r.introText as string,
        updatedAt: toDate(r.updatedAt),
      },
    });
  }

  console.log("Importing TeamMember...");
  for (const r of all("SELECT * FROM TeamMember")) {
    await pg.teamMember.create({
      data: {
        id: r.id as string,
        name: r.name as string,
        role: r.role as string,
        company: (r.company as string) ?? null,
        imageUrl: (r.imageUrl as string) ?? null,
        sortOrder: Number(r.sortOrder ?? 0),
      },
    });
  }

  console.log("Importing SiteContent...");
  for (const r of all("SELECT * FROM SiteContent")) {
    await pg.siteContent.create({
      data: {
        id: r.id as string,
        key: r.key as string,
        content: r.content as string,
        updatedAt: toDate(r.updatedAt),
      },
    });
  }

  console.log("Importing TechnologySection...");
  for (const r of all("SELECT * FROM TechnologySection")) {
    await pg.technologySection.create({
      data: {
        id: r.id as string,
        title: r.title as string,
        description: r.description as string,
        detail: r.detail as string,
        imageUrl: (r.imageUrl as string) ?? null,
        imageAlt: (r.imageAlt as string) ?? "",
        badge: (r.badge as string) ?? null,
        sortOrder: Number(r.sortOrder ?? 0),
        createdAt: toDate(r.createdAt),
        updatedAt: toDate(r.updatedAt),
      },
    });
  }

  console.log("Importing ContactSubmission...");
  for (const r of all("SELECT * FROM ContactSubmission")) {
    await pg.contactSubmission.create({
      data: {
        id: r.id as string,
        name: r.name as string,
        email: r.email as string,
        subject: r.subject as string,
        message: r.message as string,
        read: Boolean(r.read),
        createdAt: toDate(r.createdAt),
      },
    });
  }

  console.log("Importing CustomOrderInquiry...");
  for (const r of all("SELECT * FROM CustomOrderInquiry")) {
    await pg.customOrderInquiry.create({
      data: {
        id: r.id as string,
        name: r.name as string,
        email: r.email as string,
        organization: (r.organization as string) ?? null,
        projectType: r.projectType as string,
        scale: (r.scale as string) ?? null,
        timeline: (r.timeline as string) ?? null,
        budgetRange: (r.budgetRange as string) ?? null,
        description: r.description as string,
        fileUrl: (r.fileUrl as string) ?? null,
        read: Boolean(r.read),
        createdAt: toDate(r.createdAt),
      },
    });
  }

  console.log("\nDone. Final Postgres counts:");
  console.log("  GalleryItem:", await pg.galleryItem.count());
  console.log("  GalleryImage:", await pg.galleryImage.count());
  console.log("  HomepageContent:", await pg.homepageContent.count());
  console.log("  TeamMember:", await pg.teamMember.count());
  console.log("  SiteContent:", await pg.siteContent.count());
  console.log("  TechnologySection:", await pg.technologySection.count());
  console.log("  ContactSubmission:", await pg.contactSubmission.count());
  console.log("  CustomOrderInquiry:", await pg.customOrderInquiry.count());

  await pg.$disconnect();
  sqlite.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
