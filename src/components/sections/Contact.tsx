import { FadeIn } from "../FadeIn";

import { site } from "../../data/site";



export function Contact() {

  return (

    <section id="contacto" className="section-dark py-16 sm:py-24">

      <div className="todd-wrap text-center">

        <FadeIn>

          <p className="todd-label text-accent">Contacto</p>

          <h2 className="todd-section-title mt-2">¿Hablamos?</h2>

          <p className="mt-5 text-lg todd-muted max-w-lg mx-auto">

            Busco equipos que valoren el cuidado del producto tanto como la velocidad.

            Escríbeme — respondo en un par de días.

          </p>

          <div className="mt-10 flex flex-col sm:flex-row flex-wrap justify-center gap-3">

            <a href={`mailto:${site.email}`} className="btn-primary">

              {site.email}

            </a>

            <a

              href={site.linkedin}

              target="_blank"

              rel="noopener noreferrer"

              className="btn-secondary"

            >

              LinkedIn

            </a>

            <a

              href={site.github}

              target="_blank"

              rel="noopener noreferrer"

              className="btn-secondary"

            >

              GitHub

            </a>

          </div>

        </FadeIn>

      </div>

    </section>

  );

}

