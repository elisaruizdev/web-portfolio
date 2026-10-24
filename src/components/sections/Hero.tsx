import { NavLink } from "react-router-dom";

import { PuffyText } from "../PuffyText";
import { audienceChoice, site } from "../../data/site";

const options = [audienceChoice.client, audienceChoice.recruiter];

type HeroProps = {
  /** Sin vista elegida ocupa la pantalla; con una vista elegida se compacta para dejar ver el contenido */
  compact?: boolean;
};

export function Hero({ compact = false }: HeroProps) {
  return (
    <section
      className={`section-light section-bg-hero hero-speech${compact ? " hero-speech--compact" : ""}`}
    >
      <div className="hero-speech__fold">
        <div className="hero-speech__stage">
          <div className="hero-speech__inner">
            <h1 className="hero-speech__identity">
              <span className="hero-speech__name">{site.name}</span>
              <span className="hero-speech__role-tag">
                <span className="hero-speech__role-sheet" aria-hidden="true">
                  <span className="hero-speech__role-fiber" />
                </span>
                <PuffyText text={site.role} tone="white" className="hero-speech__role-ink" />
              </span>
            </h1>

            <p className="hero-speech__sub">{audienceChoice.intro}</p>

            <nav className="audience-choice" aria-label={audienceChoice.prompt}>
              <p className="audience-choice__prompt">{audienceChoice.prompt}</p>
              <div className="audience-choice__options">
                {options.map((option) => (
                  <NavLink
                    key={option.href}
                    to={option.href}
                    state={{ keepScroll: true, revealView: true }}
                    className="audience-choice__option"
                  >
                    <span className="audience-choice__label">{option.label}</span>
                    <span className="audience-choice__hint">{option.hint}</span>
                  </NavLink>
                ))}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}
