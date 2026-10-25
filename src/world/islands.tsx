/** Las islas del mundo: cada una es un diorama de neón sobre una plataforma hexagonal. */

import type { ReactNode } from "react";
import { AdditiveBlending, DoubleSide } from "three";

import {
  Bob,
  Glow,
  GroundGlow,
  NeonBox,
  NeonCylinder,
  NeonTube,
  Screen,
  Sign,
  Sparkles,
  Spin,
  glowMaterial,
  type DrawFn,
} from "./neonKit";
import { NEON, islands, type IslandKind, type Vec3 } from "./worldData";

const PLATFORM_RADIUS = 4.4;
/** Altura de la retícula del suelo (las islas flotan sobre ella) */
export const GROUND_Y = -1.6;
const HALF_PI = Math.PI / 2;

/* ——— Dibujos de pantallas ——— */

function screenBase(ctx: CanvasRenderingContext2D, w: number, h: number, border: string) {
  ctx.fillStyle = "#0b0626";
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = border;
  ctx.lineWidth = Math.max(4, w * 0.012);
  ctx.strokeRect(0, 0, w, h);
}

/** Diff de una revisión: líneas eliminadas (magenta) y añadidas (menta) */
const reviewDiff: DrawFn = (ctx, w, h) => {
  screenBase(ctx, w, h, NEON.violet);
  const rows = 8;
  const rowH = h / (rows + 1);
  for (let i = 0; i < rows; i++) {
    const kind = i % 3;
    ctx.fillStyle = kind === 1 ? NEON.magenta : kind === 2 ? NEON.mint : "#8b7bd8";
    ctx.globalAlpha = kind === 0 ? 0.55 : 0.95;
    ctx.fillRect(w * 0.06, rowH * (i + 0.6), w * 0.04, rowH * 0.5);
    ctx.fillRect(w * 0.14, rowH * (i + 0.6), w * (0.35 + ((i * 17) % 7) * 0.07), rowH * 0.5);
  }
  ctx.globalAlpha = 1;
};

const bankCard: DrawFn = (ctx, w, h) => {
  screenBase(ctx, w, h, NEON.cyan);
  ctx.fillStyle = NEON.amber;
  ctx.fillRect(w * 0.1, h * 0.28, w * 0.16, h * 0.22);
  ctx.fillStyle = NEON.cyan;
  for (let i = 0; i < 4; i++) ctx.fillRect(w * (0.1 + i * 0.2), h * 0.66, w * 0.15, h * 0.08);
};

/* ——— Piezas reutilizables ——— */

function Platform({ color }: { color: string }) {
  return (
    <group>
      <NeonCylinder
        radiusTop={PLATFORM_RADIUS}
        radiusBottom={PLATFORM_RADIUS * 0.8}
        height={0.8}
        segments={6}
        color={color}
        position={[0, -0.4, 0]}
      />
      <mesh rotation={[-HALF_PI, 0, 0]} position={[0, 0.012, 0]} material={glowMaterial(color)}>
        <ringGeometry args={[PLATFORM_RADIUS * 0.9, PLATFORM_RADIUS * 0.93, 6, 1, HALF_PI]} />
      </mesh>
      <GroundGlow color={color} size={PLATFORM_RADIUS * 4.2} position={[0, GROUND_Y + 0.03, 0]} opacity={0.55} />
      <pointLight color={color} intensity={30} distance={13} decay={1.5} position={[0, 4.5, 2]} />
    </group>
  );
}

function Magnifier({ color, position }: { color: string; position: Vec3 }) {
  return (
    <group position={position} rotation={[0, 0, -0.5]}>
      <mesh material={glowMaterial(color)}>
        <torusGeometry args={[0.42, 0.05, 8, 32]} />
      </mesh>
      <Glow color={color} size={1.1} opacity={0.35} />
      <NeonBox size={[0.12, 0.7, 0.12]} position={[0, -0.78, 0]} color={color} />
    </group>
  );
}

/* ——— Islas ——— */

