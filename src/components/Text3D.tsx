import type { CSSProperties } from "react";

type Text3DProps = {
  text: string;
  className?: string;
  /** Número de cortes que forman el volumen: más cortes, extrusión más lisa. */
  depth?: number;
};

/* Texto extruido en 3D real, como una capa de texto con geometría en After
   Effects: copias del texto apiladas en Z dentro de un contexto preserve-3d,
   así el volumen responde a la rotación y a la perspectiva de la "cámara". */
export function Text3D({ text, className, depth = 24 }: Text3DProps) {
  // De atrás hacia delante: el corte 1 es el canto pegado a la cara frontal.
  const slices = Array.from({ length: depth }, (_, index) => depth - index);

  return (
    <span className={className ? `text-3d ${className}` : "text-3d"}>
      <span className="text-3d__rig">
        {slices.map((slice) => (
          <span
            key={slice}
            className="text-3d__slice"
            aria-hidden="true"
            style={
              {
                "--t3d-slice": slice,
                "--t3d-shade": `${Math.round(((slice - 1) / (depth - 1)) * 100)}%`,
              } as CSSProperties
            }
          >
            {text}
          </span>
        ))}
        <span className="text-3d__face">{text}</span>
      </span>
    </span>
  );
}
