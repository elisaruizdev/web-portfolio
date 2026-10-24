import { FadeIn } from "../FadeIn";

import { PersonalProjectsScroll } from "./PersonalProjectsScroll";
import { projects } from "../../data/site";

type ProjectsProps = {
  title?: string;
  intro?: string;
};

export function Projects({
  title = "Proyectos personales",
  intro = "Side projects y prácticas publicadas en GitHub, donde pruebo stack, UX y calidad fuera del día a día en cliente.",
}: ProjectsProps) {
  const personalProjects = projects.filter((p) => p.category === "personal");

  return (
    <section id="proyectos" className="section-light section-bg-projects pb-16 sm:pb-24">
      <div className="todd-wrap-wide">
        <FadeIn>
          <h2 className="display-band-title">{title}</h2>
          <p className="mt-4 todd-muted max-w-2xl">{intro}</p>
        </FadeIn>
      </div>

      <PersonalProjectsScroll projects={personalProjects} />
    </section>
  );
}
