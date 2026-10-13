import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import type { Group } from "three";

import { BRAND_PALETTE } from "../utils/landingPalette";

const COLORS = {
  pink: "#ffe8f4",
  cyan: "#b8f0ff",
  cta: BRAND_PALETTE[0],
  burgundy: BRAND_PALETTE[2],
  cream: "#fffbfb",
  ink: "#1a1a1a",
} as const;

const TILE_PALETTE = [
  COLORS.pink,
  COLORS.cyan,
  COLORS.cta,
  COLORS.burgundy,
  COLORS.cyan,
  COLORS.pink,
  COLORS.burgundy,
  COLORS.cta,
] as const;

const CYCLE_SECONDS = 10;
const GRID = 3;
const TILE = 0.82;
const GAP = 0.07;
const STEP = TILE + GAP;

type Vec2 = [number, number];
type Vec3 = [number, number, number];

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function easeOutBack(t: number) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2;
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

function gridToWorld(col: number, row: number): Vec3 {
  const x = (col - 1) * STEP;
  const y = (1 - row) * STEP;
  return [x, y, 0.08];
}

const SOLVED: Vec2[] = [
  [0, 0],
  [1, 0],
  [2, 0],
  [0, 1],
  [1, 1],
  [2, 1],
  [0, 2],
  [1, 2],
];

const SCATTER: Vec3[] = [
  [-2.05, 1.55, 0.55],
  [0.15, 2.15, 0.72],
  [2.05, 1.45, 0.48],
  [-2.1, -0.15, 0.62],
  [2.15, -0.25, 0.58],
  [-1.65, -1.65, 0.5],
  [0.05, -2.05, 0.68],
  [1.85, -1.75, 0.45],
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpVec3(a: Vec3, b: Vec3, t: number): Vec3 {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

function cloneGrid(positions: Vec2[]): Vec2[] {
  return positions.map((p) => [p[0], p[1]] as Vec2);
}

/** Single-tile slide toward the empty cell (classic sliding puzzle). */
function slideTile(positions: Vec2[], tile: number, empty: Vec2): Vec2[] {
  const next = cloneGrid(positions);
  const from = next[tile];
  if (from[0] !== empty[0] && from[1] !== empty[1]) return next;
  if (Math.abs(from[0] - empty[0]) + Math.abs(from[1] - empty[1]) !== 1) return next;
  next[tile] = [empty[0], empty[1]];
  return next;
}

const SLIDE_STEPS: { tile: number; duration: number }[] = [
  { tile: 7, duration: 0.34 },
  { tile: 6, duration: 0.34 },
  { tile: 3, duration: 0.34 },
  { tile: 0, duration: 0.34 },
  { tile: 1, duration: 0.34 },
  { tile: 2, duration: 0.34 },
  { tile: 5, duration: 0.34 },
  { tile: 4, duration: 0.34 },
  { tile: 1, duration: 0.34 },
  { tile: 4, duration: 0.34 },
  { tile: 7, duration: 0.34 },
  { tile: 6, duration: 0.34 },
  { tile: 3, duration: 0.34 },
  { tile: 0, duration: 0.34 },
];

type PuzzleKeyframe = { time: number; grids: Vec2[] };

function buildSlideTimeline(): PuzzleKeyframe[] {
  const timeline: PuzzleKeyframe[] = [];
  let t = 3.35;
  let grids = cloneGrid(SOLVED);
  let empty: Vec2 = [2, 2];

  timeline.push({ time: t, grids: cloneGrid(grids) });

  for (const step of SLIDE_STEPS) {
    const from = cloneGrid(grids);
    grids = slideTile(grids, step.tile, empty);
    empty = from[step.tile];
    const start = t;
    t += step.duration;
    timeline.push({ time: start, grids: from });
    timeline.push({ time: t, grids: cloneGrid(grids) });
  }

  return timeline;
}

const SLIDE_TIMELINE = buildSlideTimeline();
const SLIDE_END = SLIDE_TIMELINE[SLIDE_TIMELINE.length - 1]?.time ?? 3.35;
const SCATTER_START = SLIDE_END + 0.85;

function gridAtTime(cycle: number): Vec2[] {
  const assembleEnd = 3.1;

  if (cycle < assembleEnd) {
    return SOLVED;
  }

  if (cycle >= SCATTER_START) {
    return SOLVED;
  }

  for (let i = SLIDE_TIMELINE.length - 1; i >= 0; i--) {
    const frame = SLIDE_TIMELINE[i];
    if (cycle >= frame.time) {
      const next = SLIDE_TIMELINE[i + 1];
      if (!next || cycle >= next.time) return cloneGrid(frame.grids);
      return frame.grids;
    }
  }

  return cloneGrid(SOLVED);
}

function tileWorldAtTime(cycle: number, tileIndex: number): Vec3 {
  const assembleStart = 0.2;
  const assembleEnd = 3.1;

  if (cycle < assembleStart) {
    return SCATTER[tileIndex];
  }

  if (cycle < assembleEnd) {
    const delay = tileIndex * 0.1;
    const local = clamp01((cycle - assembleStart - delay) / 0.78);
    const eased = easeOutBack(local);
    const target = gridToWorld(...SOLVED[tileIndex]);
    return lerpVec3(SCATTER[tileIndex], target, eased);
  }

  if (cycle >= SCATTER_START) {
    const scatterT = easeInOutCubic(clamp01((cycle - SCATTER_START) / 1.05));
    const from = gridToWorld(...SOLVED[tileIndex]);
    return lerpVec3(from, SCATTER[tileIndex], scatterT);
  }

  for (let i = 0; i < SLIDE_TIMELINE.length - 1; i++) {
    const frame = SLIDE_TIMELINE[i];
    const next = SLIDE_TIMELINE[i + 1];
    if (cycle < frame.time || cycle > next.time) continue;
    const local = easeInOutCubic(clamp01((cycle - frame.time) / (next.time - frame.time)));
    const from = gridToWorld(frame.grids[tileIndex][0], frame.grids[tileIndex][1]);
    const to = gridToWorld(next.grids[tileIndex][0], next.grids[tileIndex][1]);
    if (from[0] !== to[0] || from[1] !== to[1]) {
      return lerpVec3(from, to, local);
    }
  }

  const grid = gridAtTime(cycle);
  return gridToWorld(grid[tileIndex][0], grid[tileIndex][1]);
}

type PuzzleTileProps = {
  tileIndex: number;
  color: string;
  cycleTime: MutableRefObject<number>;
  animate: boolean;
};

function PuzzleTile({ tileIndex, color, cycleTime, animate }: PuzzleTileProps) {
  const groupRef = useRef<Group>(null);

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;

    const cycle = animate ? cycleTime.current % CYCLE_SECONDS : 3.5;
    const pos = tileWorldAtTime(cycle, tileIndex);
    group.position.set(pos[0], pos[1], pos[2]);

    const assembleEnd = 3.1;
    const wobble =
      animate && cycle > assembleEnd && cycle < SCATTER_START
        ? Math.sin(cycle * 2.4 + tileIndex * 0.7) * 0.012
        : 0;
    group.rotation.set(0, 0, wobble);
  });

  return (
    <group ref={groupRef}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[TILE, TILE, 0.16]} />
        <meshStandardMaterial color={color} roughness={0.28} metalness={0.12} />
      </mesh>
      <mesh position={[0, 0, 0.082]}>
        <boxGeometry args={[TILE * 0.88, TILE * 0.88, 0.018]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.15}
          metalness={0.05}
          transparent
          opacity={0.22}
        />
      </mesh>
      <mesh position={[TILE * 0.22, TILE * 0.22, 0.09]}>
        <cylinderGeometry args={[0.055, 0.055, 0.04, 16]} />
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.08} />
      </mesh>
    </group>
  );
}

