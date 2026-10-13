import { Link } from "react-router-dom";
import { FadeIn } from "../FadeIn";
import { getSortedPosts } from "../../data/blog";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export function BlogTeaser() {
  const posts = getSortedPosts().slice(0, 2);

  return (
    <section className="section-light section-bg-blog py-16 sm:py-24">
      <div className="todd-wrap-wide">
        <FadeIn className="blog-teaser__lead flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="todd-label text-accent">Blog</p>
            <h2 className="todd-section-title mt-2">Ideas que comparto</h2>
            <p className="mt-3 todd-muted max-w-xl">
              Frontend, calidad y carrera — para que veas cómo pienso fuera del CV.
            </p>
          </div>
          <Link to="/blog" className="blog-teaser__all font-semibold shrink-0">
            Ver todos →
          </Link>
        </FadeIn>

        <ul className="mt-10 grid gap-6 sm:grid-cols-2">
          {posts.map((post, i) => (
            <FadeIn key={post.slug} delay={i * 0.08}>
              <li className="list-none">
                <Link to={`/blog/${post.slug}`} className="todd-card block h-full no-underline hover:no-underline text-ink">
                  <time className="text-sm todd-muted">
                    {formatDate(post.date)} · {post.readingMinutes} min
                  </time>
                  <h3 className="mt-2 font-display font-bold text-lg">{post.title}</h3>
                  <p className="mt-2 todd-muted line-clamp-2">{post.excerpt}</p>
                </Link>
              </li>
            </FadeIn>
          ))}
        </ul>
      </div>
    </section>
  );
}
