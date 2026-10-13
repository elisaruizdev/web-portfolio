import { HERSHEY_SCRIPT, HERSHEY_UNITS_PER_EM } from "./hersheyScript";

/* Texto de tubo inflado: cada letra es una línea central (fuente de un solo
   trazo) y alrededor se modela un cilindro de radio constante, como el lettering
   3D de Illustrator. Se calcula en CPU (computeTubeImage, sin DOM) y se pinta en
   un canvas (drawTubeImage):
   1. Las líneas centrales se suavizan (Catmull-Rom centrípeta) y se muestrean.
   2. Donde un trazo cruza a otro, el que se escribe después se eleva para pasar
      por encima, como un tubo que se apoya sobre el anterior.
   3. Cada píxel toma la normal del cilindro más cercano (o del que está encima)
      y se ilumina con la luz medida en la referencia: rasante desde la
      izquierda y arriba, mate, mapeada a una rampa de color (rosa o blanca).
   4. Una oclusión suave oscurece el tubo de abajo junto a los cruces y una
      sombra leve lo despega del fondo. */

export type TubePoint = { x: number; y: number; order: number };

export type TubeLayout = {
  /** Líneas centrales en em, con el eje y hacia abajo y el origen en la caja del tubo. */
  strokes: TubePoint[][];
  width: number;
  height: number;
  /** Alto desde lo más alto del tubo hasta la base de las letras: los rabos quedan por debajo. */
  bodyHeight: number;
  radius: number;
};

type Glyph = { advance: number; strokes: [number, number][][] };

/** Retoques de Hershey: el guion es casi una raya y el rabo de la p baja más
    que la altura de la x; se acortan para que la palabra quede compacta. */
const GLYPH_OVERRIDES: Record<string, string> = {
  "-": "16:4,9 12,9",
  p: "15:1,5 3,8 4,10 3,6 -1,-6|3,6 4,8 6,9 8,9 10,8 11,6 11,4 10,2 9,1 7,0|3,1 5,0 8,0 11,1 13,2 16,5",
};
const glyphCache = new Map<string, Glyph | null>();

function getGlyph(char: string): Glyph | null {
  const cached = glyphCache.get(char);
  if (cached !== undefined) return cached;
  const raw = GLYPH_OVERRIDES[char] ?? HERSHEY_SCRIPT[char];
  const glyph = raw ? parseGlyph(raw) : null;
  glyphCache.set(char, glyph);
  return glyph;
}

function parseGlyph(raw: string): Glyph {
  const [advance, body] = raw.split(":");
  const strokes = body
    ? body.split("|").map((stroke) => stroke.split(" ").map((point) => point.split(",").map(Number) as [number, number]))
    : [];
  return { advance: Number(advance), strokes };
}

export function layoutTubeText(text: string, { radius, stretch }: { radius: number; stretch: number }): TubeLayout {
  const strokes: TubePoint[][] = [];
  const spaceAdvance = getGlyph(" ")?.advance ?? 12;
  let pen = 0;
  let order = 0;

  for (const char of text) {
    const glyph = getGlyph(char);
    if (!glyph) {
      pen += spaceAdvance;
      continue;
    }
    for (const stroke of glyph.strokes) {
      const points = stroke.map(([x, y]) => ({
        x: ((pen + x) * stretch) / HERSHEY_UNITS_PER_EM,
        y: -y / HERSHEY_UNITS_PER_EM,
        order: order++,
      }));
      // Las letras enlazadas empiezan donde acaba la anterior: un solo tubo continuo.
      const previous = findStrokeEndingAt(strokes, points[0]);
      if (previous) previous.push(...points.slice(1));
      else strokes.push(points);
    }
    pen += glyph.advance;
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const stroke of strokes) {
    for (const point of stroke) {
      minX = Math.min(minX, point.x);
      minY = Math.min(minY, point.y);
      maxX = Math.max(maxX, point.x);
      maxY = Math.max(maxY, point.y);
    }
  }
  if (!strokes.length) return { strokes, width: 0, height: 0, bodyHeight: 0, radius };

  for (const stroke of strokes) {
    for (const point of stroke) {
      point.x += radius - minX;
      point.y += radius - minY;
    }
  }
  // La línea base de Hershey está en y = 0.
  const baseline = radius - minY;
  return {
    strokes,
    width: maxX - minX + radius * 2,
    height: maxY - minY + radius * 2,
    bodyHeight: Math.min(baseline, maxY - minY + radius) + radius,
    radius,
  };
}

