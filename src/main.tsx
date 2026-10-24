import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { loadCloudflareBeacon } from "./utils/analytics";

loadCloudflareBeacon();

const container = document.getElementById("root")!;
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// En producción el HTML llega prerenderizado (scripts/prerender.mjs) con la ruta en data-route.
// Solo se hidrata si corresponde a esta URL (o es la 404); en dev o con un fallback SPA se renderiza de cero.
const prerenderedRoute = container.dataset.route;
const currentRoute = window.location.pathname.replace(/(.)\/$/, "$1");
if (prerenderedRoute === currentRoute || prerenderedRoute === "/404") {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
