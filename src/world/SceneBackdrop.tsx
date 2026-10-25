import { Suspense, lazy, useEffect, useState } from "react";

const SceneCanvas = lazy(() => import("./SceneCanvas"));

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Fondo fijo de la home. En el prerender (y sin WebGL) se queda en el horizonte de CSS; en el
 * cliente carga la escena 3D cuando la fuente de los rótulos está lista.
 */
export function SceneBackdrop() {
  const [mountScene, setMountScene] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);
    const onChange = () => setReducedMotion(query.matches);
    query.addEventListener("change", onChange);

    let cancelled = false;
    if (supportsWebGL()) {
      // Los rótulos se pintan en canvas: su fuente tiene que estar cargada antes
      const fonts = document.fonts
        ? document.fonts
            .load("800 32px Montserrat")
            .catch(() => [])
            .then(() => document.fonts.ready)
        : Promise.resolve();
      void fonts.then(() => {
        if (!cancelled) setMountScene(true);
      });
    }
    return () => {
      cancelled = true;
      query.removeEventListener("change", onChange);
    };
  }, []);

  return (
    <div className={`world-scene${visible ? " world-scene--ready" : ""}`} aria-hidden>
      <div className="world-scene__fallback" />
      {mountScene && (
        <Suspense fallback={null}>
          <SceneCanvas reducedMotion={reducedMotion} onReady={() => setVisible(true)} />
        </Suspense>
      )}
      <div className="world-scene__shade" />
    </div>
  );
}
