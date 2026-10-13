import type { ReactNode } from "react";

type BrowserFrameProps = {
  /** Texto de la barra de direcciones (dominio, como lo muestra Safari). */
  url: string;
  children: ReactNode;
};

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/* Ventana de Safari (macOS) alrededor de un pantallazo: semáforos, barra de
   herramientas y campo de dirección. Toda la barra es decorativa. */
export function BrowserFrame({ url, children }: BrowserFrameProps) {
  return (
    <div className="browser-frame">
      <div className="browser-frame__toolbar" aria-hidden="true">
        <span className="browser-frame__lights">
          <span />
          <span />
          <span />
        </span>
        <span className="browser-frame__controls">
          <svg {...iconProps} className="browser-frame__icon">
            <rect x="3.5" y="5" width="17" height="14" rx="2.5" />
            <path d="M9.5 5v14" />
          </svg>
          <svg {...iconProps} className="browser-frame__icon">
            <path d="M14.5 6l-6 6 6 6" />
          </svg>
          <svg {...iconProps} className="browser-frame__icon browser-frame__icon--off">
            <path d="M9.5 6l6 6-6 6" />
          </svg>
        </span>
        <span className="browser-frame__address">
          <svg {...iconProps} className="browser-frame__lock">
            <rect x="5.5" y="10.5" width="13" height="9.5" rx="2" />
            <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
          </svg>
          <span className="browser-frame__url">{url}</span>
        </span>
        <span className="browser-frame__controls browser-frame__controls--end">
          <svg {...iconProps} className="browser-frame__icon">
            <path d="M12 3.5v11M8 7.5l4-4 4 4" />
            <path d="M8 11H6.5v9.5h11V11H16" />
          </svg>
          <svg {...iconProps} className="browser-frame__icon">
            <path d="M12 5v14M5 12h14" />
          </svg>
          <svg {...iconProps} className="browser-frame__icon">
            <rect x="3.5" y="7.5" width="12.5" height="12.5" rx="2.5" />
            <path d="M8 4h9.5A2.5 2.5 0 0 1 20 6.5V16" />
          </svg>
        </span>
      </div>
      <div className="browser-frame__viewport">{children}</div>
    </div>
  );
}