function findStrokeEndingAt(strokes: TubePoint[][], point: TubePoint) {
  for (let index = strokes.length - 1; index >= 0; index--) {
    const last = strokes[index][strokes[index].length - 1];
    if (Math.abs(last.x - point.x) < 1e-6 && Math.abs(last.y - point.y) < 1e-6) return strokes[index];
  }
  return null;
}

/* ---------- Render ---------- */

/** Luz ajustada a la referencia: t = base + x·nx + y·ny + z·nz (y de pantalla hacia abajo). */
const LIGHT = { base: 0.635, x: -0.585, y: -0.39, z: 0.095 };

export type TubeTone = "pink" | "white";

/** Rampas de color, de la cara en sombra a la iluminada. La rosa está muestreada
    en la referencia; la blanca reproduce su misma progresión de luminancia
    (del 18 % al 100 %), con las sombras teñidas por el rebote del fondo rosa. */
const RAMPS: Record<TubeTone, [number, number, number, number][]> = {
  pink: [
    [0, 150, 6, 67],
    [0.119, 169, 20, 84],
    [0.28, 189, 39, 103],
    [0.44, 203, 58, 117],
    [0.568, 217, 73, 132],
    [0.695, 227, 88, 143],
    [0.797, 237, 100, 154],
    [0.881, 244, 110, 163],
    [0.949, 252, 118, 171],
    [1, 255, 124, 176],
  ],
  white: [
    [0, 150, 104, 127],
    [0.119, 170, 124, 146],
    [0.28, 192, 147, 168],
    [0.44, 208, 166, 186],
    [0.568, 224, 186, 204],
    [0.695, 236, 204, 219],
    [0.797, 245, 220, 232],
    [0.881, 251, 235, 243],
    [0.949, 254, 248, 251],
    [1, 255, 255, 255],
  ],
};

const SHADOW_COLOR = "rgb(110 0 48 / 0.3)";

/** Margen alrededor de la caja del tubo para la sombra, en em. */
export const TUBE_PAD_EM = 0.3;

type Tube = {
  x: Float64Array;
  y: Float64Array;
  order: Float64Array;
  arc: Float64Array;
  lift: Float64Array;
  length: number;
};

export type TubeRequest = { layout: TubeLayout; fontPx: number; dpr: number; tone: TubeTone };

/** Píxeles del tubo ya sombreados y cómo colocarlos en el canvas de salida. */
export type TubeImage = ReturnType<typeof computeTubeImage>;

export function computeTubeImage({ layout, fontPx, dpr, tone }: TubeRequest) {
  const padCss = TUBE_PAD_EM * fontPx;
  const outWidth = Math.max(1, Math.round((layout.width * fontPx + padCss * 2) * dpr));
  const outHeight = Math.max(1, Math.round((layout.height * fontPx + padCss * 2) * dpr));

  // El tubo se calcula solo en su caja (con un margen por si la curva se sale un
  // poco); el margen exterior del canvas es para la sombra. Basta la densidad de
  // la pantalla: los bordes ya salen suavizados porque la cobertura se calcula
  // de forma exacta, y supermuestrear cuadruplicaba el coste sin verse.
  const density = Math.max(1, dpr);
  const ss = density / dpr;
  const scale = fontPx * density;
  const R = layout.radius * scale;
  const margin = Math.ceil(R * 0.5);
  const W = Math.ceil(layout.width * scale) + margin * 2;
  const H = Math.ceil(layout.height * scale) + margin * 2;

  // La distancia a cada segmento es exacta, así que basta un segmento cada R/2.
  const tubes = layout.strokes.map((stroke) =>
    sampleStroke(
      stroke.map((point) => ({ x: point.x * scale + margin, y: point.y * scale + margin, order: point.order })),
      Math.max(0.5, R / 2),
    ),
  );
  liftCrossings(tubes, R);
  const surface = rasterize(tubes, W, H, R);
  const pixels = shade(surface, W, H, R, buildRamp(tone));

  return {
    pixels,
    width: W,
    height: H,
    outWidth,
    outHeight,
    /** Posición y escala de la capa del tubo dentro del canvas de salida. */
    offset: padCss * dpr - margin / ss,
    scale: 1 / ss,
    /** Radio del tubo en píxeles del canvas de salida. */
    radius: R / ss,
  };
}

