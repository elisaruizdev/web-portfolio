type PhoneFrameProps = {
  src: string;
  alt: string;
};

/* Móvil (marco, isla y botón de inicio) alrededor de una captura vertical.
   Se superpone a la captura de escritorio para indicar que la app es responsive. */
export function PhoneFrame({ src, alt }: PhoneFrameProps) {
  return (
    <figure className="phone-frame">
      <div className="phone-frame__body">
        <span className="phone-frame__island" aria-hidden="true" />
        <img src={src} alt={alt} className="phone-frame__screen" loading="lazy" />
      </div>
      <figcaption className="phone-frame__badge">También en móvil</figcaption>
    </figure>
  );
}
