import { PrismaClient } from "@prisma/client";
import { put, list } from "@vercel/blob";

const db = new PrismaClient();
const TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
if (!TOKEN) {
  console.error("BLOB_READ_WRITE_TOKEN missing");
  process.exit(1);
}

const ORIGIN_PREFIXES = ["https://tactileterrain.ca/"];
const KEEP_HOSTS = new Set(["images.pexels.com"]);

function shouldMigrate(url: string): boolean {
  if (!url) return false;
  try {
    const u = new URL(url);
    if (KEEP_HOSTS.has(u.host)) return false;
    return ORIGIN_PREFIXES.some((p) => url.startsWith(p));
  } catch {
    return false;
  }
}

function blobKey(url: string): string {
  const u = new URL(url);
  let p = u.pathname.replace(/^\/+/, "");
  p = p.replace(/^wp-content\/uploads\//, "");
  return `legacy/${p}`;
}

async function downloadToBuffer(url: string): Promise<{ buf: Buffer; contentType: string }> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET ${url} → ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const contentType = res.headers.get("content-type") ?? "application/octet-stream";
  return { buf, contentType };
}

const cache = new Map<string, string>();

async function migrate(url: string): Promise<string> {
  if (!shouldMigrate(url)) return url;
  if (cache.has(url)) return cache.get(url)!;

  const key = blobKey(url);
  const { buf, contentType } = await downloadToBuffer(url);
  const result = await put(key, buf, {
    access: "public",
    contentType,
    token: TOKEN,
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  cache.set(url, result.url);
  console.log(`  ✓ ${url}\n    → ${result.url}`);
  return result.url;
}

async function main() {
  console.log("Existing blobs…");
  const existing = await list({ token: TOKEN });
  console.log(`  found ${existing.blobs.length} existing blob(s)`);

  console.log("\nMigrating GalleryImage…");
  const imgs = await db.galleryImage.findMany();
  for (const img of imgs) {
    try {
      const newUrl = await migrate(img.url);
      if (newUrl !== img.url) {
        await db.galleryImage.update({ where: { id: img.id }, data: { url: newUrl } });
      }
    } catch (e) {
      console.error(`  ✗ ${img.url}:`, (e as Error).message);
    }
  }

  console.log("\nMigrating TechnologySection.imageUrl…");
  const tech = await db.technologySection.findMany();
  for (const t of tech) {
    if (!t.imageUrl) continue;
    try {
      const newUrl = await migrate(t.imageUrl);
      if (newUrl !== t.imageUrl) {
        await db.technologySection.update({ where: { id: t.id }, data: { imageUrl: newUrl } });
      }
    } catch (e) {
      console.error(`  ✗ ${t.imageUrl}:`, (e as Error).message);
    }
  }

  console.log("\nMigrating SiteContent JSON fields (about_hero_images, studio_map_image)…");
  const sc = await db.siteContent.findMany({
    where: { key: { in: ["about_hero_images", "studio_map_image"] } },
  });
  for (const row of sc) {
    if (row.key === "about_hero_images" && row.content) {
      try {
        const parsed = JSON.parse(row.content) as Array<{ url: string; alt?: string }>;
        const migrated = await Promise.all(
          parsed.map(async (p) => ({ ...p, url: await migrate(p.url) })),
        );
        const newContent = JSON.stringify(migrated);
        if (newContent !== row.content) {
          await db.siteContent.update({ where: { id: row.id }, data: { content: newContent } });
          console.log("  ✓ updated about_hero_images");
        }
      } catch (e) {
        console.error("  ✗ about_hero_images parse/migrate:", (e as Error).message);
      }
    }
    if (row.key === "studio_map_image" && row.content) {
      try {
        const newUrl = await migrate(row.content);
        if (newUrl !== row.content) {
          await db.siteContent.update({ where: { id: row.id }, data: { content: newUrl } });
        }
      } catch (e) {
        console.error("  ✗ studio_map_image:", (e as Error).message);
      }
    }
  }

  console.log("\nDone. Migrated:", cache.size, "unique URL(s).");
  await db.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
