import { useLayoutEffect, useMemo, useRef } from "react";
import { computeTubeImage, drawTubeImage, layoutTubeText, TUBE_PAD_EM, type TubeTone } from "./puffyText/tubeText";

type PuffyTextProps = {
  text: string;
  className?: string;
  /** Color del tubo: el rosa de la referencia o blanco con la misma luz. */
  tone?: TubeTone;
};

/** Radio del tubo y ensanche horizontal de la letra (abre los bucles), en em. */
const TUBE = { radius: 0.055, stretch: 1.15 };

/* Texto inflado como un tubo de goma (ver puffyText/tubeText.ts). El canvas es
   decorativo: el texto real queda oculto visualmente para lectores de pantalla
   y buscadores. La caja va de lo alto de las letras a su base, en em, así que
   escala con el font-size y se centra como texto normal; los rabos (p) cuelgan
   por debajo, igual que en tipografía. */
export function PuffyText({ text, className, tone = "pink" }: PuffyTextProps) {
  const layout = useMemo(() => layoutTubeText(text, TUBE), [text]);
  const boxRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Se pinta antes del primer frame (unas decenas de ms) para que el texto salga
  // a la vez que la página; si cambia el tamaño, se repinta al acabar (mientras
  // tanto el canvas escala en em).
  useLayoutEffect(() => {
    const box = boxRef.current;
    const canvas = canvasRef.current;
    if (!box || !canvas) return;

    let painted = "";
    let timer = 0;
    const paint = () => {
      const fontPx = parseFloat(getComputedStyle(box).fontSize);
      const dpr = window.devicePixelRatio || 1;
      const key = `${fontPx}@${dpr}`;
      if (key === painted) return;
      painted = key;
      drawTubeImage(canvas, computeTubeImage({ layout, fontPx, dpr, tone }));
      canvas.dataset.ready = "";
    };
    const schedule = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(paint, 150);
    };

    paint();
    const observer = new ResizeObserver(schedule);
    observer.observe(box);
    // El zoom del navegador cambia la densidad de píxeles sin cambiar el tamaño CSS.
    window.addEventListener("resize", schedule);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", schedule);
      window.clearTimeout(timer);
    };
  }, [layout, tone]);

  return (
    <span
      ref={boxRef}
      className={className ? `puffy-text ${className}` : "puffy-text"}
      style={{ width: `${layout.width}em`, height: `${layout.bodyHeight}em` }}
    >
      <span className="puffy-text__label">{text}</span>
      <canvas
        ref={canvasRef}
        className="puffy-text__canvas"
        aria-hidden="true"
        style={{
          left: `${-TUBE_PAD_EM}em`,
          top: `${-TUBE_PAD_EM}em`,
          width: `${layout.width + TUBE_PAD_EM * 2}em`,
          height: `${layout.height + TUBE_PAD_EM * 2}em`,
        }}
      />
    </span>
  );
}
