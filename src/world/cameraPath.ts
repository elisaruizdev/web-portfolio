import { CatmullRomCurve3, Vector3 } from "three";

import { islands, type Island, type WorldStop } from "./worldData";

const UP = new Vector3(0, 1, 0);

/** Plano general: alto y lejos, mirando la isla entera */
const ESTABLISH = new Vector3(0, 9.5, 15);
const ESTABLISH_LOOK = new Vector3(0, 0.6, 0);
/** Dentro de la isla: a la altura de los objetos, mirando el centro de la escena */
const INSIDE = new Vector3(0, 3.2, 8);
const INSIDE_LOOK = new Vector3(0, 1.7, 0);
/** Altura extra del salto aéreo entre islas */
const HOP_HEIGHT = 6;

function onIsland(island: Island, offset: Vector3) {
  return offset.clone().applyAxisAngle(UP, island.yaw).add(new Vector3(...island.position));
}

export type CameraPath = {
  position: CatmullRomCurve3;
  look: CatmullRomCurve3;
  stops: number;
};

/**
 * Por cada parada: plano general → interior → (salto aéreo hacia la siguiente).
 * La parada i ocupa los puntos 3i … 3i+3 de la curva.
 */
export function buildCameraPath(stops: WorldStop[]): CameraPath {
  const position: Vector3[] = [];
  const look: Vector3[] = [];

  stops.forEach((stop, index) => {
    const island = islands[stop.island];
    position.push(onIsland(island, ESTABLISH), onIsland(island, INSIDE));
    look.push(onIsland(island, ESTABLISH_LOOK), onIsland(island, INSIDE_LOOK));

    const next = stops[index + 1];
    if (!next) return;
    const nextIsland = islands[next.island];
    const from = onIsland(island, INSIDE);
    const to = onIsland(nextIsland, ESTABLISH);
    const hop = from.lerp(to, 0.5);
    hop.y = Math.max(from.y, to.y) + HOP_HEIGHT;
    position.push(hop);
    look.push(onIsland(island, INSIDE_LOOK).lerp(onIsland(nextIsland, ESTABLISH_LOOK), 0.7));
  });

  return {
    position: new CatmullRomCurve3(position, false, "centripetal"),
    look: new CatmullRomCurve3(look, false, "centripetal"),
    stops: stops.length,
  };
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** Llega frenando al interior (la cámara se posa mientras se lee la tarjeta)… */
function arrive(t: number) {
  return lerp(t, 1 - (1 - t) ** 3, 0.65);
}

/** …y arranca suave al salir hacia la siguiente isla */
function leave(t: number) {
  return lerp(t, t ** 3, 0.65);
}

/** Índice de punto de curva para un progreso de parada (ver worldStore.progress) */
function curveIndex(path: CameraPath, progress: number) {
  const last = path.stops - 1;
  const clamped = Math.min(Math.max(progress, 0), path.stops);
  const stop = Math.min(Math.floor(clamped), last);
  const t = clamped - stop;
  const base = stop * 3;

  if (stop === last) return base + arrive(Math.min(t / 0.55, 1));
  if (t < 0.5) return base + arrive(t / 0.5);
  return base + 1 + 2 * leave((t - 0.5) / 0.5);
}

export function sampleCameraPath(
  path: CameraPath,
  progress: number,
  outPosition: Vector3,
  outLook: Vector3,
) {
  const u = curveIndex(path, progress) / (path.position.points.length - 1);
  path.position.getPoint(u, outPosition);
  path.look.getPoint(u, outLook);
}