export function drawTubeImage(canvas: HTMLCanvasElement, image: TubeImage) {
  const layer = document.createElement("canvas");
  layer.width = image.width;
  layer.height = image.height;
  layer.getContext("2d")?.putImageData(new ImageData(image.pixels, image.width, image.height), 0, 0);

  canvas.width = image.outWidth;
  canvas.height = image.outHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.shadowColor = SHADOW_COLOR;
  ctx.shadowBlur = image.radius * 1.1;
  ctx.shadowOffsetX = image.radius * 0.2;
  ctx.shadowOffsetY = image.radius * 0.45;
  ctx.drawImage(layer, image.offset, image.offset, image.width * image.scale, image.height * image.scale);
}

/* Catmull-Rom centrípeta: pasa por los puntos de Hershey sin bucles en las esquinas. */
function sampleStroke(points: TubePoint[], spacing: number): Tube {
  const clean = points.filter(
    (point, index) => index === 0 || Math.hypot(point.x - points[index - 1].x, point.y - points[index - 1].y) > 1e-3,
  );
  const xs: number[] = [];
  const ys: number[] = [];
  const orders: number[] = [];

  for (let i = 0; i < clean.length - 1; i++) {
    const p1 = clean[i];
    const p2 = clean[i + 1];
    const p0 = clean[i - 1] ?? { x: 2 * p1.x - p2.x, y: 2 * p1.y - p2.y, order: p1.order };
    const p3 = clean[i + 2] ?? { x: 2 * p2.x - p1.x, y: 2 * p2.y - p1.y, order: p2.order };
    const steps = Math.max(1, Math.ceil(Math.hypot(p2.x - p1.x, p2.y - p1.y) / spacing));
    for (let step = 0; step < steps; step++) {
      const u = step / steps;
      const [x, y] = catmullRom(p0, p1, p2, p3, u);
      xs.push(x);
      ys.push(y);
      orders.push(p1.order + (p2.order - p1.order) * u);
    }
  }
  const last = clean[clean.length - 1];
  xs.push(last.x);
  ys.push(last.y);
  orders.push(last.order);

  const length = xs.length;
  const arc = new Float64Array(length);
  for (let i = 1; i < length; i++) arc[i] = arc[i - 1] + Math.hypot(xs[i] - xs[i - 1], ys[i] - ys[i - 1]);
  return {
    x: Float64Array.from(xs),
    y: Float64Array.from(ys),
    order: Float64Array.from(orders),
    arc,
    lift: new Float64Array(length),
    length,
  };
}

function catmullRom(p0: TubePoint, p1: TubePoint, p2: TubePoint, p3: TubePoint, u: number): [number, number] {
  const t0 = 0;
  const t1 = t0 + Math.max(1e-4, Math.sqrt(Math.hypot(p1.x - p0.x, p1.y - p0.y)));
  const t2 = t1 + Math.max(1e-4, Math.sqrt(Math.hypot(p2.x - p1.x, p2.y - p1.y)));
  const t3 = t2 + Math.max(1e-4, Math.sqrt(Math.hypot(p3.x - p2.x, p3.y - p2.y)));
  const t = t1 + (t2 - t1) * u;
  const mix = (a: [number, number], b: [number, number], k: number): [number, number] => [
    a[0] + (b[0] - a[0]) * k,
    a[1] + (b[1] - a[1]) * k,
  ];
  const a1 = mix([p0.x, p0.y], [p1.x, p1.y], (t - t0) / (t1 - t0));
  const a2 = mix([p1.x, p1.y], [p2.x, p2.y], (t - t1) / (t2 - t1));
  const a3 = mix([p2.x, p2.y], [p3.x, p3.y], (t - t2) / (t3 - t2));
  const b1 = mix(a1, a2, (t - t0) / (t2 - t0));
  const b2 = mix(a2, a3, (t - t1) / (t3 - t1));
  return mix(b1, b2, (t - t1) / (t2 - t1));
}

/* Cruces: el trazo escrito después sube lo justo para pasar por encima del otro
   en toda la zona en la que se solapan; los toques en los extremos (enlaces de
   letras) no se elevan y se funden como dos tubos pegados. */