function Fintech() {
  const floors = [0.8, 1.6, 2.4, 3.2, 4, 4.8];
  return (
    <>
      {/* Torre de oficinas */}
      <NeonBox size={[1.5, 5.4, 1.5]} position={[-1.7, 2.7, -1]} color={NEON.cyan} />
      {floors.map((y) => (
        <NeonBox key={y} size={[1.52, 0.02, 1.52]} position={[-1.7, y, -1]} color={NEON.blue} fill={false} />
      ))}
      <NeonBox size={[0.06, 1, 0.06]} position={[-1.7, 5.9, -1]} color={NEON.cyan} fill={false} />
      <Glow color={NEON.magenta} size={0.8} position={[-1.7, 6.45, -1]} />
      {/* Banco con columnas */}
      <NeonBox size={[2.8, 0.2, 1.7]} position={[1.2, 0.1, -0.3]} color={NEON.cyan} />
      {[-1, -0.33, 0.33, 1].map((x) => (
        <NeonCylinder key={x} radiusTop={0.1} height={1.4} segments={10} color={NEON.cyan} position={[1.2 + x, 0.9, 0.3]} />
      ))}
      <NeonBox size={[2.8, 0.18, 1.7]} position={[1.2, 1.69, -0.3]} color={NEON.cyan} />
      <NeonCylinder
        radiusTop={0.95}
        height={1.7}
        segments={3}
        color={NEON.cyan}
        position={[1.2, 2.05, -0.3]}
        rotation={[-HALF_PI, 0, 0]}
        scale={[1.6, 1, 0.5]}
      />
      {/* Moneda y tarjeta */}
      <Spin speed={0.9} position={[1.2, 3.35, -0.1]}>
        <mesh material={glowMaterial(NEON.amber)}>
          <torusGeometry args={[0.5, 0.06, 8, 40]} />
        </mesh>
        <Sign text="€" color={NEON.amber} width={0.75} height={0.75} />
      </Spin>
      <Glow color={NEON.amber} size={2.2} position={[1.2, 3.35, -0.1]} opacity={0.45} />
      <Bob speed={1.1} amplitude={0.15} phase={2}>
        <group position={[-0.1, 2.6, 1.1]} rotation={[0, 0.35, 0.12]}>
          <NeonBox size={[1.2, 0.76, 0.04]} color={NEON.cyan} />
          <Screen width={1.12} height={0.68} position={[0, 0, 0.025]} draw={bankCard} drawKey="card" />
        </group>
      </Bob>
      <Sign text="2022 →" color={NEON.cyan} width={1.6} height={0.45} position={[-1.7, 3, -0.2]} />
    </>
  );
}

function Stack() {
  return (
    <>
      {/* Yunque donde se forja el stack */}
      <NeonBox size={[2.6, 0.75, 1.2]} position={[0, 0.38, -0.3]} color={NEON.blue} />
      <NeonBox size={[1.6, 0.35, 0.8]} position={[0, 0.92, -0.3]} color={NEON.blue} />
      <Sign text="SCSS" color={NEON.pink} width={1.3} height={0.4} position={[0, 0.4, 0.32]} />
      <Bob speed={1} amplitude={0.2} position={[-1.9, 2.5, -0.5]}>
        <NeonCylinder radiusTop={0.8} height={0.14} segments={6} color={NEON.magenta} rotation={[HALF_PI, 0, 0]} />
        <Sign text="A" color={NEON.magenta} width={0.9} height={0.9} position={[0, 0, 0.09]} />
        <Glow color={NEON.magenta} size={2.6} opacity={0.35} />
      </Bob>
      <Bob speed={1} amplitude={0.2} phase={2} position={[0, 3.1, -0.7]}>
        <NeonCylinder radiusTop={0.85} height={0.14} segments={3} color={NEON.mint} rotation={[HALF_PI, 0, 0]} />
        <Sign text="V" color={NEON.mint} width={0.8} height={0.8} position={[0, 0.12, 0.09]} />
        <Glow color={NEON.mint} size={2.6} opacity={0.3} />
      </Bob>
      <Bob speed={1} amplitude={0.2} phase={4} position={[1.9, 2.4, -0.5]}>
        <Spin speed={0.4}>
          <NeonBox size={[1, 1, 1]} color={NEON.blue} />
          <Sign text="TS" color={NEON.cyan} width={0.85} height={0.85} position={[0, 0, 0.52]} />
          <Sign text="TS" color={NEON.cyan} width={0.85} height={0.85} position={[0, 0, -0.52]} rotation={[0, Math.PI, 0]} />
        </Spin>
        <Glow color={NEON.blue} size={2.8} opacity={0.35} />
      </Bob>
      <Sparkles area={[6, 4.5, 3]} colors={[NEON.amber, NEON.pink]} position={[0, 1, -0.3]} count={36} speed={0.6} size={0.07} />
    </>
  );
}

/** Árbol de casuísticas: tronco, ramas y hojas con su resultado */
const QUALITY_BRANCHES: { from: Vec3; to: Vec3; result?: "ok" | "fail" }[] = [
  { from: [0, 0.03, 2], to: [0, 0.03, 0.6] },
  { from: [0, 0.03, 0.6], to: [-1.8, 0.03, -0.4] },
  { from: [0, 0.03, 0.6], to: [0, 0.03, -0.9] },
  { from: [0, 0.03, 0.6], to: [1.8, 0.03, -0.4] },
  { from: [-1.8, 0.03, -0.4], to: [-2.6, 0.03, -1.8], result: "ok" },
  { from: [-1.8, 0.03, -0.4], to: [-1.1, 0.03, -2], result: "fail" },
  { from: [0, 0.03, -0.9], to: [0, 0.03, -2.4], result: "ok" },
  { from: [1.8, 0.03, -0.4], to: [1.1, 0.03, -2], result: "ok" },
  { from: [1.8, 0.03, -0.4], to: [2.6, 0.03, -1.8], result: "ok" },
];

