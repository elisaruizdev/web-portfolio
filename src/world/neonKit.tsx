/** Primitivas del mundo de neón: cuerpos oscuros con aristas luminosas, halos y carteles. */

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type ReactNode } from "react";
import {
  AdditiveBlending,
  BoxGeometry,
  CanvasTexture,
  CatmullRomCurve3,
  Color,
  CylinderGeometry,
  DoubleSide,
  EdgesGeometry,
  LineBasicMaterial,
  MeshBasicMaterial,
  MeshLambertMaterial,
  SRGBColorSpace,
  TubeGeometry,
  Vector3,
  type BufferGeometry,
  type Group,
  type Points,
  type Texture,
} from "three";

import type { Vec3 } from "./worldData";

/** Lo desactiva la escena con prefers-reduced-motion: todo queda quieto */
export const motion = { enabled: true };

export const bodyMaterial = new MeshLambertMaterial({ color: "#160c38" });

const lineMaterials = new Map<string, LineBasicMaterial>();
export function lineMaterial(color: string) {
  let material = lineMaterials.get(color);
  if (!material) {
    material = new LineBasicMaterial({ color, toneMapped: false });
    lineMaterials.set(color, material);
  }
  return material;
}

const glowMaterials = new Map<string, MeshBasicMaterial>();
/** Superficie que emite luz propia (no le afectan las luces ni el tone mapping) */
export function glowMaterial(color: string) {
  let material = glowMaterials.get(color);
  if (!material) {
    material = new MeshBasicMaterial({ color, toneMapped: false });
    glowMaterials.set(color, material);
  }
  return material;
}

let glowTexture: Texture | null = null;
function getGlowTexture() {
  if (glowTexture) return glowTexture;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.25, "rgba(255,255,255,0.45)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);
  glowTexture = new CanvasTexture(canvas);
  return glowTexture;
}

type Transform = {
  position?: Vec3;
  rotation?: Vec3;
  scale?: number | Vec3;
};

function useEdged(factory: () => BufferGeometry, deps: unknown[], edgeAngle = 1) {
  const pair = useMemo(() => {
    const geometry = factory();
    return { geometry, edges: new EdgesGeometry(geometry, edgeAngle) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  useEffect(
    () => () => {
      pair.geometry.dispose();
      pair.edges.dispose();
    },
    [pair],
  );
  return pair;
}

type NeonBoxProps = Transform & {
  size: Vec3;
  color: string;
  /** false = solo las aristas, sin cuerpo */
  fill?: boolean;
};

export function NeonBox({ size, color, fill = true, ...transform }: NeonBoxProps) {
  const [w, h, d] = size;
  const { geometry, edges } = useEdged(() => new BoxGeometry(w, h, d), [w, h, d]);
  return (
    <group {...transform}>
      {fill && <mesh geometry={geometry} material={bodyMaterial} />}
      <lineSegments geometry={edges} material={lineMaterial(color)} />
    </group>
  );
}

type NeonCylinderProps = Transform & {
  radiusTop: number;
  radiusBottom?: number;
  height: number;
  segments?: number;
  color: string;
  fill?: boolean;
};

export function NeonCylinder({
  radiusTop,
  radiusBottom = radiusTop,
  height,
  segments = 24,
  color,
  fill = true,
  ...transform
}: NeonCylinderProps) {
  // Con muchos segmentos solo se dibujan los bordes de las tapas, no cada cara lateral
  const edgeAngle = segments > 8 ? 30 : 1;
  const { geometry, edges } = useEdged(
    () => new CylinderGeometry(radiusTop, radiusBottom, height, segments),
    [radiusTop, radiusBottom, height, segments],
    edgeAngle,
  );
  return (
    <group {...transform}>
      {fill && <mesh geometry={geometry} material={bodyMaterial} />}
      <lineSegments geometry={edges} material={lineMaterial(color)} />
    </group>
  );
}

type GlowProps = {
  color: string;
  size: number;
  position?: Vec3;
  opacity?: number;
};

/** Halo aditivo: el "resplandor" del neón sin postprocesado */
export function Glow({ color, size, position, opacity = 0.8 }: GlowProps) {
  return (
    <sprite position={position} scale={[size, size, 1]}>
      <spriteMaterial
        map={getGlowTexture()}
        color={color}
        blending={AdditiveBlending}
        depthWrite={false}
        transparent
        opacity={opacity}
        toneMapped={false}
      />
    </sprite>
  );
}

type GroundGlowProps = {
  color: string;
  size: number;
  position?: Vec3;
  opacity?: number;
};

/** Charco de luz tumbado sobre una superficie (un sprite se recortaría contra ella) */
export function GroundGlow({ color, size, position, opacity = 0.6 }: GroundGlowProps) {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial
        map={getGlowTexture()}
        color={color}
        blending={AdditiveBlending}
        depthWrite={false}
        transparent
        opacity={opacity}
        toneMapped={false}
      />
    </mesh>
  );
}

export type DrawFn = (ctx: CanvasRenderingContext2D, width: number, height: number) => void;

function useCanvasTexture(draw: DrawFn, width: number, height: number, key: string) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    draw(canvas.getContext("2d")!, width, height);
    const result = new CanvasTexture(canvas);
    result.colorSpace = SRGBColorSpace;
    result.anisotropy = 4;
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, width, height]);
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

