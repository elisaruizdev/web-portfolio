import type { CSSProperties, ReactNode } from "react";

/** Términos a subrayar en la trayectoria. Los más largos van primero para no partir coincidencias. */
const EXPERIENCE_KEYWORDS = [
  "Google Analytics Universal",
  "Adobe Illustrator",
  "Adobe Premiere",
  "Angular Material",
  "formularios reactivos",
  "filtros avanzados",
  "pruebas funcionales",
  "acuerdos publicitarios",
  "planes de estudios",
  "Facebook Ads",
  "Google Analytics",
  "lazy loading",
  "deuda técnica",
  "gestión de estados",
  "APIs REST",
  "Bootstrap 4",
  "Bootstrap 5",
  "Vue 2",
  "Vue 3",
  "InDesign",
  "Photoshop",
  "DaVinci",
  "Playwright",
  "Storybook",
  "JavaScript",
  "TypeScript",
  "accesibilidad",
  "migración",
  "dashboards",
  "backoffice",
  "posicionamiento",
  "Illustrator",
  "Premiere",
  "Figma",
  "Django",
  "Python",
  "guards",
  "GA4",
  "GTM",
  "RRSS",
  "SCSS",
  "Angular",
  "Vue",
  "Bootstrap",
  "APIs",
].sort((a, b) => b.length - a.length);

const KEYWORD_PATTERN = new RegExp(
  `(${EXPERIENCE_KEYWORDS.map((keyword) => keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
  "gi",
);

const KEYWORD_LOOKUP = new Set(EXPERIENCE_KEYWORDS.map((keyword) => keyword.toLowerCase()));

export function highlightText(text: string): ReactNode {
  KEYWORD_PATTERN.lastIndex = 0;
  const parts = text.split(KEYWORD_PATTERN);
  return parts.map((part, index) =>
    KEYWORD_LOOKUP.has(part.toLowerCase()) ? (
      <span
        key={`${part}-${index}`}
        className="experience-key"
        style={{ "--key-delay": `${Math.min(index, 14) * 0.05}s` } as CSSProperties}
      >
        {part}
        <svg
          className="experience-key__mark"
          viewBox="0 0 120 10"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            d="M2.4 6.6 C 22 2.1, 40 9.8, 60 6.2 C 80 2.6, 98 9.4, 117.6 5.5"
            pathLength={1}
          />
        </svg>
      </span>
    ) : (
      part
    ),
  );
}
