import { Link, useLocation } from "react-router-dom";
import { Seo } from "../components/Seo";

export function NotFoundPage() {
  const { pathname } = useLocation();

  return (
    <div className="section-light py-24 todd-wrap text-center">
      <Seo
        title="Página no encontrada"
        description="La página que buscas no existe."
        path={pathname}
        noIndex
      />
      <h1 className="todd-section-title">Página no encontrada</h1>
      <p className="mt-4 todd-muted">La página que buscas no existe o ha cambiado de dirección.</p>
      <Link to="/" className="btn-primary mt-8">
        Volver al inicio
      </Link>
    </div>
  );
}