type ScreenProps = Transform & {
  width: number;
  height: number;
  draw: DrawFn;
  /** Identifica el dibujo para no regenerar la textura en cada render */
  drawKey: string;
  additive?: boolean;
};

/** Plano con un dibujo de canvas: pantallas, paneles, carteles */
export function Screen({ width, height, draw, drawKey, additive = false, ...transform }: ScreenProps) {
  const pixelsWide = 512;
  const pixelsHigh = Math.max(64, Math.round((pixelsWide * height) / width));
  const texture = useCanvasTexture(draw, pixelsWide, pixelsHigh, drawKey);
  return (
    <mesh {...transform}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial
        map={texture}
        transparent
        toneMapped={false}
        depthWrite={!additive}
        side={DoubleSide}
        blending={additive ? AdditiveBlending : undefined}
      />
    </mesh>
  );
}

function neonText(text: string, color: string, fontScale: number): DrawFn {
  return (ctx, w, h) => {
    const size = Math.min(h * 0.7, (w / Math.max(text.length, 1)) * 1.2) * fontScale;
    ctx.font = `800 ${size}px Montserrat, system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = size * 0.45;
    ctx.fillText(text, w / 2, h / 2);
    ctx.shadowBlur = size * 0.15;
    ctx.fillText(text, w / 2, h / 2);
    // Núcleo casi blanco, como el tubo encendido
    ctx.shadowBlur = 0;
    ctx.fillStyle = new Color(color).lerp(new Color("#ffffff"), 0.65).getStyle();
    ctx.fillText(text, w / 2, h / 2);
  };
}

type SignProps = Transform & {
  text: string;
  color: string;
  width: number;
  height: number;
  fontScale?: number;
};

/** Rótulo de neón (texto con resplandor) */
export function Sign({ text, color, width, height, fontScale = 1, ...transform }: SignProps) {
  return (
    <Screen
      width={width}
      height={height}
      draw={neonText(text, color, fontScale)}
      drawKey={`${text}|${color}|${fontScale}`}
      additive
      {...transform}
    />
  );
}

type AnimatedProps = Transform & {
  children: ReactNode;
  speed?: number;
};

export function Spin({ children, speed = 0.5, axis = "y", ...transform }: AnimatedProps & { axis?: "x" | "y" | "z" }) {
  const ref = useRef<Group>(null);
  useFrame((_, delta) => {
    if (ref.current && motion.enabled) ref.current.rotation[axis] += delta * speed;
  });
  return (
    <group {...transform}>
      <group ref={ref}>{children}</group>
    </group>
  );
}

export function Bob({ children, speed = 1, amplitude = 0.15, phase = 0, ...transform }: AnimatedProps & { amplitude?: number; phase?: number }) {
  const ref = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (ref.current && motion.enabled) {
      ref.current.position.y = Math.sin(clock.elapsedTime * speed + phase) * amplitude;
    }
  });
  return (
    <group {...transform}>
      <group ref={ref}>{children}</group>
    </group>
  );
}

type TubeProps = {
  points: Vec3[];
  color: string;
  radius?: number;
};

export function NeonTube({ points, color, radius = 0.05 }: TubeProps) {
  const geometry = useMemo(() => {
    const curve = new CatmullRomCurve3(points.map((p) => new Vector3(...p)));
    return new TubeGeometry(curve, Math.max(16, points.length * 12), radius, 6, false);
  }, [points, radius]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <mesh geometry={geometry} material={glowMaterial(color)} />;
}

type SparklesProps = {
  count?: number;
  /** Caja [ancho, alto, fondo] centrada en la posición */
  area: Vec3;
  colors: string[];
  position?: Vec3;
  speed?: number;
  size?: number;
};

/** Partículas que suben lentamente y reaparecen abajo */
export function Sparkles({ count = 40, area, colors, position, speed = 0.25, size = 0.09 }: SparklesProps) {
  const ref = useRef<Points>(null);
  const { positions, colorArray } = useMemo(() => {
    const p = new Float32Array(count * 3);
    const c = new Float32Array(count * 3);
    const tint = new Color();
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * area[0];
      p[i * 3 + 1] = Math.random() * area[1];
      p[i * 3 + 2] = (Math.random() - 0.5) * area[2];
      tint.set(colors[i % colors.length]);
      c.set([tint.r, tint.g, tint.b], i * 3);
    }
    return { positions: p, colorArray: c };
  }, [count, area, colors]);

  useFrame((_, delta) => {
    const points = ref.current;
    if (!points || !motion.enabled) return;
    const attribute = points.geometry.getAttribute("position");
    const array = attribute.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const y = array[i * 3 + 1] + delta * speed * (0.6 + (i % 5) * 0.12);
      array[i * 3 + 1] = y > area[1] ? 0 : y;
    }
    attribute.needsUpdate = true;
  });

  return (
    <points ref={ref} position={position}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colorArray, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        vertexColors
        transparent
        opacity={0.9}
        blending={AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
}
