import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { FadeIn } from "../components/FadeIn";
import { getSortedPosts } from "../data/blog";
import { blogListingJsonLd } from "../seo/jsonLd";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

const blogDescription =
  "Notas sobre desarrollo frontend, revisión de producto y búsqueda de empleo sin clichés.";

export function BlogPage() {
  const posts = getSortedPosts();

  return (
    <div className="section-light py-16 sm:py-24">
      <div className="todd-wrap">
      <Seo
        title="Blog"
        description={blogDescription}
        path="/blog"
        jsonLd={blogListingJsonLd(posts)}
      />
      <FadeIn>
        <Link to="/" className="text-sm font-semibold">
          ← Inicio
        </Link>
        <h1 className="todd-section-title mt-6">Blog</h1>
        <p className="mt-4 todd-muted">{blogDescription}</p>
      </FadeIn>

      <ul className="mt-14 space-y-6">
        {posts.map((post, i) => (
          <FadeIn key={post.slug} delay={i * 0.05}>
            <li className="list-none">
              <Link to={`/blog/${post.slug}`} className="todd-card block no-underline hover:no-underline text-ink">
                <time className="text-sm todd-muted">
                  {formatDate(post.date)} · {post.readingMinutes} min lectura
                </time>
                <h2 className="mt-2 font-display font-bold text-2xl">
                  {post.title}
                </h2>
                <p className="mt-2 todd-muted">{post.excerpt}</p>
                <ul className="chip-row mt-3">
                  {post.tags.map((tag) => (
                    <li key={tag} className="chip text-xs">
                      {tag}
                    </li>
                  ))}
                </ul>
              </Link>
            </li>
          </FadeIn>
        ))}
      </ul>
      </div>
    </div>
  );
}
