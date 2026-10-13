import { useState } from "react";

import type { Project } from "../../data/site";
import { BrowserFrame } from "../BrowserFrame";
import { ProjectDetailPanel } from "./ProjectDetailPanel";
import { projectBrowserUrl, projectImageSources } from "./projectImages";

type PersonalProjectsScrollProps = {
  projects: Project[];
};

function ProjectHeroImage({ src, alt, title }: { src: string; alt: string; title: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="project-showcase__placeholder" aria-hidden>
        <span className="project-showcase__placeholder-label">{title}</span>
        <span className="project-showcase__placeholder-hint">Añade el pantallazo en public/projects</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="project-showcase__image"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

function PersonalProjectShowcase({ project }: { project: Project }) {
  const sources = projectImageSources(project);
  const browserUrl = projectBrowserUrl(project);
  const multiScreen = sources.length > 1;

  return (
    <article
      className={`project-showcase${multiScreen ? " project-showcase--multi" : ""}`}
    >
      <div className="project-showcase__media">
        <div className="project-showcase__stack">
          {sources.map((src, index) => (
            <div key={src} className="project-showcase__hero">
              <BrowserFrame url={browserUrl}>
                <ProjectHeroImage
                  src={src}
                  alt={
                    multiScreen
                      ? `${project.imageAlt ?? project.title} (${index + 1}/${sources.length})`
                      : (project.imageAlt ?? project.title)
                  }
                  title={project.title}
                />
              </BrowserFrame>
            </div>
          ))}
        </div>
      </div>

      <ProjectDetailPanel project={project} />
    </article>
  );
}
export function PersonalProjectsScroll({ projects }: PersonalProjectsScrollProps) {
  if (projects.length === 0) {
    return null;
  }

  return (
    <div className="personal-projects">
      {projects.map((project) => (
        <PersonalProjectShowcase key={project.id} project={project} />
      ))}
    </div>
  );
}
