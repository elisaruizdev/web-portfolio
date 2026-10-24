import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { FadeIn } from "../components/FadeIn";
import { Projects } from "../components/sections/Projects";
import { Contact } from "../components/sections/Contact";
import { freelance, site } from "../data/site";
import { professionalServiceJsonLd } from "../seo/jsonLd";

const pageDescription = `${site.name}, desarrolladora web en Madrid. Webs para negocios, aplicaciones a medida y mejora de webs existentes. Cuéntame tu proyecto.`;

/** Vista "Necesito una web" bajo el hero de la home */
export function ServicesPage() {
  return (
    <>
      <Seo
        title="Diseño y desarrollo web en Madrid"
        description={pageDescription}
        path="/servicios"
        jsonLd={professionalServiceJsonLd()}
      />

      <section className="section-light py-16 sm:py-24">
        <div className="todd-wrap">
          <FadeIn>
            <p className="todd-label text-accent">Webs por encargo</p>
            <h2 className="todd-section-title mt-2">{freelance.title}</h2>
            <p className="mt-5 text-lg todd-muted">{freelance.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={{ hash: "#contacto" }} className="btn-primary">
                Cuéntame tu proyecto
              </Link>
            </div>
          </FadeIn>

          <FadeIn className="mt-16">
            <h3 className="font-display font-bold text-2xl">En qué te puedo ayudar</h3>
            <ul className="mt-6 grid gap-5 sm:grid-cols-3">
              {freelance.examples.map((item) => (
                <li key={item.title} className="todd-card list-none h-full">
                  <h4 className="font-display font-bold text-lg">{item.title}</h4>
                  <p className="mt-2 todd-muted text-base">{item.description}</p>
                </li>
              ))}
            </ul>
          </FadeIn>

          <FadeIn className="mt-16">
            <h3 className="font-display font-bold text-2xl">Cómo trabajo</h3>
            <ul className="services-reasons mt-6">
              {freelance.reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </FadeIn>
        </div>
      </section>

      <Projects
        title="Algunos proyectos"
        intro="Aplicaciones que he diseñado y desarrollado de principio a fin, del login al panel de gestión."
      />

      <Contact audience="client" />
    </>
  );
}
