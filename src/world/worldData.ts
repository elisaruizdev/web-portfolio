/** Mapa del mundo de neón: islas del recorrido del portfolio y el copy de cada parada. */

import { credibilityStats, cvDownloads, site, strengths } from "../data/site";

export type Vec3 = [number, number, number];

export const NEON = {
  magenta: "#ff2a8a",
  pink: "#ff8ad4",
  violet: "#b44cff",
  blue: "#4f7dff",
  cyan: "#4de7ff",
  mint: "#5dffc8",
  amber: "#ffc857",
} as const;

export type IslandKind = "fintech" | "stack" | "quality" | "projects" | "ai" | "cv";

export type Island = {
  /** Centro de la isla sobre la retícula */
  position: Vec3;
  /** Giro (rad) de la isla y de la cámara que llega a ella: varía el encuadre entre paradas */
  yaw: number;
  accent: string;
};

/** Las islas se suceden hacia +x, zigzagueando en profundidad */
export const islands: Record<IslandKind, Island> = {
  fintech: { position: [0, 0, 0], yaw: -0.45, accent: NEON.cyan },
  stack: { position: [18, 0, 8], yaw: 0.4, accent: NEON.blue },
  quality: { position: [36, 0, -2], yaw: -0.55, accent: NEON.mint },
  projects: { position: [54, 0, 6], yaw: 0.45, accent: NEON.pink },
  ai: { position: [72, 0, -2], yaw: -0.3, accent: NEON.violet },
  cv: { position: [90, 0, 4], yaw: 0.2, accent: NEON.magenta },
};

export type WorldAction = {
  label: string;
  /** "#id" salta a una sección de la página; el resto son enlaces normales */
  href: string;
  download?: string;
  external?: boolean;
  variant?: "primary" | "secondary";
};

export type WorldStop = {
  id: string;
  island: IslandKind;
  /** Nombre corto para el raíl de navegación */
  label: string;
  eyebrow: string;
  title: string;
  body: string;
  tags?: readonly string[];
  stats?: readonly { value: string; label: string }[];
  actions?: WorldAction[];
  /** Pantallas de scroll que dura la parada: más = la cámara se queda más tiempo */
  scroll?: number;
};

export const portfolioStops: WorldStop[] = [
  {
    id: "inicio",
    island: "fintech",
    label: "Inicio",
    eyebrow: `${site.techRole} · ${site.location}`,
    title: site.name,
    body: `Más de ${site.yearsExperience} años construyendo producto en fintech. Desde 2022 en Zeeker Solutions: la web y el backoffice de una financiera, y el frontend de un neobanco desde los primeros bocetos en Figma.`,
    stats: credibilityStats,
    actions: [
      {
        label: "Descargar CV",
        href: cvDownloads.design.href,
        download: cvDownloads.design.fileName,
        variant: "secondary",
      },
    ],
    scroll: 1.9,
  },
  {
    id: "stack",
    island: "stack",
    label: "Stack",
    eyebrow: "El stack",
    title: "Angular y Vue, con TypeScript.",
    body: "Angular de la v14 a la 20 en producción, migración de Vue 2 a Vue 3, SCSS, Angular Material y Bootstrap. Cambio de framework sin cambiar de criterio.",
    tags: ["Angular 14 → 20", "Vue 2 → 3", "TypeScript", "SCSS", "Angular Material"],
  },
  {
    id: "calidad",
    island: "quality",
    label: "Calidad",
    eyebrow: "Calidad",
    title: strengths[1].title,
    body: strengths[1].description,
    tags: ["Playwright", "Karma & Jasmine", "Accesibilidad"],
  },
  {
    id: "proyectos-personales",
    island: "projects",
    label: "Proyectos",
    eyebrow: "Proyectos personales",
    title: "Del login al panel de gestión.",
    body: "Psoas, una plataforma para clínicas de fisioterapia en Angular 20 y Nest.js, y un Trivial para desarrolladores en React. De principio a fin.",
    actions: [{ label: "Ver proyectos", href: "#proyectos", variant: "secondary" }],
  },
  {
    id: "ia",
    island: "ai",
    label: "IA",
    eyebrow: "Forma de trabajar",
    title: strengths[0].title,
    body: strengths[0].description,
    tags: ["Cursor", "Claude Code", "Agentes IA"],
  },
  {
    id: "hablemos",
    island: "cv",
    label: "Hablemos",
    eyebrow: site.availability,
    title: "¿Buscas perfil front-end?",
    body: "Busco equipos que valoren el cuidado del producto tanto como la velocidad. Descarga el CV o escríbeme.",
    actions: [
      {
        label: "Descargar CV",
        href: cvDownloads.design.href,
        download: cvDownloads.design.fileName,
        variant: "primary",
      },
      { label: "Contactar", href: "#contacto", variant: "secondary" },
      { label: "LinkedIn", href: site.linkedin, external: true, variant: "secondary" },
    ],
    scroll: 2,
  },
];
