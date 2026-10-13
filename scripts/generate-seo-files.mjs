import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const dist = resolve(root, "dist");

function readSiteUrlFromEnvFiles() {
  for (const name of [".env.production", ".env.local", ".env"]) {
    try {
      const text = readFileSync(resolve(root, name), "utf-8");
      for (const line of text.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const match = trimmed.match(/^VITE_SITE_URL=(.*)$/);
        if (match) {
          return match[1].trim().replace(/^["']|["']$/g, "");
        }
      }
    } catch {
      /* archivo opcional */
    }
  }
  return undefined;
}

const siteUrl = (
  process.env.VITE_SITE_URL ??
  readSiteUrlFromEnvFiles() ??
  "https://tu-dominio.com"
).replace(/\/$/, "");

const blogSrc = readFileSync(resolve(root, "src/data/blog.ts"), "utf-8");

/** Extrae slug, title, excerpt y date de cada entrada en blog.ts */
function parseBlogPosts(source) {
  const re =
    /slug:\s*"([^"]+)",\s*title:\s*"([^"]+)",\s*excerpt:\s*\n?\s*"([^"]+)",\s*date:\s*"([^"]+)"/g;
  const posts = [];
  for (const match of source.matchAll(re)) {
    posts.push({
      slug: match[1],
      title: match[2],
      excerpt: match[3],
      date: match[4],
    });
  }
  return posts;
}

const blogPosts = parseBlogPosts(blogSrc);
const authorName = readFileSync(resolve(root, "src/data/site.ts"), "utf-8").match(
  /name:\s*"([^"]+)"/
)?.[1] ?? "Autor";

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildSitemap() {
  const urls = [
    { loc: `${siteUrl}/`, changefreq: "weekly", priority: "1.0" },
    { loc: `${siteUrl}/blog`, changefreq: "weekly", priority: "0.9" },
    ...blogPosts.map((post) => ({
      loc: `${siteUrl}/blog/${post.slug}`,
      lastmod: post.date,
      changefreq: "monthly",
      priority: "0.8",
    })),
  ];

  const body = urls
    .map(
      (u) => `  <url>
    <loc>${escapeXml(u.loc)}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ""}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

function buildRss() {
  const sorted = [...blogPosts].sort((a, b) => b.date.localeCompare(a.date));
  const items = sorted
    .map(
      (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(`${siteUrl}/blog/${post.slug}`)}</link>
      <guid isPermaLink="true">${escapeXml(`${siteUrl}/blog/${post.slug}`)}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${escapeXml(post.excerpt)}</description>
    </item>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Blog — ${escapeXml(authorName)}</title>
    <link>${escapeXml(`${siteUrl}/blog`)}</link>
    <description>Artículos sobre frontend y carrera.</description>
    <language>es</language>
    <atom:link href="${escapeXml(`${siteUrl}/rss.xml`)}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;
}

writeFileSync(resolve(dist, "sitemap.xml"), buildSitemap(), "utf-8");
writeFileSync(resolve(dist, "rss.xml"), buildRss(), "utf-8");
writeFileSync(
  resolve(dist, "robots.txt"),
  `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
  "utf-8"
);

console.log(`SEO: sitemap.xml, rss.xml y robots.txt → ${dist} (${siteUrl})`);
