import { Seo } from "../components/Seo";
import { Experience } from "../components/sections/Experience";
import { Projects } from "../components/sections/Projects";
import { BlogTeaser } from "../components/sections/BlogTeaser";
import { Contact } from "../components/sections/Contact";
import { homeJsonLd } from "../seo/jsonLd";
import { site } from "../seo/config";
import { SceneBackdrop } from "../world/SceneBackdrop";
import { WorldJourney } from "../world/WorldJourney";
import { portfolioStops } from "../world/worldData";

/** Portfolio: un vuelo por el mundo 3D y, debajo, la trayectoria, los proyectos y el contacto */
export function HomePage() {
  return (
    <div className="world-surface">
      <Seo
        title={site.defaultTitle}
        description={site.defaultDescription}
        path="/"
        jsonLd={homeJsonLd()}
      />

      <SceneBackdrop />
      <WorldJourney stops={portfolioStops} label="Recorrido por mi perfil" />

      <div className="world-after">
        <Experience />
        <Projects />
        <BlogTeaser />
        <Contact />
      </div>
    </div>
  );
}
