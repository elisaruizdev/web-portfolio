import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const dist = resolve(root, "dist");

const { render, routes } = await import(
  pathToFileURL(resolve(root, "dist-ssr/entry-server.js")).href
);

const template = readFileSync(resolve(dist, "index.html"), "utf-8");

// dist/index.html se sobrescribe con la home prerenderizada: hace falta un `vite build` limpio antes
if (!template.includes('<div id="root"></div>')) {
  throw new Error("dist/index.html ya está prerenderizado: ejecuta `npm run build` completo.");
}

function escapeAttr(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeText(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildHead(head) {
  return [
    `<title>${escapeText(head.title)}</title>`,
    `<link rel="canonical" href="${escapeAttr(head.canonical)}" />`,
    ...head.meta.map(
      (tag) => `<meta ${tag.attr}="${escapeAttr(tag.key)}" content="${escapeAttr(tag.content)}" />`
    ),
  ]
    .map((line) => `    ${line}`)
    .join("\n");
}

/** "/" → index.html · "/blog" → blog.html · "/blog/x" → blog/x.html (Netlify y Vercel con cleanUrls) */
function outputFile(route) {
  if (route === "/") return "index.html";
  return `${route.slice(1)}.html`;
}

function renderPage(route) {
  const { html, head } = render(route);
  if (!head) throw new Error(`La ruta ${route} no tiene <Seo />`);

  return template
    .replace(/\n\s*<title>[\s\S]*?<\/title>/, "")
    .replace(/\n\s*<meta\s+name="description"[\s\S]*?\/>/, "")
    .replace(/\s*<\/head>/, `\n${buildHead(head)}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root" data-route="${route}">${html}</div>`);
}

const pages = [...routes.map((route) => [route, outputFile(route)]), ["/404", "404.html"]];

for (const [route, file] of pages) {
  const target = resolve(dist, file);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, renderPage(route), "utf-8");
}

console.log(`Prerender: ${pages.map(([, file]) => file).join(", ")}`);
