import type { strengths } from "../../data/site";

type StrengthItem = (typeof strengths)[number];

type StrengthsScrollProps = {
  items: readonly StrengthItem[];
  eyebrow: string;
  title: string;
  about: string;
};

export function StrengthsScroll({ items, eyebrow, title, about }: StrengthsScrollProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <article className="strength-showcase strength-showcase--scroll">
      <div className="strength-showcase__intro-col">
        <div className="strength-showcase__intro">
          <p className="todd-label text-accent">{eyebrow}</p>
          <h2 className="todd-section-title strength-showcase__title">{title}</h2>
          <p className="strength-showcase__about todd-muted">{about}</p>
        </div>
      </div>

      <div className="strength-showcase__cards">
        <div className="strength-showcase__cards-stack">
          {items.map((item) => (
            <article key={item.title} className="todd-card strength-showcase__card">
              <h3 className="font-display font-extrabold text-lg sm:text-xl">{item.title}</h3>
              <p className="strength-showcase__card-body todd-muted leading-relaxed">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </article>
  );
}
