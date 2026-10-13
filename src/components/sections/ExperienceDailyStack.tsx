import type { CSSProperties } from "react";

import { skills } from "../../data/site";

type ExperienceDailyStackProps = {
  appear?: boolean;
};

export function ExperienceDailyStack({ appear = true }: ExperienceDailyStackProps) {
  return (
    <div className={`experience-daily-stack${appear ? " experience-daily-stack--appear" : ""}`}>
      <div className="experience-daily-stack__inner">
        <h3 className="display-band-title experience-daily-stack__title">
          <span className="experience-daily-stack__title-line">Stack del</span>
          <span className="experience-daily-stack__title-line">día a día</span>
        </h3>

        <ul className="chip-row">
          {skills.map((skill, index) => (
            <li
              key={skill}
              className="chip experience-daily-stack__chip"
              style={{ "--chip-i": index } as CSSProperties}
            >
              {skill}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
