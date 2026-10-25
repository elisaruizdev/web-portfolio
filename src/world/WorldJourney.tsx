import { useEffect, useRef, type CSSProperties } from "react";
import { Link } from "react-router-dom";

import type { WorldAction, WorldStop } from "./worldData";
import { worldStore } from "./worldStore";

type WorldJourneyProps = {
  stops: WorldStop[];
  /** Nombre del recorrido para el raíl de navegación */
  label: string;
};

function clamp01(value: number) {
  return Math.min(Math.max(value, 0), 1);
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const t = clamp01((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

/** Visibilidad de la tarjeta según el tramo de la parada: aparece al llegar y se va al despegar */
function revealFor(index: number, count: number, t: number, bottom: number, viewport: number) {
  const fadeIn = index === 0 ? 1 : smoothstep(0.12, 0.32, t);
  // La última se queda hasta que el contenido de debajo empieza a taparla
  const fadeOut = index === count - 1 ? smoothstep(viewport * 0.45, viewport * 0.95, bottom) : 1 - smoothstep(0.68, 0.88, t);
  return fadeIn * fadeOut;
}

function ActionLink({ action }: { action: WorldAction }) {
  const className = action.variant === "primary" ? "btn-primary" : "btn-secondary";
  if (action.href.startsWith("#")) {
    return (
      <Link to={{ hash: action.href }} className={className}>
        {action.label}
      </Link>
    );
  }
  return (
    <a
      href={action.href}
      className={className}
      download={action.download}
      {...(action.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {action.label}
    </a>
  );
}

/**
 * Recorrido del portfolio. Cada parada es un tramo de scroll vacío; su tarjeta vive en una capa
 * fija y se enciende mientras la cámara (SceneCanvas) está dentro de la isla.
 */
export function WorldJourney({ stops, label }: WorldJourneyProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const railRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const shadeRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    shadeRef.current = document.querySelector<HTMLElement>(".world-scene__shade");
    let frame = 0;
    let active = -1;

    const update = () => {
      frame = 0;
      const viewport = window.innerHeight;
      let progress = 0;

      sectionRefs.current.forEach((section, index) => {
        if (!section) return;
        const rect = section.getBoundingClientRect();
        const t = clamp01(-rect.top / rect.height);
        if (rect.top <= 0) progress = index + t;

        const card = cardRefs.current[index];
        if (!card) return;
        const reveal = revealFor(index, stops.length, t, rect.bottom, viewport);
        card.style.setProperty("--reveal", reveal.toFixed(3));
        const hidden = reveal < 0.04;
        if (card.dataset.hidden !== String(hidden)) {
          card.dataset.hidden = String(hidden);
          card.toggleAttribute("inert", hidden);
        }
      });

      worldStore.progress = progress;
      rootRef.current?.toggleAttribute("data-started", progress > 0.04);
      const current = Math.min(Math.floor(progress), stops.length - 1);
      worldStore.side = current % 2 === 0 ? -1 : 1;

      if (current !== active) {
        active = current;
        railRefs.current.forEach((link, index) => {
          if (link) link.toggleAttribute("aria-current", index === current);
        });
      }

      // El mundo se oscurece cuando el contenido de debajo sube
      const root = rootRef.current;
      if (root && shadeRef.current) {
        const bottom = root.getBoundingClientRect().bottom;
        root.toggleAttribute("data-ended", bottom < viewport * 0.6);
        shadeRef.current.style.opacity = (clamp01((viewport - bottom) / (viewport * 0.7)) * 0.82).toFixed(3);
      }
    };

    const requestUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (shadeRef.current) shadeRef.current.style.opacity = "0";
    };
  }, [stops]);

  /** Del raíl a la parada: se aterriza con la cámara ya dentro de la isla */
  const goToStop = (event: React.MouseEvent<HTMLAnchorElement>, index: number) => {
    const section = sectionRefs.current[index];
    if (!section) return;
    event.preventDefault();
    const rect = section.getBoundingClientRect();
    const top = window.scrollY + rect.top + rect.height * (index === 0 ? 0 : 0.5);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <div ref={rootRef} className="world-journey">
      {stops.map((stop, index) => (
        <div
          key={stop.id}
          id={stop.id}
          ref={(node) => {
            sectionRefs.current[index] = node;
          }}
          className="world-journey__stop"
          style={{ "--stop-scroll": stop.scroll ?? 1.6 } as CSSProperties}
        />
      ))}

      <div className="world-cards">
        {stops.map((stop, index) => {
          const Heading = index === 0 ? "h1" : "h2";
          return (
            <article
              key={stop.id}
              ref={(node) => {
                cardRefs.current[index] = node;
              }}
              className={`world-card world-card--${index % 2 === 0 ? "left" : "right"}`}
            >
              <p className="world-card__eyebrow">
                <span className="world-card__step">
                  {String(index + 1).padStart(2, "0")}/{String(stops.length).padStart(2, "0")}
                </span>
                {stop.eyebrow}
              </p>
              <Heading id={`${stop.id}-title`} className="world-card__title">
                {stop.title}
              </Heading>
              <p className="world-card__body">{stop.body}</p>
              {stop.stats && (
                <dl className="world-card__stats">
                  {stop.stats.map((stat) => (
                    <div key={stat.label} className="world-card__stat">
                      <dt>{stat.label}</dt>
                      <dd>{stat.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {stop.tags && (
                <ul className="world-card__tags">
                  {stop.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              )}
              {stop.actions && (
                <div className="world-card__actions">
                  {stop.actions.map((action) => (
                    <ActionLink key={action.label} action={action} />
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>

      <nav className="world-rail" aria-label={label}>
        <ol>
          {stops.map((stop, index) => (
            <li key={stop.id}>
              <a
                href={`#${stop.id}`}
                ref={(node) => {
                  railRefs.current[index] = node;
                }}
                onClick={(event) => goToStop(event, index)}
              >
                <span className="world-rail__dot" aria-hidden />
                <span className="world-rail__label">{stop.label}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <p className="world-journey__hint" aria-hidden>
        Haz scroll para volar
      </p>
    </div>
  );
}
