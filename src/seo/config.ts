import { site as siteData } from "../data/site";

/** URL pública del sitio (sin barra final). Configura VITE_SITE_URL en producción. */
export const siteUrl = (
  import.meta.env.VITE_SITE_URL ?? "https://elisaruiz.netlify.app"
).replace(/\/$/, "");

export const site = {
  ...siteData,
  url: siteUrl,
  defaultTitle: `${siteData.name} — ${siteData.techRole} en ${siteData.location}`,
  defaultDescription: `Portfolio de ${siteData.name}, ${siteData.techRole} con más de ${siteData.yearsExperience} años en banca y fintech: Angular, Vue y TypeScript. Trayectoria, proyectos y CV descargable.`,
  locale: "es_ES",
  language: "es",
  /** Imagen para compartir en redes (1200×630, en /public) */
  ogImage: {
    path: "/og-image.png",
    width: 1200,
    height: 630,
    alt: `${siteData.name} — ${siteData.role} en ${siteData.location}`,
  },
} as const;

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${normalized}`;
}
