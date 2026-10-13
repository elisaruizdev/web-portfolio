import { useEffect } from "react";
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

function upsertMeta(
  selector: string,
  create: () => HTMLElement,
  content: string
) {
  let el = document.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = create() as HTMLMetaElement;
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

  useEffect(() => {
    document.title = fullTitle;
    document.documentElement.lang = site.language;

    upsertMeta(
      'meta[name="description"]',
      () => {
        const m = document.createElement("meta");
        m.name = "description";
        return m;
      },
      description
    );

    upsertMeta(
      'meta[name="robots"]',
      () => {
        const m = document.createElement("meta");
        m.name = "robots";
        return m;
      },
      noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large"
    );

    upsertLink("canonical", url);

    const og = (property: string, content: string) =>
      upsertMeta(
        `meta[property="${property}"]`,
        () => {
          const m = document.createElement("meta");
          m.setAttribute("property", property);
          return m;
        },
        content
      );

    og("og:type", type);
    og("og:site_name", site.name);
    og("og:locale", site.locale);
    og("og:title", fullTitle);
    og("og:description", description);
    og("og:url", url);

    upsertMeta(
      'meta[name="twitter:card"]',
      () => {
        const m = document.createElement("meta");
        m.name = "twitter:card";
        return m;
      },
      "summary"
    );
    upsertMeta(
      'meta[name="twitter:title"]',
      () => {
        const m = document.createElement("meta");
        m.name = "twitter:title";
        return m;
      },
      fullTitle
    );
    upsertMeta(
      'meta[name="twitter:description"]',
      () => {
        const m = document.createElement("meta");
        m.name = "twitter:description";
        return m;
      },
      description
    );
  }, [fullTitle, description, url, noIndex, type]);

  if (!jsonLd) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