function liftCrossings(tubes: Tube[], R: number) {
  const cell = R * 2;
  const grid = new Map<number, number[]>();
  const segTube: number[] = [];
  const segIndex: number[] = [];

  tubes.forEach((tube, k) => {
    for (let j = 0; j < tube.length - 1; j++) {
      const id = segTube.length;
      segTube.push(k);
      segIndex.push(j);
      const x0 = Math.floor(Math.min(tube.x[j], tube.x[j + 1]) / cell);
      const x1 = Math.floor(Math.max(tube.x[j], tube.x[j + 1]) / cell);
      const y0 = Math.floor(Math.min(tube.y[j], tube.y[j + 1]) / cell);
      const y1 = Math.floor(Math.max(tube.y[j], tube.y[j + 1]) / cell);
      for (let cx = x0; cx <= x1; cx++) {
        for (let cy = y0; cy <= y1; cy++) {
          const key = cy * 100000 + cx;
          const bucket = grid.get(key);
          if (bucket) bucket.push(id);
          else grid.set(key, [id]);
        }
      }
    }
  });

  const seen = new Set<number>();
  const bumps: { tube: number; arc: number; half: number }[] = [];
  const segCount = segTube.length;

  for (const bucket of grid.values()) {
    for (let a = 0; a < bucket.length; a++) {
      for (let b = a + 1; b < bucket.length; b++) {
        const idA = Math.min(bucket[a], bucket[b]);
        const idB = Math.max(bucket[a], bucket[b]);
        const pairKey = idA * segCount + idB;
        if (seen.has(pairKey)) continue;
        seen.add(pairKey);

        const ta = tubes[segTube[idA]];
        const tb = tubes[segTube[idB]];
        const ja = segIndex[idA];
        const jb = segIndex[idB];
        const rx = ta.x[ja + 1] - ta.x[ja];
        const ry = ta.y[ja + 1] - ta.y[ja];
        const sx = tb.x[jb + 1] - tb.x[jb];
        const sy = tb.y[jb + 1] - tb.y[jb];
        const denom = rx * sy - ry * sx;
        if (Math.abs(denom) < 1e-9) continue;
        const qx = tb.x[jb] - ta.x[ja];
        const qy = tb.y[jb] - ta.y[ja];
        const u = (qx * sy - qy * sx) / denom;
        const v = (qx * ry - qy * rx) / denom;
        if (u < 0 || u > 1 || v < 0 || v > 1) continue;

        const arcA = ta.arc[ja] + (ta.arc[ja + 1] - ta.arc[ja]) * u;
        const arcB = tb.arc[jb] + (tb.arc[jb + 1] - tb.arc[jb]) * v;
        if (ta === tb && Math.abs(arcA - arcB) < R * 3) continue;
        const nearEnd = (tube: Tube, arc: number) => arc < R * 1.25 || arc > tube.arc[tube.length - 1] - R * 1.25;
        if (nearEnd(ta, arcA) || nearEnd(tb, arcB)) continue;

        const orderA = ta.order[ja] + (ta.order[ja + 1] - ta.order[ja]) * u;
        const orderB = tb.order[jb] + (tb.order[jb + 1] - tb.order[jb]) * v;
        const sin = Math.abs(denom) / (Math.hypot(rx, ry) * Math.hypot(sx, sy));
        const half = (R * 2) / Math.max(sin, 0.2) + R * 0.25;
        bumps.push(
          orderA > orderB ? { tube: segTube[idA], arc: arcA, half } : { tube: segTube[idB], arc: arcB, half },
        );
      }
    }
  }

  const height = R * 1.1;
  const ramp = R * 1.5;
  for (const bump of bumps) {
    const tube = tubes[bump.tube];
    for (let j = 0; j < tube.length; j++) {
      const distance = Math.abs(tube.arc[j] - bump.arc);
      if (distance >= bump.half + ramp) continue;
      const k = distance <= bump.half ? 1 : smoothstep(1 - (distance - bump.half) / ramp);
      tube.lift[j] = Math.max(tube.lift[j], height * k);
    }
  }
}

type Surface = {
  alpha: Float32Array;
  z: Float32Array;
  nx: Float32Array;
  ny: Float32Array;
  nz: Float32Array;
};

