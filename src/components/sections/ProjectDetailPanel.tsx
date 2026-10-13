import type { Project } from "../../data/site";
import { projectTagLogo } from "./projectTagLogos";
type ProjectDetailPanelProps = {
  project: Project;
};

export function ProjectDetailPanel({ project }: ProjectDetailPanelProps) {
  return (
    <div className="project-showcase__content">
      <h4 className="project-showcase__title">{project.title}</h4>
      <p className="project-showcase__description">{project.description}</p>
      {project.highlight && <p className="project-showcase__highlight">{project.highlight}</p>}
      <ul className="project-showcase__tags project-showcase__tag-logos">
        {project.tags.flatMap((tag) => {
          const labels = tag.includes("·") ? tag.split("·").map((part) => part.trim()) : [tag];
          return labels.map((label) => {
            const logo = projectTagLogo(label);
            return (
              <li key={`${tag}-${label}`}>
                {logo ? (
                  <img
                    src={logo}
                    alt={label}
                    className="project-showcase__tag-logo"
                    width={44}
                    height={44}
                    loading="lazy"
                  />
                ) : (
                  <span className="chip text-sm">{label === tag ? tag : label}</span>
                )}
              </li>
            );
          });
        })}
      </ul>
      <div className="project-showcase__links">
        {project.href && (
          <a href={project.href} target="_blank" rel="noreferrer">
            Demo
          </a>
        )}
        {project.repo && (
          <a href={project.repo} target="_blank" rel="noreferrer">
            Código
          </a>
        )}
      </div>
    </div>
  );
}
