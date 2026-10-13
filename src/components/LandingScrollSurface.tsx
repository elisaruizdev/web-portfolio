import { useEffect, useRef, type ReactNode } from "react";

import {
  landingBackgroundAt,
  landingDocumentScrollProgress,
  landingInkAt,
} from "../utils/landingPalette";

type LandingScrollSurfaceProps = {
  children: ReactNode;
};

export function LandingScrollSurface({ children }: LandingScrollSurfaceProps) {
  const surfaceRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const progress = landingDocumentScrollProgress();
      const background = bgRef.current;
      if (background) {
        background.style.background = landingBackgroundAt(progress);
      }
      // Tinta que contrasta con el fondo actual (títulos de proyectos, etc.)
      surfaceRef.current?.style.setProperty("--landing-ink", landingInkAt(progress));
    };

    const requestUpdate = () => {
      if (frame) {
        return;
      }
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  return (
    <div ref={surfaceRef} className="landing-scroll-surface">
      <div
        ref={bgRef}
        className="landing-scroll-surface__bg"
        aria-hidden
        style={{ background: landingBackgroundAt(0) }}
      />
      <div className="landing-scroll-surface__motion" aria-hidden>
        <span className="landing-blob landing-blob--pink" />
        <span className="landing-blob landing-blob--cyan" />
        <span className="landing-blob landing-blob--violet" />
        <span className="landing-blob landing-blob--blue" />
      </div>
      <div className="landing-scroll-surface__content">{children}</div>
    </div>
  );
}