/* Cada segmento es una cápsula de radio R. En cada píxel gana la superficie más
   alta, salvo dentro del mismo tramo de tubo, donde manda la línea central más
   cercana para que el cilindro sea continuo. */
function rasterize(tubes: Tube[], W: number, H: number, R: number): Surface {
  const N = W * H;
  const alpha = new Float32Array(N);
  const z = new Float32Array(N).fill(-1);
  const h = new Float32Array(N);
  const nx = new Float32Array(N);
  const ny = new Float32Array(N);
  const nz = new Float32Array(N);
  const owner = new Int32Array(N).fill(-1);
  const ownerArc = new Float32Array(N);
  const reach = R + 0.75;
  const local = R * 2.5;

  tubes.forEach((tube, k) => {
    const segments = Math.max(1, tube.length - 1);
    for (let j = 0; j < segments; j++) {
      const j1 = Math.min(j + 1, tube.length - 1);
      const ax = tube.x[j];
      const ay = tube.y[j];
      const bx = tube.x[j1];
      const by = tube.y[j1];
      const dx = bx - ax;
      const dy = by - ay;
      const len2 = dx * dx + dy * dy;
      const len = Math.sqrt(len2);
      // Normal unitaria: los lados rectos de la cápsula son el segmento desplazado ±reach.
      const ux = len > 0 ? (-dy / len) * reach : 0;
      const uy = len > 0 ? (dx / len) * reach : 0;
      const xMin = Math.max(0, Math.floor(Math.min(ax, bx) - reach));
      const xMax = Math.min(W - 1, Math.ceil(Math.max(ax, bx) + reach));
      const yMin = Math.max(0, Math.floor(Math.min(ay, by) - reach));
      const yMax = Math.min(H - 1, Math.ceil(Math.max(ay, by) + reach));

      for (let py = yMin; py <= yMax; py++) {
        const cy = py + 0.5;
        // Tramo de la fila dentro de la cápsula: extremos de los dos círculos y de los dos lados.
        let left = Infinity;
        let right = -Infinity;
        const ea = reach * reach - (cy - ay) * (cy - ay);
        if (ea >= 0) {
          const w = Math.sqrt(ea);
          left = Math.min(left, ax - w);
          right = Math.max(right, ax + w);
        }
        const eb = reach * reach - (cy - by) * (cy - by);
        if (eb >= 0) {
          const w = Math.sqrt(eb);
          left = Math.min(left, bx - w);
          right = Math.max(right, bx + w);
        }
        if (dy !== 0) {
          const k1 = (cy - ay - uy) / dy;
          if (k1 >= 0 && k1 <= 1) {
            const x = ax + ux + dx * k1;
            left = Math.min(left, x);
            right = Math.max(right, x);
          }
          const k2 = (cy - ay + uy) / dy;
          if (k2 >= 0 && k2 <= 1) {
            const x = ax - ux + dx * k2;
            left = Math.min(left, x);
            right = Math.max(right, x);
          }
        }
        if (left > right) continue;
        const x0 = Math.max(xMin, Math.floor(left - 0.5));
        const x1 = Math.min(xMax, Math.ceil(right - 0.5));

        for (let px = x0; px <= x1; px++) {
          const cx = px + 0.5;
          let t = len2 > 0 ? ((cx - ax) * dx + (cy - ay) * dy) / len2 : 0;
          t = t < 0 ? 0 : t > 1 ? 1 : t;
          const ox = cx - (ax + dx * t);
          const oy = cy - (ay + dy * t);
          const d2 = ox * ox + oy * oy;
          if (d2 > reach * reach) continue;
          const d = Math.sqrt(d2);
          const coverage = Math.min(1, R + 0.5 - d);
          if (coverage <= 0) continue;

          const i = py * W + px;
          const height = Math.sqrt(Math.max(0, R * R - d2));
          const lift = tube.lift[j] + (tube.lift[j1] - tube.lift[j]) * t;
          const top = lift + height;
          const arc = tube.arc[j] + (tube.arc[j1] - tube.arc[j]) * t;
          if (coverage > alpha[i]) alpha[i] = coverage;

          let wins: boolean;
          if (owner[i] < 0) wins = true;
          else if (owner[i] === k && Math.abs(ownerArc[i] - arc) < local) wins = height > h[i];
          else wins = top > z[i];
          if (!wins) continue;

          const norm = Math.max(d, R);
          z[i] = top;
          h[i] = height;
          nx[i] = ox / norm;
          ny[i] = oy / norm;
          nz[i] = height / R;
          owner[i] = k;
          ownerArc[i] = arc;
        }
      }
    }
  });

  return { alpha, z, nx, ny, nz };
}

