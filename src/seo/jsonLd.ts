import type { BlogPost, BlogPostMeta } from "../data/blog";
import { absoluteUrl, site } from "./config";

export function personAndWebsiteJsonLd() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Person",
      name: site.name,
      jobTitle: site.role,
      url: site.url,
      email: site.email,
      sameAs: [site.linkedin, site.github].filter(Boolean),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: site.defaultTitle,
      url: site.url,
      description: site.defaultDescription,
      inLanguage: site.language,
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
