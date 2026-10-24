import { useEffect, useState } from "react";
import {
  analyticsEnabled,
  getConsent,
  loadAnalytics,
  OPEN_CONSENT_EVENT,
  setConsent,
  type Consent,
} from "../utils/analytics";

export function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!analyticsEnabled) return;

    const consent = getConsent();
    if (consent === "granted") loadAnalytics();
    if (consent === null) setOpen(true);

    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
  }, []);

  if (!open) return null;

  const choose = (consent: Consent) => {
    setConsent(consent);
    setOpen(false);
  };

  return (
    <div className="cookie-banner" role="dialog" aria-live="polite" aria-label="Aviso de cookies">
      <p className="cookie-banner__text">
        Uso Google Analytics para saber cuántas personas visitan el portfolio y desde dónde llegan.
        Solo se activa si aceptas.
      </p>
      <div className="cookie-banner__actions">
        <button
          type="button"
          className="cookie-banner__btn cookie-banner__btn--ghost"
          onClick={() => choose("denied")}
        >
          Rechazar
        </button>
        <button
          type="button"
          className="cookie-banner__btn cookie-banner__btn--primary"
          onClick={() => choose("granted")}
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}

export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_CONSENT_EVENT));
}
