import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";

import {
  experience,
  type Experience,
  type ExperienceProject,
  type ExperienceSector,
} from "../../data/site";
import { highlightText } from "../../utils/highlightText";

const easeOut = [0.22, 1, 0.36, 1] as const;

function uniqueSectors(projects: ExperienceProject[]) {
  const seen = new Set<ExperienceSector>();
  const chips: { id: ExperienceSector; chip: string }[] = [];
  for (const project of projects) {
    if (project.sector === "legal" || seen.has(project.sector)) {
      continue;
    }
    seen.add(project.sector);
    chips.push({ id: project.sector, chip: project.chip });
  }
  return chips;
}

function TimelineItem({
  job,
  index,
  reduceMotion,
}: {
  job: Experience;
  index: number;
  reduceMotion: boolean;
}) {
  const sectors = job.projects ? uniqueSectors(job.projects) : [];

  return (
    <li
      className={`experience-timeline__item${
        job.current ? " experience-timeline__item--current" : ""
      }`}
    >
      <span className="experience-timeline__year">{job.yearLabel}</span>
      <div className="experience-timeline__marker">
        <motion.span
          className="experience-timeline__dot"
          aria-hidden
          initial={reduceMotion ? false : { scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ type: "spring", stiffness: 280, damping: 18, delay: 0.08 + index * 0.06 }}
        />
      </div>
      <motion.article
        className="experience-timeline__body"
        aria-current={job.current ? "true" : undefined}
        initial={reduceMotion ? false : { opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.55, ease: easeOut, delay: index * 0.08 }}
      >
        <header className="experience-timeline__header">
          <time className="todd-label experience-timeline__period" dateTime={job.startDate}>
            {job.period}
          </time>
          <span className="experience-timeline__duration">{job.duration}</span>
        </header>
        <h3 className="experience-timeline__role">{job.role}</h3>
        <p className="experience-timeline__company">{job.company}</p>
        {job.summary ? (
          <p className="experience-timeline__summary">{highlightText(job.summary)}</p>
        ) : null}
        {sectors.length > 0 ? (
          <ul className="experience-timeline__sectors">
            {sectors.map((sector) => (
              <li
                key={sector.id}
                className={`experience-timeline__sector experience-timeline__sector--${sector.id}`}
              >
                {sector.chip}
              </li>
            ))}
          </ul>
        ) : null}
      </motion.article>
    </li>
  );
}

export function ExperienceTimeline() {
  const reduceMotion = useReducedMotion() ?? false;
  const rootRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start 0.88", "start 0.28"],
  });
  const fill = useSpring(scrollYProgress, {
    stiffness: 88,
    damping: 26,
    restDelta: 0.001,
  });

  const viewportRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const update = () => {
      const maxScroll = viewport.scrollWidth - viewport.clientWidth;
      setCanPrev(viewport.scrollLeft > 4);
      setCanNext(viewport.scrollLeft < maxScroll - 4);
    };

    update();
    viewport.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      viewport.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const scrollByItem = (direction: 1 | -1) => {
    const viewport = viewportRef.current;
    const item = viewport?.querySelector<HTMLElement>(".experience-timeline__item");
    if (!viewport || !item) return;
    const gap = parseFloat(getComputedStyle(item.parentElement!).columnGap) || 0;
    viewport.scrollBy({
      left: direction * (item.offsetWidth + gap),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <div ref={rootRef} className="experience-timeline-wrap">
      <div ref={viewportRef} className="experience-timeline">
      <div className="experience-timeline__scroller">
        <div className="experience-timeline__axis" aria-hidden="true">
          <motion.span
            className="experience-timeline__axis-fill"
            style={{ scaleX: reduceMotion ? 1 : fill }}
          />
        </div>
        <ol className="experience-timeline__list">
          {experience.map((job, index) => (
            <TimelineItem
              key={job.company + job.startDate}
              job={job}
              index={index}
              reduceMotion={reduceMotion}
            />
          ))}
        </ol>
      </div>
      </div>
      <div className="experience-timeline__nav">
        <button
          type="button"
          className="experience-timeline__arrow"
          aria-label="Experiencia anterior"
          disabled={!canPrev}
          onClick={() => scrollByItem(-1)}
        >
          <svg viewBox="0 0 24 24" aria-hidden focusable="false">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <button
          type="button"
          className="experience-timeline__arrow"
          aria-label="Experiencia siguiente"
          disabled={!canNext}
          onClick={() => scrollByItem(1)}
        >
          <svg viewBox="0 0 24 24" aria-hidden focusable="false">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export function ExperienceClients() {
  return (
    <div className="experience-clients">
      <p className="todd-label experience-clients__eyebrow">Mis últimos 4 años como</p>
      <h3 className="experience-clients__title">Front end web developer</h3>
    </div>
  );
}

export function ExperiencePastDetails() {
  const roles = experience.filter((job) => job.bullets && job.bullets.length > 0);
  if (roles.length === 0) {
    return null;
  }

  return (
    <div className="experience-past">
      {roles.map((job) => (
        <section key={job.company + job.startDate} className="experience-past__role">
          <p className="todd-label experience-past__eyebrow">En {job.company}</p>
          <h3 className="experience-past__title">{job.role}</h3>
          <ul className="experience-timeline__bullets">
            {job.bullets?.map((bullet) => (
              <li key={bullet}>{highlightText(bullet)}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
