import { useEffect, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { LandingScrollSurface } from "../components/LandingScrollSurface";
import { Seo } from "../components/Seo";
import { Hero } from "../components/sections/Hero";
import { personAndWebsiteJsonLd } from "../seo/jsonLd";
import { site } from "../seo/config";

/** Hero común con la elección; debajo, la vista elegida (/servicios o /experiencia) */
export function HomePage() {
  const { pathname, state } = useLocation();
  const viewRef = useRef<HTMLDivElement>(null);
  const revealView = (state as { revealView?: boolean } | null)?.revealView;

  // En móvil las opciones van apiladas y la vista queda bajo el pliegue: se baja hasta ella
  useEffect(() => {
    const view = viewRef.current;
    if (!revealView || !view || !window.matchMedia("(max-width: 639px)").matches) {
      return;
    }
    const header = document.querySelector<HTMLElement>(".site-header");
    const top = view.getBoundingClientRect().top + window.scrollY - (header?.offsetHeight ?? 0);
    window.scrollTo({ top, left: 0, behavior: "smooth" });
  }, [pathname, revealView]);

  return (
    <LandingScrollSurface>
      <Hero compact={pathname !== "/"} />
      <div ref={viewRef}>
        <Outlet />
      </div>
    </LandingScrollSurface>
  );
}

/** Secciones que antes vivían en la home y ahora están en la vista de recruiters */
const legacyHashes = new Set(["#experiencia", "#proyectos", "#sobre-mi", "#contacto"]);

/** Home sin vista elegida: solo el hero */
export function HomeIndex() {
  const { hash } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (legacyHashes.has(hash)) {
      navigate(`/experiencia${hash}`, { replace: true });
    }
  }, [hash, navigate]);

  return (
    <Seo
      title={site.defaultTitle}
      description={site.defaultDescription}
      path="/"
      jsonLd={personAndWebsiteJsonLd()}
    />
  );
}
