import type { BlogPost, BlogPostMeta } from "../data/blog";
import { absoluteUrl, site } from "./config";

const personId = `${site.url}/#persona`;

/** Solo ciudad y región: no se publica dirección postal */
const madridAddress = {
  "@type": "PostalAddress",
  addressLocality: "Madrid",
  addressRegion: "Comunidad de Madrid",
  addressCountry: "ES",
};

function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": personId,
    name: site.name,
    jobTitle: [site.role, site.techRole],
    url: site.url,
    email: site.email,
    image: absoluteUrl(site.ogImage.path),
    address: madridAddress,
    knowsAbout: ["Desarrollo web", "Angular", "Vue.js", "React", "TypeScript", "Accesibilidad web"],
    sameAs: [site.linkedin, site.github].filter(Boolean),
  };
}

/** Home: el portfolio es el perfil profesional de la persona */
export function homeJsonLd() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      url: absoluteUrl("/"),
      inLanguage: site.language,
      mainEntity: personJsonLd(),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: site.defaultTitle,
      url: site.url,
      description: site.defaultDescription,
      inLanguage: site.language,
      publisher: { "@id": personId },
    },
  ];
}

export function blogListingJsonLd(posts: BlogPostMeta[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `Blog — ${site.name}`,
    description:
      "Notas sobre desarrollo frontend, revisión de producto y búsqueda de empleo.",
    url: absoluteUrl("/blog"),
    inLanguage: site.language,
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      url: absoluteUrl(`/blog/${post.slug}`),
    })),
  };
}

export function blogPostJsonLd(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: site.language,
    url: absoluteUrl(`/blog/${post.slug}`),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/blog/${post.slug}`),
    },
    author: {
      "@type": "Person",
      name: site.name,
      url: site.url,
    },
    publisher: {
      "@type": "Person",
      name: site.name,
    },
    keywords: post.tags.join(", "),
  };
}
