import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { BlogPage } from "./pages/BlogPage";
import { BlogPostPage } from "./pages/BlogPostPage";
import { NotFoundPage } from "./pages/NotFoundPage";

/** Antiguas vistas (/servicios, /experiencia): todo vive ahora en la home. Conserva el #ancla */
function RedirectHome() {
  const { hash } = useLocation();
  return <Navigate to={{ pathname: "/", hash }} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/servicios" element={<RedirectHome />} />
        <Route path="/experiencia" element={<RedirectHome />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
