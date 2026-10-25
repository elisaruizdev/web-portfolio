import { FadeIn } from "../FadeIn";
import { ContactForm } from "../ContactForm";

import { cvDownloads, site } from "../../data/site";

export function Contact() {
  return (
    <section id="contacto" className="section-dark py-16 sm:py-24">
      <div className="todd-wrap">
        <FadeIn className="text-center">
          <p className="todd-label text-accent">Contacto</p>
          <h2 className="todd-section-title mt-2">¿Hablamos?</h2>
        </FadeIn>

        <FadeIn className="contact-path mt-12">
          <h3 className="contact-path__title">¿Buscas perfil front-end?</h3>
          <p className="mt-3 todd-muted">
            Busco equipos que valoren el cuidado del producto tanto como la velocidad.
          </p>
          <ContactForm />
          <div className="contact-path__actions contact-path__actions--secondary">
            <a
              href={cvDownloads.design.href}
              download={cvDownloads.design.fileName}
              className="btn-secondary"
            >
              Descargar CV
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

        <p className="mt-10 text-center todd-muted">
          ¿Prefieres el email? <a href={`mailto:${site.email}`}>{site.email}</a>
        </p>
      </div>
    </section>
  );
}
