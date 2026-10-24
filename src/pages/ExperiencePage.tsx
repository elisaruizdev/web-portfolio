import { Seo } from "../components/Seo";
import { FadeIn } from "../components/FadeIn";
import { TechStackCarousel } from "../components/TechStackCarousel";
import { CredibilityStats } from "../components/sections/CredibilityStats";
import { Experience } from "../components/sections/Experience";
import { Projects } from "../components/sections/Projects";
import { Strengths } from "../components/sections/Strengths";
import { BlogTeaser } from "../components/sections/BlogTeaser";
import { Contact } from "../components/sections/Contact";
import { recruiterHighlights, site } from "../data/site";
import { profilePageJsonLd } from "../seo/jsonLd";

const pageDescription = `Experiencia de ${site.name} como ${site.techRole}: más de ${site.yearsExperience} años en banca y fintech con Angular, Vue y TypeScript. Trayectoria, proyectos y CV descargable.`;

/** Vista "Soy recruiter" bajo el hero de la home */
export function ExperiencePage() {
  const { pitchIntro, pitchTags } = recruiterHighlights;

  return (
    <>
      <Seo
        title={`${site.techRole}: experiencia y CV`}
        description={pageDescription}
        path="/experiencia"
        jsonLd={profilePageJsonLd()}
      />

      <section className="section-light recruiter-intro">
        <FadeIn className="todd-wrap text-center">
          <p className="todd-label text-accent">{site.techRole}</p>
          <h2 className="recruiter-intro__title">{pitchIntro}</h2>
          <p className="recruiter-intro__tags">
            {pitchTags.map((tag, index) => (
              <span key={tag}>
                {index > 0 && (
                  <span className="hero-speech__sub-sep" aria-hidden>
                    {" "}
                    ·{" "}
                  </span>
                )}
                <span className="hero-speech__sub-tag">{tag}</span>
              </span>
            ))}
          </p>
        </FadeIn>

        <div className="tech-carousel-strip">
          <div className="tech-carousel-strip__header">
            <h3 className="tech-carousel-strip__title">Tecnologías con las que he trabajado</h3>
          </div>
          <TechStackCarousel />
        </div>
      </section>

      <CredibilityStats />
      <Experience />
      <Projects />
      <Strengths />
      <BlogTeaser />
      <Contact audience="recruiter" />
    </>
  );
}