function shade(surface: Surface, W: number, H: number, R: number, ramp: Uint8ClampedArray) {
  const { alpha, z, nx, ny, nz } = surface;
  const N = W * H;

  // Oclusión: la superficie desplazada hacia la luz y difuminada tapa a la de abajo.
  const heights = new Float32Array(N);
  for (let i = 0; i < N; i++) heights[i] = z[i] > 0 ? z[i] : 0;
  const blurRadius = Math.max(1, Math.round(R * 0.45));
  const soft = boxBlur(boxBlur(heights, W, H, blurRadius), W, H, blurRadius);
  const offX = Math.round(-R * 0.42);
  const offY = Math.round(-R * 0.28);

  const pixels = new Uint8ClampedArray(N * 4);
  for (let y = 0; y < H; y++) {
    const sy = Math.min(H - 1, Math.max(0, y + offY));
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      if (alpha[i] <= 0) continue;
      let t = LIGHT.base + LIGHT.x * nx[i] + LIGHT.y * ny[i] + LIGHT.z * nz[i];
      // Saturación suave en la cara iluminada, como en la referencia.
      if (t > 0.8) t = 0.8 + 0.2 * (1 - Math.exp(-(t - 0.8) / 0.2));

      const sx = Math.min(W - 1, Math.max(0, x + offX));
      const occluder = soft[sy * W + sx];
      const occlusion = clamp01((occluder - heights[i] - R * 0.25) / (R * 0.7));
      t *= 1 - 0.55 * occlusion;

      const level = Math.round(clamp01(t) * 255) * 3;
      const o = i * 4;
      pixels[o] = ramp[level];
      pixels[o + 1] = ramp[level + 1];
      pixels[o + 2] = ramp[level + 2];
      pixels[o + 3] = Math.round(alpha[i] * 255);
    }
  }
  return pixels;
}

const rampCache = new Map<TubeTone, Uint8ClampedArray>();

function buildRamp(tone: TubeTone) {
  const cached = rampCache.get(tone);
  if (cached) return cached;
  const stops = RAMPS[tone];
  const ramp = new Uint8ClampedArray(256 * 3);
  for (let level = 0; level < 256; level++) {
    const t = level / 255;
    let stop = 0;
    while (stop < stops.length - 2 && t > stops[stop + 1][0]) stop++;
    const [t0, r0, g0, b0] = stops[stop];
    const [t1, r1, g1, b1] = stops[stop + 1];
    const k = (t - t0) / (t1 - t0);
    ramp[level * 3] = r0 + (r1 - r0) * k;
    ramp[level * 3 + 1] = g0 + (g1 - g0) * k;
    ramp[level * 3 + 2] = b0 + (b1 - b0) * k;
  }
  rampCache.set(tone, ramp);
  return ramp;
}

function boxBlur(src: Float32Array, W: number, H: number, r: number) {
  const tmp = new Float32Array(W * H);
  const dst = new Float32Array(W * H);
  const size = r * 2 + 1;
  for (let y = 0; y < H; y++) {
    const row = y * W;
    let sum = 0;
    for (let x = -r; x <= r; x++) sum += src[row + Math.min(W - 1, Math.max(0, x))];
    for (let x = 0; x < W; x++) {
      tmp[row + x] = sum / size;
      sum += src[row + Math.min(W - 1, x + r + 1)] - src[row + Math.max(0, x - r)];
    }
  }
  for (let x = 0; x < W; x++) {
    let sum = 0;
    for (let y = -r; y <= r; y++) sum += tmp[Math.min(H - 1, Math.max(0, y)) * W + x];
    for (let y = 0; y < H; y++) {
      dst[y * W + x] = sum / size;
      sum += tmp[Math.min(H - 1, y + r + 1) * W + x] - tmp[Math.max(0, y - r) * W + x];
    }
  }
  return dst;
}

function smoothstep(k: number) {
  const c = clamp01(k);
  return c * c * (3 - 2 * c);
}

function clamp01(value: number) {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}