function PuzzleBoard({ animate, cycleTime }: { animate: boolean; cycleTime: MutableRefObject<number> }) {
  const rigRef = useRef<Group>(null);

  useFrame(() => {
    const rig = rigRef.current;
    if (!rig) return;
    const cycle = animate ? cycleTime.current % CYCLE_SECONDS : 3.5;
    rig.rotation.x = 0.22;
    rig.rotation.y = 0.08 + Math.sin(cycle * 0.45) * 0.06;
    rig.rotation.z = Math.sin(cycle * 0.3) * 0.02;
    const breathe = 1 + Math.sin(cycle * 1.1) * 0.012;
    rig.scale.setScalar(breathe);
  });

  const tiles = useMemo(
    () => TILE_PALETTE.map((color, i) => ({ color, i })),
    [],
  );

  return (
    <group ref={rigRef}>
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[STEP * GRID + 0.12, STEP * GRID + 0.12, 0.06]} />
        <meshStandardMaterial color={COLORS.ink} roughness={0.55} metalness={0.08} />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <boxGeometry args={[STEP * GRID - 0.06, STEP * GRID - 0.06, 0.02]} />
        <meshStandardMaterial color={COLORS.cream} roughness={0.65} />
      </mesh>
      <mesh position={[gridToWorld(2, 2)[0], gridToWorld(2, 2)[1], 0.02]}>
        <boxGeometry args={[TILE, TILE, 0.01]} />
        <meshStandardMaterial color={COLORS.cream} roughness={0.8} transparent opacity={0.35} />
      </mesh>
      {tiles.map(({ color, i }) => (
        <PuzzleTile key={i} tileIndex={i} color={color} cycleTime={cycleTime} animate={animate} />
      ))}
    </group>
  );
}

function PuzzleScene({ animate }: { animate: boolean }) {
  const cycleTime = useRef(0);

  useFrame((_, delta) => {
    if (animate) {
      cycleTime.current += delta;
      if (cycleTime.current > CYCLE_SECONDS * 6) {
        cycleTime.current %= CYCLE_SECONDS;
      }
    }
  });

  return <PuzzleBoard animate={animate} cycleTime={cycleTime} />;
}

export function HeroShapes3D() {
  const [ready, setReady] = useState(false);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    setReady(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setAnimate(!mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (!ready) {
    return <div className="hero-shapes-fallback hero-puzzle-fallback" aria-hidden />;
  }

  return (
    <Canvas
      className="hero-shapes-canvas"
      camera={{ position: [0, 0, 5.4], fov: 38 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.88} />
      <directionalLight position={[3, 5, 6]} intensity={1.15} />
      <directionalLight position={[-4, 2, 3]} intensity={0.45} color={COLORS.cyan} />
      <pointLight position={[0, 0, 4]} intensity={0.35} />
      <PuzzleScene animate={animate} />
    </Canvas>
  );
}
