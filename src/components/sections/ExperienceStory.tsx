import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";

import {
  experience,
  type ExperienceProject,
  type ExperienceSector,
  type ExperienceTicket,
} from "../../data/site";
import { highlightText } from "../../utils/highlightText";
import { ExperienceDailyStack } from "./ExperienceDailyStack";

const DESKTOP_MIN = 960;
const PIN_STEP_VH = 100;
const VISIBLE_SECTORS: ExperienceSector[] = ["financiero", "bancario"];

function groupProjects(projects: ExperienceProject[]) {
  return VISIBLE_SECTORS.map((sector) => ({
    sector,
    label: projects.find((project) => project.sector === sector)?.sectorLabel ?? sector,
    items: projects.filter((project) => project.sector === sector),
  })).filter((group) => group.items.length > 0);
}

function StoryHeading() {
  return (
    <header className="experience-story__header">
      <p className="experience-clients__eyebrow">
        <span className="experience-key">
          Mis últimos 4 años como
          <svg
            className="experience-key__mark"
            viewBox="0 0 120 10"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              d="M2.4 6.6 C 22 2.1, 40 9.8, 60 6.2 C 80 2.6, 98 9.4, 117.6 5.5"
              pathLength={1}
            />
          </svg>
        </span>
      </p>
      <h3 className="experience-clients__title">Front end web developer</h3>
    </header>
  );
}

function StoryIcon() {
  return (
    <svg className="jira-ticket__icon" viewBox="0 0 16 16" aria-hidden>
      <path
        fill="#22a06b"
        d="M3.2 1.4h9.6c.5 0 .9.4.9.9v12.2l-5.7-2.7-5.7 2.7V2.3c0-.5.4-.9.9-.9z"
      />
    </svg>
  );
}

