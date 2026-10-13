/** Paleta synthwave (10 tonos) — referencia visual del gradiente de marca. */

export const BRAND_PALETTE = [

  "#FF207D",

  "#A81B8E",

  "#6B0EAE",

  "#4C0B9F",

  "#380894",

  "#2D2BB1",

  "#3B53DC",

  "#4479E9",

  "#4BAFF3",

  "#4DE7FF",

] as const;



/** Progreso de scroll 0→1 a lo largo de la home (fondo animado). `ink` = color de títulos legible sobre ese fondo. */

export const LANDING_SCROLL_STOPS: { at: number; color: string; ink: string }[] = [

  { at: 0, color: "#ffffff", ink: BRAND_PALETTE[2] },

  { at: 0.1, color: "#ffe8f4", ink: BRAND_PALETTE[1] },

  { at: 0.22, color: "#ffffff", ink: BRAND_PALETTE[2] },

  { at: 0.35, color: "#f0e6ff", ink: BRAND_PALETTE[3] },

  { at: 0.48, color: "#ffffff", ink: BRAND_PALETTE[5] },

  { at: 0.62, color: "#e3f7ff", ink: BRAND_PALETTE[5] },

  { at: 0.72, color: BRAND_PALETTE[7], ink: "#ffffff" },

  { at: 0.82, color: BRAND_PALETTE[2], ink: BRAND_PALETTE[9] },

  { at: 0.92, color: BRAND_PALETTE[4], ink: "#ff8ad4" },

  { at: 1, color: "#000000", ink: BRAND_PALETTE[9] },

];



type Rgb = [number, number, number];



function parseHex(hex: string): Rgb {

  const normalized = hex.replace("#", "");

  const value = Number.parseInt(normalized, 16);

  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];

}



function mixRgb(a: string, b: string, t: number): Rgb {

  const [r1, g1, b1] = parseHex(a);

  const [r2, g2, b2] = parseHex(b);

  const mix = (from: number, to: number) => Math.round(from + (to - from) * t);

  return [mix(r1, r2), mix(g1, g2), mix(b1, b2)];

}



function rgbCss([r, g, b]: Rgb): string {

  return `rgb(${r} ${g} ${b})`;

}



export function mixHex(a: string, b: string, t: number): string {

  return rgbCss(mixRgb(a, b, t));

}



/** Luminancia relativa WCAG. */

function luminance(rgb: Rgb): number {

  const [r, g, b] = rgb.map((value) => {

    const c = value / 255;

    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;

  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;

}



function contrastRatio(a: Rgb, b: Rgb): number {

  const la = luminance(a);

  const lb = luminance(b);

  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);

}



function scrollSegment(progress: number) {

  const p = Math.min(1, Math.max(0, progress));

  for (let i = 0; i < LANDING_SCROLL_STOPS.length - 1; i += 1) {

    const left = LANDING_SCROLL_STOPS[i];

    const right = LANDING_SCROLL_STOPS[i + 1];

    if (p <= right.at) {

      const span = right.at - left.at || 1;

      return { left, right, local: (p - left.at) / span };

    }

  }

  const last = LANDING_SCROLL_STOPS[LANDING_SCROLL_STOPS.length - 1];

  return { left: last, right: last, local: 0 };

}



export function landingBackgroundAt(progress: number): string {

  const { left, right, local } = scrollSegment(progress);

  return mixHex(left.color, right.color, local);

}



/**

 * Color de títulos para el fondo actual. Interpola entre los `ink` de cada tramo y,

 * si en el cruce claro→oscuro la mezcla pierde contraste, salta al extremo más legible.

 */

export function landingInkAt(progress: number): string {

  const { left, right, local } = scrollSegment(progress);

  const background = mixRgb(left.color, right.color, local);

  const ink = mixRgb(left.ink, right.ink, local);

  if (contrastRatio(ink, background) >= 4.5) {

    return rgbCss(ink);

  }

  const leftInk = parseHex(left.ink);

  const rightInk = parseHex(right.ink);

  return rgbCss(

    contrastRatio(leftInk, background) >= contrastRatio(rightInk, background) ? leftInk : rightInk,

  );

}



export function landingDocumentScrollProgress(): number {

  const maxScroll = Math.max(

    1,

    document.documentElement.scrollHeight - window.innerHeight,

  );

  return Math.min(1, Math.max(0, window.scrollY / maxScroll));

}



/** Progreso 0→1 mientras el elemento sube por el viewport (entrada por abajo). */

export function elementScrollProgress(element: HTMLElement): number {

  const rect = element.getBoundingClientRect();

  const vh = window.innerHeight;

  const start = vh * 0.92;

  const end = vh * 0.22;

  return Math.min(1, Math.max(0, (start - rect.top) / (start - end)));

}



export function chipRedMix(index: number, count: number, progress: number): number {

  if (count <= 1) {

    return progress;

  }

  const slot = 1 / count;

  const start = index * slot;

  const end = (index + 1) * slot;

  return Math.min(1, Math.max(0, (progress - start) / Math.max(0.001, end - start)));

}


