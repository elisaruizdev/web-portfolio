import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Seo } from "../components/Seo";
import { FadeIn } from "../components/FadeIn";
import { getPostBySlug } from "../data/blog";
import { blogPostJsonLd } from "../seo/jsonLd";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) {
    return (
      <div className="section-light py-24 todd-wrap text-center">
        <Seo
          title="Artículo no encontrado"
          description="La entrada del blog que buscas no existe."
          path={slug ? `/blog/${slug}` : "/blog"}
          noIndex
        />
        <p className="todd-muted">Artículo no encontrado.</p>
        <Link to="/blog" className="mt-4 inline-block text-accent">
          Volver al blog
        </Link>
      </div>
    );
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
