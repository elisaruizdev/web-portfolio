/** ID de medición de Google Analytics 4. Se puede sobrescribir con VITE_GA_ID. */
export const GA_ID = import.meta.env.VITE_GA_ID ?? "G-R8P5M5Q76D";

/** Solo se mide en producción, para que las visitas en localhost no ensucien los datos. */
export const analyticsEnabled = import.meta.env.PROD && Boolean(GA_ID);

export type Consent = "granted" | "denied";

const CONSENT_KEY = "analytics-consent";
export const OPEN_CONSENT_EVENT = "open-cookie-consent";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

export function getConsent(): Consent | null {
  try {
    const value = localStorage.getItem(CONSENT_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

export function setConsent(consent: Consent) {
  try {
    localStorage.setItem(CONSENT_KEY, consent);
  } catch {
    // Sin almacenamiento disponible: la decisión dura solo esta visita.
  }

  if (consent === "granted") {
    loadAnalytics();
  } else {
    revokeAnalytics();
  }
}

let loaded = false;

export function loadAnalytics() {
  if (!analyticsEnabled || loaded) return;
  loaded = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // gtag.js espera el objeto `arguments`, no un array.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_ID);

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);
}

function revokeAnalytics() {
  if (loaded) {
    window.gtag("consent", "update", { analytics_storage: "denied" });
  }

  // Borra las cookies _ga que ya se hubieran creado.
  const domain = window.location.hostname.replace(/^www\./, "");
  document.cookie.split(";").forEach((cookie) => {
    const name = cookie.split("=")[0].trim();
    if (!name.startsWith("_ga")) return;
    for (const d of ["", domain, `.${domain}`]) {
      document.cookie = `${name}=; Max-Age=0; path=/${d ? `; domain=${d}` : ""}`;
    }
  });
}
