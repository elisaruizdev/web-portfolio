import { createContext, useContext, useEffect } from "react";
import { absoluteUrl, site } from "../seo/config";

type SeoProps = {
  title: string;
  description: string;
  /** Ruta interna, p. ej. `/blog/mi-post` */
  path: string;
  /** noindex para 404 u otras páginas que no deben indexarse */
  noIndex?: boolean;
  /** BlogPosting, WebPage, etc. */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  type?: "website" | "article";
};

export type SeoMetaTag = { attr: "name" | "property"; key: string; content: string };

export type SeoHead = { title: string; canonical: string; meta: SeoMetaTag[] };

/**
 * En el prerender (src/entry-server.tsx) recoge las etiquetas del <head> para escribirlas
 * en el HTML estático. En el navegador no hay proveedor y se aplican con useEffect.
 */
export const SeoHeadContext = createContext<{ head?: SeoHead } | null>(null);

function upsertMeta({ attr, key, content }: SeoMetaTag) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

export function Seo({
  title,
  description,
  path,
  noIndex = false,
  jsonLd,
  type = "website",
}: SeoProps) {
  const url = absoluteUrl(path);
  const fullTitle =
    title === site.defaultTitle ? title : `${title} · ${site.name}`;
  const image = absoluteUrl(site.ogImage.path);

  const meta: SeoMetaTag[] = [
    { attr: "name", key: "description", content: description },
    {
      attr: "name",
      key: "robots",
      content: noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large",
    },
    { attr: "property", key: "og:type", content: type },
    { attr: "property", key: "og:site_name", content: site.name },
    { attr: "property", key: "og:locale", content: site.locale },
    { attr: "property", key: "og:title", content: fullTitle },
    { attr: "property", key: "og:description", content: description },
    { attr: "property", key: "og:url", content: url },
    { attr: "property", key: "og:image", content: image },
    { attr: "property", key: "og:image:width", content: String(site.ogImage.width) },
    { attr: "property", key: "og:image:height", content: String(site.ogImage.height) },
    { attr: "property", key: "og:image:alt", content: site.ogImage.alt },
    { attr: "name", key: "twitter:card", content: "summary_large_image" },
    { attr: "name", key: "twitter:title", content: fullTitle },
    { attr: "name", key: "twitter:description", content: description },
    { attr: "name", key: "twitter:image", content: image },
  ];

  const collector = useContext(SeoHeadContext);
  if (collector) {
    collector.head = { title: fullTitle, canonical: url, meta };
  }

  const metaKey = JSON.stringify(meta);

  useEffect(() => {
    document.title = fullTitle;
    document.documentElement.lang = site.language;
    for (const tag of JSON.parse(metaKey) as SeoMetaTag[]) {
      upsertMeta(tag);
    }
    upsertLink("canonical", url);
  }, [fullTitle, url, metaKey]);

  if (!jsonLd) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
