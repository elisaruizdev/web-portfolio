/** Escena 3D del mundo de neón. Se carga en diferido y solo en el cliente (ver SceneBackdrop.tsx). */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  BackSide,
  CanvasTexture,
  CatmullRomCurve3,
  SRGBColorSpace,
  Vector3,
  type GridHelper,
  type Group,
  type Mesh,
  type PerspectiveCamera,
} from "three";

import { buildCameraPath, sampleCameraPath } from "./cameraPath";
import { GROUND_Y, WorldIslands } from "./islands";
import { Glow, NeonTube, motion } from "./neonKit";
import { NEON, islands, portfolioStops, type Vec3 } from "./worldData";
import { worldStore } from "./worldStore";

/** Color de la niebla = franja del horizonte: las islas lejanas se funden con el cielo */
const FOG = "#240a40";

/* ——— Entorno ——— */

const SUN_SIZE = 78;
/** Altura del centro del sol sobre los ojos de la cámara: el horizonte cae a SUN_LIFT por debajo */
const SUN_LIFT = 9;
/** Fracción de la textura (desde arriba) donde el sol toca el horizonte */
const SUN_HORIZON = (SUN_SIZE / 2 + SUN_LIFT) / SUN_SIZE;

function makeSunTexture() {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createLinearGradient(0, 0, 0, size);
  gradient.addColorStop(0, "#ffd36e");
  gradient.addColorStop(0.45, "#ff2a8a");
  gradient.addColorStop(1, "#6b0eae");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.fill();
  // Franjas horizontales del sol synthwave, cada vez más anchas hacia abajo…
  ctx.globalCompositeOperation = "destination-out";
  for (let i = 0; i < 6; i++) {
    const y = size * (0.36 + i * 0.045);
    ctx.fillRect(0, y, size, 2 + i * 2.6);
  }
  // …y se hunde en el horizonte (ver SUN_HORIZON)
  ctx.fillRect(0, size * SUN_HORIZON, size, size);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

function makeSkyTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 4;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createLinearGradient(0, 0, 0, 512);
  gradient.addColorStop(0, "#03010d");
  gradient.addColorStop(0.32, "#0b0424");
  gradient.addColorStop(0.47, "#3a0f58");
  gradient.addColorStop(0.5, FOG);
  gradient.addColorStop(1, "#05020f");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 4, 512);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

/** Cielo, sol y retícula viajan con la cámara: el horizonte nunca se acaba */
function Horizon() {
  const sunRef = useRef<Mesh>(null);
  const skyRef = useRef<Group>(null);
  const gridRef = useRef<GridHelper>(null);
  const sunTexture = useMemo(makeSunTexture, []);
  const skyTexture = useMemo(makeSkyTexture, []);

  const stars = useMemo(() => {
    const count = 1100;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.45;
      const radius = 200 + Math.random() * 60;
      positions[i * 3] = Math.cos(theta) * Math.sin(phi) * radius;
      positions[i * 3 + 1] = Math.cos(phi) * radius * 0.7 + 12;
      positions[i * 3 + 2] = Math.sin(theta) * Math.sin(phi) * radius;
    }
    return positions;
  }, []);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const materials = Array.isArray(grid.material) ? grid.material : [grid.material];
    for (const material of materials) {
      material.transparent = true;
      material.opacity = 0.55;
      material.toneMapped = false;
    }
  }, []);

  useFrame(({ camera }) => {
    sunRef.current?.position.set(camera.position.x, camera.position.y + SUN_LIFT, camera.position.z - 210);
    skyRef.current?.position.copy(camera.position);
    // La retícula salta de celda en celda para que no se note que se mueve
    if (gridRef.current) {
      const cell = 2.5;
      gridRef.current.position.x = Math.round(camera.position.x / cell) * cell;
      gridRef.current.position.z = Math.round(camera.position.z / cell) * cell;
    }
  });

  return (
    <>
      <group ref={skyRef}>
        <mesh renderOrder={-1}>
          <sphereGeometry args={[340, 32, 16]} />
          <meshBasicMaterial map={skyTexture} side={BackSide} fog={false} depthWrite={false} toneMapped={false} />
        </mesh>
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[stars, 3]} />
          </bufferGeometry>
          <pointsMaterial color="#f3e8ff" size={1.5} sizeAttenuation fog={false} transparent opacity={0.8} />
        </points>
      </group>
      <mesh ref={sunRef}>
        <planeGeometry args={[SUN_SIZE, SUN_SIZE]} />
        <meshBasicMaterial map={sunTexture} transparent fog={false} toneMapped={false} depthWrite={false} />
      </mesh>
      <gridHelper ref={gridRef} args={[500, 200, NEON.magenta, "#5b2bbd"]} position={[0, GROUND_Y, 0]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, GROUND_Y - 0.02, 0]}>
        <planeGeometry args={[2000, 2000]} />
        <meshBasicMaterial color="#0a0420" />
      </mesh>
    </>
  );
}

/* ——— Carretera entre islas ——— */

