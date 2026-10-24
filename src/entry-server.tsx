import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App";
import { SeoHeadContext, type SeoHead } from "./components/Seo";
import { blogPosts } from "./data/blog";

/** Rutas que se generan como HTML estático en el build */
export const routes = [
  "/",
  "/servicios",
  "/experiencia",
  "/blog",
  ...blogPosts.map((post) => `/blog/${post.slug}`),
];

export function render(url: string): { html: string; head?: SeoHead } {
  const collector: { head?: SeoHead } = {};
  const html = renderToString(
    <SeoHeadContext.Provider value={collector}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </SeoHeadContext.Provider>,
  );
  return { html, head: collector.head };
}