function Quality() {
  return (
    <>
      {QUALITY_BRANCHES.map(({ from, to, result }) => (
        <group key={`${from}-${to}`}>
          <NeonTube points={[from, to]} color={NEON.mint} radius={0.04} />
          <mesh position={to} material={glowMaterial(NEON.mint)}>
            <sphereGeometry args={[0.1, 12, 12]} />
          </mesh>
          {result && (
            <Sign
              text={result === "ok" ? "✓" : "✕"}
              color={result === "ok" ? NEON.mint : NEON.magenta}
              width={0.7}
              height={0.7}
              position={[to[0], 0.75, to[2]]}
            />
          )}
        </group>
      ))}
      {/* El merge solo se cruza cuando todo está verde */}
      <NeonBox size={[0.2, 2.6, 0.2]} position={[-1.5, 1.3, 1.6]} color={NEON.mint} />
      <NeonBox size={[0.2, 2.6, 0.2]} position={[1.5, 1.3, 1.6]} color={NEON.mint} />
      <NeonBox size={[3.4, 0.5, 0.2]} position={[0, 2.75, 1.6]} color={NEON.mint} />
      <Sign text="MERGE" color={NEON.mint} width={2.2} height={0.45} position={[0, 2.75, 1.72]} />
      <Spin speed={0.6} position={[0, 0, -0.6]}>
        <Magnifier color={NEON.amber} position={[1.9, 2.6, 0]} />
      </Spin>
    </>
  );
}

function Projects() {
  return (
    <>
      {/* Psoas: la clínica */}
      <NeonBox size={[2.2, 1.7, 1.7]} position={[-1.6, 0.85, -0.6]} color={NEON.mint} />
      <Sign text="PSOAS" color={NEON.mint} width={1.8} height={0.45} position={[-1.6, 1.15, 0.27]} />
      <Spin speed={0.7} position={[-1.6, 2.4, -0.6]}>
        <mesh material={glowMaterial(NEON.mint)}>
          <boxGeometry args={[0.8, 0.24, 0.24]} />
        </mesh>
        <mesh material={glowMaterial(NEON.mint)}>
          <boxGeometry args={[0.24, 0.8, 0.24]} />
        </mesh>
      </Spin>
      <Glow color={NEON.mint} size={2.4} position={[-1.6, 2.4, -0.6]} opacity={0.4} />
      {/* Trivial: torre de preguntas */}
      {[1.3, 1, 0.7].map((size, i) => (
        <NeonBox
          key={size}
          size={[size, size, size]}
          position={[1.7, [0.65, 1.8, 2.65][i], -0.4]}
          rotation={[0, i * 0.4, 0]}
          color={NEON.pink}
        />
      ))}
      <Bob speed={1.5} amplitude={0.2} position={[1.7, 3.75, -0.4]}>
        <Spin speed={0.8}>
          <Sign text="?" color={NEON.amber} width={0.9} height={0.9} />
          <Sign text="?" color={NEON.amber} width={0.9} height={0.9} rotation={[0, HALF_PI, 0]} />
        </Spin>
        <Glow color={NEON.amber} size={1.8} opacity={0.4} />
      </Bob>
      <NeonTube points={[[-0.5, 0.03, 0.2], [0.3, 0.03, 0.9], [1.2, 0.03, 0.4]]} color={NEON.pink} radius={0.035} />
      <Sparkles area={[7, 4, 4]} colors={[NEON.pink, NEON.mint]} count={30} />
    </>
  );
}