const ROAD_Y = -0.25;

/** Pasa por todas las islas y se pierde en el horizonte por ambos extremos */
const ROAD: Vec3[] = (() => {
  const points = portfolioStops.map((stop): Vec3 => {
    const [x, , z] = islands[stop.island].position;
    return [x, ROAD_Y, z];
  });
  const [first] = points;
  const last = points[points.length - 1];
  return [[first[0] - 60, ROAD_Y, first[2] - 6], ...points, [last[0] + 60, ROAD_Y, last[2] - 6]];
})();

/** Pulsos de luz que recorren la carretera: el mundo "funciona" */
function RoadPulses({ points, color }: { points: Vec3[]; color: string }) {
  const curve = useMemo(() => new CatmullRomCurve3(points.map((p) => new Vector3(...p))), [points]);
  const refs = useRef<(Group | null)[]>([]);
  const count = 9;

  useFrame(({ clock }) => {
    const time = motion.enabled ? clock.elapsedTime : 0;
    refs.current.forEach((pulse, i) => {
      if (!pulse) return;
      const t = (time * 0.012 + i / count) % 1;
      curve.getPointAt(t, pulse.position);
    });
  });

  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <group
          key={i}
          ref={(node) => {
            refs.current[i] = node;
          }}
        >
          <Glow color={color} size={1.4} opacity={0.9} />
        </group>
      ))}
    </>
  );
}

function Road() {
  return (
    <>
      <NeonTube points={ROAD} color={NEON.cyan} radius={0.09} />
      <RoadPulses points={ROAD} color={NEON.magenta} />
    </>
  );
}

/* ——— Cámara ——— */

function damp(current: number, target: number, lambda: number, dt: number) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

function CameraRig() {
  const camera = useThree((state) => state.camera) as PerspectiveCamera;
  const size = useThree((state) => state.size);
  const path = useMemo(() => buildCameraPath(portfolioStops), []);

  const rig = useMemo(
    () => ({
      started: false,
      position: new Vector3(),
      look: new Vector3(),
      targetPosition: new Vector3(),
      targetLook: new Vector3(),
      side: 0,
      offsetX: Number.NaN,
      offsetY: Number.NaN,
    }),
    [],
  );

  useEffect(
    () => () => {
      camera.clearViewOffset();
    },
    [camera],
  );

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1);
    const animate = motion.enabled;

    // Sin movimiento: corte directo al interior de la parada actual
    const progress = animate ? worldStore.progress : Math.floor(worldStore.progress) + 0.5;
    sampleCameraPath(path, progress, rig.targetPosition, rig.targetLook);

    // El scroll da saltos (rueda, teclado): la cámara los suaviza
    const k = animate && rig.started ? 1 - Math.exp(-dt * 4.5) : 1;
    rig.started = true;
    rig.position.lerp(rig.targetPosition, k);
    rig.look.lerp(rig.targetLook, k);
    camera.position.copy(rig.position);
    camera.lookAt(rig.look);

    // Encuadre: la isla se desplaza al lado contrario de la tarjeta de texto
    const mobile = size.width < 860;
    const side = mobile ? 0 : worldStore.side;
    rig.side = animate ? damp(rig.side, side, 2.2, dt) : side;
    const offsetX = Math.round(rig.side * size.width * 0.17);
    const offsetY = mobile ? Math.round(size.height * 0.17) : 0;
    if (offsetX !== rig.offsetX || offsetY !== rig.offsetY) {
      rig.offsetX = offsetX;
      rig.offsetY = offsetY;
      camera.setViewOffset(size.width, size.height, offsetX, offsetY, size.width, size.height);
    }
  });

  // Al redimensionar hay que volver a aplicar el encuadre con el tamaño nuevo
  useEffect(() => {
    rig.offsetX = Number.NaN;
  }, [rig, size.width, size.height]);

  return null;
}

type SceneCanvasProps = {
  reducedMotion: boolean;
  onReady: () => void;
};

export default function SceneCanvas({ reducedMotion, onReady }: SceneCanvasProps) {
  motion.enabled = !reducedMotion;
  const lowPower = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

  return (
    <Canvas
      className="world-scene__canvas"
      dpr={[1, lowPower ? 1.5 : 1.75]}
      gl={{ antialias: true, powerPreference: "high-performance", alpha: false }}
      camera={{ fov: 46, near: 0.1, far: 420, position: [0, 8.5, 17] }}
      onCreated={({ gl }) => {
        gl.setClearColor(FOG);
        requestAnimationFrame(onReady);
      }}
    >
      <fog attach="fog" args={[FOG, 30, 130]} />
      <ambientLight color="#6f55ff" intensity={0.9} />
      <hemisphereLight args={["#4de7ff", "#2a0a3a", 0.6]} />
      <directionalLight color="#ffb3e6" intensity={0.9} position={[10, 20, 14]} />
      <Horizon />
      <Road />
      <WorldIslands />
      <CameraRig />
    </Canvas>
  );
}
