import { useEffect, useRef } from "react";

/**
 * Spotlight que sigue al cursor (estilo brittanychiang.com):
 * capa fixed + radial-gradient anclado a --spotlight-x/y, actualizado en rAF.
 */
export function CursorSpotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = ref.current;
    if (!layer) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    if (reducedMotion || coarsePointer) {
      layer.hidden = true;
      return;
    }

    let rafId = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;

    const paint = () => {
      layer.style.setProperty("--spotlight-x", `${x}px`);
      layer.style.setProperty("--spotlight-y", `${y}px`);
      rafId = 0;
    };

    const onMove = (event: MouseEvent) => {
      x = event.clientX;
      y = event.clientY;
      if (!rafId) rafId = requestAnimationFrame(paint);
    };

    paint();
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="cursor-spotlight"
      aria-hidden
    />
  );
}