function Ai() {
  return (
    <>
      {/* El modelo propone… */}
      <group position={[0, 3.1, -1]}>
        <Spin speed={0.4}>
          <mesh>
            <icosahedronGeometry args={[0.95, 1]} />
            <meshBasicMaterial color={NEON.violet} wireframe toneMapped={false} />
          </mesh>
        </Spin>
        <mesh material={glowMaterial(NEON.pink)}>
          <sphereGeometry args={[0.32, 16, 16]} />
        </mesh>
        <Glow color={NEON.violet} size={4} opacity={0.6} />
        <Spin speed={0.9} axis="z">
          <mesh rotation={[1.1, 0, 0]} material={glowMaterial(NEON.cyan)}>
            <torusGeometry args={[1.45, 0.025, 8, 64]} />
          </mesh>
        </Spin>
        <Spin speed={-0.7} axis="x">
          <mesh rotation={[0, 0.9, 0]} material={glowMaterial(NEON.pink)}>
            <torusGeometry args={[1.7, 0.02, 8, 64]} />
          </mesh>
        </Spin>
      </group>
      <NeonTube points={[[0, 2.1, -1], [0.4, 1.4, -0.3], [0.6, 1.55, 0.35]]} color={NEON.violet} radius={0.03} />
      {/* …y la revisión decide */}
      <NeonBox size={[2.4, 0.12, 1.1]} position={[0.4, 0.95, 0.9]} color={NEON.violet} />
      <NeonBox size={[0.12, 0.9, 0.12]} position={[0.4, 0.45, 0.9]} color={NEON.violet} fill={false} />
      <group position={[0.6, 1.55, 0.6]} rotation={[-0.2, -0.2, 0]}>
        <NeonBox size={[1.5, 0.95, 0.06]} color={NEON.violet} />
        <Screen width={1.4} height={0.85} position={[0, 0, 0.035]} draw={reviewDiff} drawKey="diff" />
      </group>
      <Sign text="REVIEW ✓" color={NEON.mint} width={1.9} height={0.45} position={[-1.8, 1.9, 0.6]} rotation={[0, 0.35, 0]} />
    </>
  );
}

function Cv() {
  const rings = [0.6, 1.4, 2.2, 3];
  return (
    <>
      {/* Faro: "aquí estoy" */}
      <NeonCylinder radiusTop={0.55} radiusBottom={0.9} height={3.6} segments={8} color={NEON.cyan} position={[-0.8, 1.8, -0.8]} />
      {rings.map((y) => (
        <NeonCylinder
          key={y}
          radiusTop={0.9 - (y / 3.6) * 0.35}
          height={0.02}
          segments={24}
          color={NEON.pink}
          fill={false}
          position={[-0.8, y, -0.8]}
        />
      ))}
      <NeonCylinder radiusTop={0.6} height={0.7} segments={8} color={NEON.cyan} fill={false} position={[-0.8, 3.95, -0.8]} />
      <NeonCylinder radiusTop={0} radiusBottom={0.75} height={0.5} segments={8} color={NEON.cyan} position={[-0.8, 4.55, -0.8]} />
      <Glow color={NEON.amber} size={2.6} position={[-0.8, 3.95, -0.8]} opacity={0.95} />
      <Spin speed={0.8} position={[-0.8, 3.95, -0.8]}>
        <mesh position={[3, 0, 0]} rotation={[0, 0, HALF_PI]}>
          <coneGeometry args={[0.9, 6, 24, 1, true]} />
          <meshBasicMaterial
            color={NEON.amber}
            transparent
            opacity={0.16}
            depthWrite={false}
            toneMapped={false}
            side={DoubleSide}
            blending={AdditiveBlending}
          />
        </mesh>
      </Spin>
      {/* Sobre con el CV */}
      <Bob speed={1.2} amplitude={0.2} position={[1.9, 2.3, 0.4]}>
        <group rotation={[0, -0.35, 0.1]}>
          <NeonBox size={[1.3, 0.85, 0.06]} color={NEON.pink} />
          <NeonBox size={[0.78, 0.04, 0.04]} position={[-0.31, 0.2, 0.04]} rotation={[0, 0, -0.55]} color={NEON.pink} fill={false} />
          <NeonBox size={[0.78, 0.04, 0.04]} position={[0.31, 0.2, 0.04]} rotation={[0, 0, 0.55]} color={NEON.pink} fill={false} />
        </group>
        <Glow color={NEON.pink} size={2} opacity={0.35} />
      </Bob>
      <Sign text="HABLEMOS" color={NEON.pink} width={2.6} height={0.6} position={[1.4, 3.7, -0.8]} />
      <Sparkles area={[7, 5, 5]} colors={[NEON.cyan, NEON.amber, NEON.pink]} count={40} />
    </>
  );
}

const ISLAND_SCENES: Record<IslandKind, () => ReactNode> = {
  fintech: Fintech,
  stack: Stack,
  quality: Quality,
  projects: Projects,
  ai: Ai,
  cv: Cv,
};

export function WorldIslands() {
  return (
    <>
      {(Object.keys(islands) as IslandKind[]).map((kind) => {
        const { position, yaw, accent } = islands[kind];
        const Scene = ISLAND_SCENES[kind];
        return (
          <group key={kind} position={position} rotation={[0, yaw, 0]}>
            <Platform color={accent} />
            <Scene />
          </group>
        );
      })}
    </>
  );
}
