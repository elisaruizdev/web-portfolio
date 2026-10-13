import { FadeIn } from "../FadeIn";

import { education } from "../../data/site";
import { ExperienceStory } from "./ExperienceStory";
import { ExperienceTimeline } from "./ExperienceTimeline";

export function Experience() {
  return (
    <section id="experiencia" className="section-light section-bg-experience pb-2 sm:pb-4">
      <div className="experience-bg" aria-hidden="true">
        <div className="experience-bg__viewport">
          <span className="experience-bg__aurora experience-bg__aurora--cyan" />
          <span className="experience-bg__aurora experience-bg__aurora--pink" />
          <span className="experience-bg__aurora experience-bg__aurora--violet" />
          <span className="experience-bg__vignette" />
        </div>
      </div>
      <div className="todd-wrap-wide experience-content">
        <div className="experience-intro">
          <FadeIn>
            <p className="todd-label text-accent experience-kicker">Experiencia profesional</p>
            <h2 className="todd-section-title experience-heading mt-2">Trayectoria que puedes contrastar</h2>
          </FadeIn>

          <ExperienceTimeline />
        </div>

        <ExperienceStory />

        <div className="experience-education">
          <FadeIn delay={0.1}>
            <h3 className="experience-education__heading">Formación</h3>
            <ul className="experience-education__list">
              {education.map((item) => (
                <li key={item.title + item.period} className="experience-education__item">
                  <p className="todd-label experience-education__period">{item.period}</p>
                  <p className="experience-education__title">{item.title}</p>
                  <p className="todd-muted experience-education__school">{item.institution}</p>
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
      </div>
      <div className="experience-section-arc" aria-hidden="true">
        <svg viewBox="0 0 1440 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,0 C360,200 1080,200 1440,0 Z" fill="#000000" />
        </svg>
      </div>
    </section>
  );
}
