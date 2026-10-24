import { site as siteData } from "../data/site";

/** URL pública del sitio (sin barra final). Configura VITE_SITE_URL en producción. */
export const siteUrl = (
  import.meta.env.VITE_SITE_URL ?? "https://elisaruiz.netlify.app"
).replace(/\/$/, "");

export const site = {
  ...siteData,
  url: siteUrl,
  defaultTitle: `${siteData.name} — ${siteData.role}`,
  defaultDescription:
    "Software engineer — obsesionada con los detalles que nadie ve hasta que fallan.",
  locale: "es_ES",
  language: "es",
} as const;

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${normalized}`;
}
