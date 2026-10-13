import type { Project } from "../../data/site";

export function projectImageSources(project: Project): string[] {
  if (project.images?.length) {
    return project.images;
  }
  if (project.image) {
    return [project.image];
  }
  return [`/projects/${project.id}.webp`];
}

/** Texto de la barra del navegador: browserUrl, el dominio de la demo o el título. */
export function projectBrowserUrl(project: Project): string {
  if (project.browserUrl) {
    return project.browserUrl;
  }
  if (project.href) {
    try {
      return new URL(project.href).hostname.replace(/^www\./, "");
    } catch {
      // href relativo o mal formado: se usa el título
    }
  }
  return project.title;
}
