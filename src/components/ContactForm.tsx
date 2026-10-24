import { useId, useState, type FormEvent } from "react";

import { site } from "../data/site";

type ContactFormProps = {
  /** Nombre del formulario en Netlify Forms (declarado también en index.html) */
  audience: "encargo" | "recruiter";
};

type Status = "idle" | "sending" | "sent" | "error";

const projectTypes = [
  "Una web para mi negocio",
  "Una aplicación a medida",
  "Mejorar mi web actual",
  "Otra cosa",
];

/**
 * Netlify detecta los formularios en el HTML estático (index.html) y recibe los envíos
 * como POST url-encoded con el campo `form-name`.
 */
export function ContactForm({ audience }: ContactFormProps) {
  const [status, setStatus] = useState<Status>("idle");
  const id = useId();
  const field = (name: string) => `${id}-${name}`;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const body = new URLSearchParams(
      [...new FormData(form).entries()].map(([key, value]) => [key, String(value)]),
    );

    setStatus("sending");
    try {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <p className="contact-form__done" role="status">
        ¡Gracias! He recibido tu mensaje y te respondo lo antes posible.
      </p>
    );
  }

  return (
    <form name={audience} className="contact-form" onSubmit={handleSubmit}>
      <input type="hidden" name="form-name" value={audience} />
      <p className="contact-form__trap" aria-hidden="true">
        <label>
          No rellenes este campo: <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      <div className="contact-form__row">
        <div className="contact-form__field">
          <label htmlFor={field("nombre")}>Nombre</label>
          <input id={field("nombre")} name="nombre" autoComplete="name" required />
        </div>
        {audience === "recruiter" ? (
          <div className="contact-form__field">
            <label htmlFor={field("empresa")}>Empresa</label>
            <input id={field("empresa")} name="empresa" autoComplete="organization" required />
          </div>
        ) : (
          <div className="contact-form__field">
            <label htmlFor={field("telefono")}>
              Teléfono <span className="contact-form__optional">(opcional)</span>
            </label>
            <input id={field("telefono")} name="telefono" type="tel" autoComplete="tel" />
          </div>
        )}
      </div>

      <div className="contact-form__field">
        <label htmlFor={field("email")}>Email</label>
        <input id={field("email")} name="email" type="email" autoComplete="email" required />
      </div>

      {audience === "recruiter" ? (
        <div className="contact-form__field">
          <label htmlFor={field("puesto")}>
            Puesto u oferta <span className="contact-form__optional">(nombre o enlace, opcional)</span>
          </label>
          <input id={field("puesto")} name="puesto" />
        </div>
      ) : (
        <div className="contact-form__field">
          <label htmlFor={field("tipo")}>¿Qué necesitas?</label>
          <select id={field("tipo")} name="tipo" required defaultValue="">
            <option value="" disabled>
              Elige una opción
            </option>
            {projectTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </div>
      )}

      <div className="contact-form__field">
        <label htmlFor={field("mensaje")}>
          {audience === "recruiter" ? "Mensaje" : "Cuéntame tu proyecto"}
        </label>
        <textarea
          id={field("mensaje")}
          name="mensaje"
          rows={5}
          required
          placeholder={
            audience === "recruiter"
              ? "Equipo, stack, modalidad (remoto, híbrido…) y lo que te parezca importante."
              : "Qué tienes ahora, qué te gustaría conseguir y si tienes alguna fecha en mente."
          }
        />
      </div>

      <label className="contact-form__consent">
        <input type="checkbox" name="consentimiento" value="sí" required />
        <span>
          Acepto que {site.name} use estos datos solo para responder a mi mensaje. Se guardan en
          Netlify y puedes pedir que los borre escribiendo a {site.email}.
        </span>
      </label>

      <div className="contact-form__actions">
        <button type="submit" className="btn-primary" disabled={status === "sending"}>
          {status === "sending" ? "Enviando…" : "Enviar mensaje"}
        </button>
      </div>

      {status === "error" && (
        <p className="contact-form__error" role="alert">
          No se ha podido enviar. Prueba de nuevo o escríbeme a{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>
      )}
    </form>
  );
}
