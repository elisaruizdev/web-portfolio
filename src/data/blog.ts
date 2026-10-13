export type BlogPostMeta = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingMinutes: number;
  tags: string[];
};

export type BlogPost = BlogPostMeta & {
  body: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "edge-cases-que-salvan-releases",
    title: "Tres edge cases que suelen saltarse en la demo (y cómo los reviso)",
    excerpt:
      "Un checklist práctico antes de mergear: estados vacíos, doble click y sesión caducada.",
    date: "2026-03-01",
    readingMinutes: 6,
    tags: ["QA", "Frontend", "React"],
    body: `## Por qué escribo esto

No hace falta llamarse *senior* para cuidar el detalle. Hace falta **tiempo** y **curiosidad**.

### 1. Estado vacío vs error

Muchas UIs tratan «sin datos» igual que «error de red». El usuario no sabe qué hacer.

### 2. Doble envío de formularios

Un botón sin \`disabled\` durante el fetch puede duplicar operaciones. Lo pruebo con red lenta (DevTools → Slow 3G).

### 3. Token caducado en mitad del flujo

¿Qué pasa si la sesión expira mientras rellenas un wizard de tres pasos?

---

*Sustituye este post por tus propios artículos. Cada entrada vive en \`src/data/blog.ts\` hasta que conectemos un CMS o MDX.*`,
  },
  {
    slug: "cv-frontend-sin-adjetivos",
    title: "Cómo escribí mi CV sin decir «proactiva» ni «apasionada»",
    excerpt:
      "Sustituí adjetivos por métricas, contexto y verbos que un recruiter puede escanear en 10 segundos.",
    date: "2026-02-15",
    readingMinutes: 5,
    tags: ["Carrera", "CV"],
    body: `## La regla que uso

Cada bullet responde: **qué hice**, **con qué**, **para quién**, **resultado**.

Mal: *Desarrollé interfaces modernas y responsivas.*

Mejor: *Implementé el checkout en React (TS) reduciendo abandono un X% tras A/B test.*

Tu portfolio cuenta la historia; el CV es el índice.`,
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getSortedPosts(): BlogPostMeta[] {
  return [...blogPosts]
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(({ body: _body, ...meta }) => meta);
}
