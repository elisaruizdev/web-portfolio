import { CredibilityStats } from "./CredibilityStats";
import { TechStackCarousel } from "../TechStackCarousel";

import { HeroAnimatedName } from "../HeroAnimatedName";
import { PuffyText } from "../PuffyText";
import { recruiterHighlights, site } from "../../data/site";

function HeroPitchSep() {
  return (
    <span className="hero-speech__sub-sep" aria-hidden>
      {" "}
      ·{" "}
    </span>
  );
}

export function Hero() {
  const { pitchIntro, pitchTags } = recruiterHighlights;

  return (
    <section className="section-light section-bg-hero hero-speech">
      <div className="hero-speech__fold">
      <div className="hero-speech__stage">
        <div className="hero-speech__inner">
          <div className="hero-speech__identity">
            <HeroAnimatedName name={site.name} />
            <p className="hero-speech__role-tag">
              <span className="hero-speech__role-sheet" aria-hidden="true">
                <span className="hero-speech__role-fiber" />
              </span>
              <PuffyText text={site.role} tone="white" className="hero-speech__role-ink" />
            </p>
          </div>

          <p className="hero-speech__sub">
            <span className="hero-speech__sub-lead">{pitchIntro}</span>
            <span className="hero-speech__sub-tags">
              {pitchTags.map((tag, index) => (
                <span key={tag}>
                  {index > 0 && <HeroPitchSep />}
                  <span className="hero-speech__sub-tag">{tag}</span>
                </span>
              ))}
            </span>
          </p>
        </div>
      </div>

      <div className="tech-carousel-strip">
        <div className="tech-carousel-strip__header">
          <h2 className="tech-carousel-strip__title">Tecnologías con las que he trabajado</h2>
        </div>
        <TechStackCarousel />
      </div>

      <CredibilityStats />
      </div>
    </section>
  );
}
