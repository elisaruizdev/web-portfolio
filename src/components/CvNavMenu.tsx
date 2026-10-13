import { useEffect, useId, useRef, useState } from "react";

import { cvDownloads } from "../data/site";

const items = [
  { key: "design" as const, ...cvDownloads.design },
  { key: "ats" as const, ...cvDownloads.ats },
];

export function CvNavMenu() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="cv-nav-menu relative">
      <button
        type="button"
        className={`rounded-md px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-semibold transition-colors inline-flex items-center gap-1 ${
          open ? "text-ink" : "text-muted hover:text-ink"
        }`}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      >
        Descargar CV
        <span className="text-[0.65rem] leading-none opacity-80" aria-hidden>
          ▾
        </span>
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 top-full z-50 mt-1 min-w-[11rem] rounded-md border border-border bg-white py-1 shadow-lg"
        >
          {items.map((item) => (
            <a
              key={item.key}
              role="menuitem"
              href={item.href}
              download={item.fileName}
              className="block px-3 py-2 text-xs sm:text-sm font-semibold text-ink no-underline hover:bg-black/5 hover:no-underline"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}