function TaskIcon() {
  return (
    <svg className="jira-ticket__icon" viewBox="0 0 16 16" aria-hidden>
      <rect x="1.6" y="1.6" width="12.8" height="12.8" rx="2" fill="#388bff" />
      <path
        d="M4.3 8.1 6.8 10.5 11.7 5.5"
        fill="none"
        stroke="#fff"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const TICKET_TYPE_LABEL = {
  story: "Historia",
  task: "Tarea",
} as const;

const TICKET_STATUS_LABEL = {
  done: "Listo",
  progress: "En curso",
} as const;

function JiraTicketCard({ ticket }: { ticket: ExperienceTicket }) {
  return (
    <article className={`jira-ticket jira-ticket--${ticket.status}`}>
      <header className="jira-ticket__meta">
        <span className="jira-ticket__type">
          {ticket.type === "story" ? <StoryIcon /> : <TaskIcon />}
          <span className="jira-ticket__type-label">{TICKET_TYPE_LABEL[ticket.type]}</span>
        </span>
        <span className="jira-ticket__key">{ticket.key}</span>
        <span className={`jira-ticket__status jira-ticket__status--${ticket.status}`}>
          {TICKET_STATUS_LABEL[ticket.status]}
        </span>
        <span className="jira-ticket__avatar" title="Elisa Ruiz">
          ER
        </span>
      </header>
      <p className="jira-ticket__summary">{highlightText(ticket.summary)}</p>
    </article>
  );
}

function JiraBoard({ tickets }: { tickets: ExperienceTicket[] }) {
  const columns = (["done", "progress"] as const)
    .map((status) => ({
      status,
      label: TICKET_STATUS_LABEL[status],
      items: tickets.filter((ticket) => ticket.status === status),
    }))
    .filter((column) => column.items.length > 0);

  return (
    <div className="jira-board">
      {columns.map((column) => (
        <section key={column.status} className={`jira-column jira-column--${column.status}`}>
          <h5 className="jira-column__title">
            {column.label}
            <span className="jira-column__count">{column.items.length}</span>
          </h5>
          <ul className="jira-column__list">
            {column.items.map((ticket) => (
              <li key={ticket.key}>
                <JiraTicketCard ticket={ticket} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function SectorChapter({
  sector,
  label,
  items,
}: {
  sector: ExperienceSector;
  label: string;
  items: ExperienceProject[];
}) {
  return (
    <div className={`experience-story__chapter experience-story__chapter--sector experience-story__chapter--${sector}`}>
      <h3 className="experience-story__sector-title">{label}</h3>
      <div className="experience-story__sector-items">
        {items.map((project) => (
          <article
            key={project.id}
            className={`experience-client experience-client--${project.sector}`}
          >
            <h4 className="experience-client__heading">{highlightText(project.title)}</h4>
            {project.description ? (
              <p className="experience-client__description">{highlightText(project.description)}</p>
            ) : null}
            {project.tickets && project.tickets.length > 0 ? (
              <JiraBoard tickets={project.tickets} />
            ) : project.bullets && project.bullets.length > 0 ? (
              <ul className="experience-client__bullets">
                {project.bullets.map((bullet) => (
                  <li key={bullet}>{highlightText(bullet)}</li>
                ))}
              </ul>
            ) : null}
            {project.tags.length > 0 ? (
              <ul className="experience-client__tags">
                {project.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}

export function ExperienceStory() {
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [stackEnabled, setStackEnabled] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= DESKTOP_MIN,
  );
  const [stackShown, setStackShown] = useState(false);
  const stackShownRef = useRef(false);
  const transformRef = useRef("translate3d(0,0,0)");

  const zeeker = experience.find((job) => job.projects && job.projects.length > 0);
  const sectors = zeeker?.projects ? groupProjects(zeeker.projects) : [];
  const slideCount = 1 + sectors.length + 1;

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMode = () => {
      const desktop = window.innerWidth >= DESKTOP_MIN && !motion.matches;
      setStackEnabled(desktop);
      if (!desktop) {
        stackShownRef.current = false;
        setStackShown(false);
      }
    };

    updateMode();
    window.addEventListener("resize", updateMode);
    motion.addEventListener("change", updateMode);
    return () => {
      window.removeEventListener("resize", updateMode);
      motion.removeEventListener("change", updateMode);
    };
  }, []);

  useLayoutEffect(() => {
    if (!stackEnabled) {
      return;
    }

    const pin = pinRef.current;
    const track = trackRef.current;
    if (!pin || !track) {
      return;
    }

    const sticky = pin.querySelector<HTMLElement>(".experience-story");
    let frame = 0;
    let stickyTop = 0;
    let range = 1;
    let distance = 0;

    const measure = () => {
      const viewport = document.documentElement.clientWidth;
      if (sticky) {
        const nextWidth = `${viewport}px`;
        const targetMargin = -pin.getBoundingClientRect().left;
        const currentMargin = Number.parseFloat(sticky.style.marginLeft);
        if (sticky.style.width !== nextWidth) {
          sticky.style.width = nextWidth;
        }
        if (!Number.isFinite(currentMargin) || Math.abs(currentMargin - targetMargin) > 0.5) {
          sticky.style.marginLeft = `${targetMargin}px`;
        }
      }
      stickyTop = sticky ? Number.parseFloat(getComputedStyle(sticky).top) || 0 : 0;
      range = Math.max(1, pin.offsetHeight - (window.innerHeight - stickyTop));
      const slideWidth = sticky?.clientWidth ?? viewport;
      distance = slideWidth * Math.max(0, slideCount - 1);
    };

    const onResize = () => {
      measure();
      requestApply();
    };

    const apply = () => {
      frame = 0;
      const scrolled = stickyTop - pin.getBoundingClientRect().top;
      const progress = Math.min(1, Math.max(0, scrolled / range));
      transformRef.current = `translate3d(${-progress * distance}px,0,0)`;
      track.style.transform = transformRef.current;

      if (!stackShownRef.current && slideCount > 1 && progress >= (slideCount - 1.2) / (slideCount - 1)) {
        stackShownRef.current = true;
        setStackShown(true);
      }
    };

    const requestApply = () => {
      if (frame) {
        return;
      }
      frame = requestAnimationFrame(apply);
    };

    measure();
    apply();

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(pin);

    window.addEventListener("scroll", requestApply, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", requestApply);
      window.removeEventListener("resize", onResize);
      track.style.transform = "";
      if (sticky) {
        sticky.style.width = "";
        sticky.style.marginLeft = "";
      }
    };
  }, [stackEnabled, slideCount]);

  useLayoutEffect(() => {
    if (!stackEnabled || !trackRef.current) {
      return;
    }
    trackRef.current.style.transform = transformRef.current;
  });

  const pinHeightVh = stackEnabled ? slideCount * PIN_STEP_VH : undefined;

  return (
    <div
      ref={pinRef}
      className={`experience-story-pin${stackEnabled ? " experience-story-pin--active" : ""}`}
      style={
        {
          "--story-slides": String(slideCount),
          ...(pinHeightVh != null ? { "--story-pin-height": `${pinHeightVh}svh` } : {}),
        } as CSSProperties
      }
    >
      <div
        className={`experience-story${stackEnabled ? " experience-story--pinned" : " experience-story--static"}`}
      >
        <div ref={trackRef} className="experience-story__track">
          <section className="experience-story__slide experience-story__slide--title">
            <StoryHeading />
          </section>

          {sectors.map((group) => (
            <section
              key={group.sector}
              className={`experience-story__slide experience-story__slide--sector experience-story__slide--${group.sector}`}
            >
              <SectorChapter sector={group.sector} label={group.label} items={group.items} />
            </section>
          ))}

          <section className="experience-story__slide experience-story__slide--stack">
            <ExperienceDailyStack appear={!stackEnabled || stackShown} />
          </section>
        </div>
      </div>
    </div>
  );
}
