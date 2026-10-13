import { useEffect, useRef, useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { CvNavMenu } from "./CvNavMenu";
import { site } from "../data/site";



const navLinks = [

  { label: "Experiencia profesional", href: "/#experiencia" },

  { label: "Proyectos", href: "/#proyectos" },

  { label: "Blog", href: "/blog" },

  { label: "Contacto", href: "/#contacto" },

];



function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  const header = document.querySelector<HTMLElement>(".site-header");
  const offset = header?.offsetHeight ?? 0;
  const top = target.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, left: 0, behavior: "smooth" });
}

export function Layout() {

  const location = useLocation();
  const navigate = useNavigate();
  const scrollHomeAfterNav = useRef(false);

  const isHome = location.pathname === "/";
  const [showHeaderBrand, setShowHeaderBrand] = useState(!isHome);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.key]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    if (!isHome) {
      setShowHeaderBrand(true);
      return;
    }

    const update = () => {
      setShowHeaderBrand(window.scrollY > 64);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [isHome]);

  useEffect(() => {
    if (!isHome || !scrollHomeAfterNav.current) {
      return;
    }
    scrollHomeAfterNav.current = false;
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [isHome, location.key]);

  useEffect(() => {
    if (!isHome || !location.hash) {
      return;
    }
    const frame = requestAnimationFrame(() => scrollToSection(location.hash.slice(1)));
    return () => cancelAnimationFrame(frame);
  }, [isHome, location.hash, location.key]);

  const handleNavClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setMenuOpen(false);

    if (!isHome || !href.startsWith("/#")) {
      return;
    }

    event.preventDefault();
    const hash = href.slice(1);
    if (location.hash !== hash) {
      navigate(href);
    }
    scrollToSection(hash.slice(1));
  };

  const handleBrandClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    if (isHome && !location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      return;
    }

    if (isHome && location.hash) {
      navigate("/", { replace: true });
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      return;
    }

    scrollHomeAfterNav.current = true;
    navigate("/");
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${isHome ? "bg-transparent" : "bg-white"}`}
    >

      <header className="site-header sticky top-0 z-50">

        <div className="todd-wrap-wide site-header__inner flex min-h-14 sm:min-h-[4.25rem] py-2 items-center justify-between gap-3 sm:gap-4">

          <Link
            to="/"
            onClick={handleBrandClick}
            className={`site-brand shrink-0 ${isHome && !showHeaderBrand ? "site-brand--home-hero" : ""}`}
          >
            <span className="site-brand__name">{site.name}</span>
            <span className="site-brand__role">{site.role}</span>
          </Link>

          <button
            type="button"
            className="site-header__burger"
            aria-expanded={menuOpen}
            aria-controls="site-header-menu"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setMenuOpen((value) => !value)}
          >
            <span className="site-header__burger-box" aria-hidden>
              <span className="site-header__burger-line" />
              <span className="site-header__burger-line" />
              <span className="site-header__burger-line" />
            </span>
          </button>

          <div
            id="site-header-menu"
            className={`site-header__actions flex items-center gap-1 sm:gap-2 min-w-0 ml-auto${
              menuOpen ? " site-header__actions--open" : ""
            }`}
          >
          <nav className="flex items-center gap-1 sm:gap-3 min-w-0 flex-wrap justify-end">

            {navLinks.map((link) => {

              const active =

                link.href === "/"

                  ? isHome

                  : link.href.startsWith("/#")

                    ? isHome

                    : location.pathname.startsWith(link.href);

              return (

                <Link

                  key={link.href}

                  to={link.href}

                  onClick={(event) => handleNavClick(event, link.href)}

                  className={`rounded-md px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-semibold no-underline transition-colors shrink-0 ${
                    active ? "text-ink" : "text-muted hover:text-ink"
                  }`}

                >

                  {link.label}

                </Link>

              );

            })}

            <CvNavMenu />
          </nav>

          <div className="site-header__social" aria-label="Perfiles sociales">
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="site-header__social-link"
              aria-label="LinkedIn de Elisa Ruiz"
            >
              <svg viewBox="0 0 24 24" aria-hidden focusable="false">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              className="site-header__social-link"
              aria-label="GitHub de Elisa Ruiz"
            >
              <svg viewBox="0 0 24 24" aria-hidden focusable="false">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </a>
          </div>
          </div>

        </div>

      </header>

      <main className={`flex-1 ${isHome ? "bg-transparent" : "bg-white"}`}>

        <Outlet />

      </main>

      <footer
        className={`site-footer py-10 text-center text-sm todd-muted ${isHome ? "bg-transparent" : ""}`}
      >

        <p className="todd-wrap-wide">

          © {new Date().getFullYear()} {site.name} · Madrid · React + Vite

        </p>

      </footer>

    </div>

  );

}

