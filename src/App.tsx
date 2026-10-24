import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { HomeIndex, HomePage } from "./pages/HomePage";
import { ServicesPage } from "./pages/ServicesPage";
import { ExperiencePage } from "./pages/ExperiencePage";
import { BlogPage } from "./pages/BlogPage";
import { BlogPostPage } from "./pages/BlogPostPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route element={<HomePage />}>
          <Route index element={<HomeIndex />} />
          <Route path="/servicios" element={<ServicesPage />} />
          <Route path="/experiencia" element={<ExperiencePage />} />
        </Route>
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
