import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Seo } from "../components/Seo";
import { FadeIn } from "../components/FadeIn";
import { getPostBySlug } from "../data/blog";
import { blogPostJsonLd } from "../seo/jsonLd";
import { NotFoundPage } from "./NotFoundPage";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
    // Fechas YYYY-MM-DD (medianoche UTC): mismo día en el prerender y en cualquier zona horaria
    timeZone: "UTC",
  }).format(new Date(iso));
}

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) {
    return <NotFoundPage />;
  }

  return (
    <article className="section-light py-16 sm:py-24 todd-wrap">
      <Seo
        title={post.title}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
        type="article"
        jsonLd={blogPostJsonLd(post)}
      />
      <FadeIn>
        <Link to="/blog" className="text-sm font-semibold no-underline hover:underline">
          ← Blog
        </Link>
        <time className="block mt-6 text-xs todd-muted">
          {formatDate(post.date)} · {post.readingMinutes} min
        </time>
        <h1 className="font-display text-4xl sm:text-5xl mt-3 leading-tight">
          {post.title}
        </h1>
        <ul className="chip-row mt-4">
          {post.tags.map((tag) => (
            <li key={tag} className="chip text-xs">
              {tag}
            </li>
          ))}
        </ul>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="prose-custom mt-12 todd-muted leading-relaxed space-y-4 [&_h2]:text-ink [&_h2]:font-display [&_h2]:font-bold [&_h2]:text-xl [&_h2]:mt-10 [&_h3]:text-ink [&_strong]:text-ink [&_strong]:font-semibold">
          <ReactMarkdown>{post.body}</ReactMarkdown>
        </div>
      </FadeIn>
    </article>
  );
}
