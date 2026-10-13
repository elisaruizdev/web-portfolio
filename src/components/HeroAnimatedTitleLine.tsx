import type { CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { hero } from "../data/site";
import { BRAND_PALETTE } from "../utils/landingPalette";

const LETTER_HOVER_COLORS = [
  BRAND_PALETTE[0],
  BRAND_PALETTE[1],
  BRAND_PALETTE[2],
  BRAND_PALETTE[9],
  BRAND_PALETTE[3],
  BRAND_PALETTE[7],
  BRAND_PALETTE[8],
  BRAND_PALETTE[4],
  BRAND_PALETTE[0],
  BRAND_PALETTE[6],
  BRAND_PALETTE[9],
  BRAND_PALETTE[5],
] as const;

const accentWordVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 360, damping: 26 },
  },
};

function InteractiveLine1() {
  let letterIndex = 0;

  return (
    <span className="hero-speech__title-line hero-speech__title-line1">
      {hero.titleLine1.split("").map((char, index) => {
        if (char === " ") {
          return (
            <span key={`space-${index}`} className="hero-speech__char-space" aria-hidden>
              {" "}
            </span>
          );
        }

        const hoverColor = LETTER_HOVER_COLORS[letterIndex % LETTER_HOVER_COLORS.length];
        letterIndex += 1;

        return (
          <span
            key={`char-${index}`}
            className="hero-speech__char"
            style={{ "--hero-char-hover": hoverColor } as CSSProperties}
          >
            {char}
          </span>
        );
      })}
    </span>
  );
}

export function HeroAnimatedTitleLine() {
  const reduceMotion = useReducedMotion();

  const accentWord = (
    <span className="hero-speech__word hero-speech__word--accent">{hero.titleLine4}</span>
  );

  return (
    <h1
      className="hero-speech__title"
      aria-label={`${hero.titleLine1}. ${hero.titleLine2} ${hero.titleLine3} ${hero.titleLine4}`}
    >
      <InteractiveLine1 />
      <span className="hero-speech__title-line hero-speech__title-line--ink">{hero.titleLine2}</span>
      <span className="hero-speech__title-line hero-speech__title-line--ink">{hero.titleLine3}</span>
      <span className="hero-speech__title-line hero-speech__title-line--ink">
        {reduceMotion ? (
          accentWord
        ) : (
          <span className="hero-speech__word-slot">
            <motion.span
              className="hero-speech__word hero-speech__word--accent"
              variants={accentWordVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.35 }}
            >
              {hero.titleLine4}
            </motion.span>
          </span>
        )}
      </span>
    </h1>
  );
}
