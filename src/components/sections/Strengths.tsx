import { StrengthsScroll } from "./StrengthsScroll";
import { about, strengths } from "../../data/site";

export function Strengths() {
  return (
    <section id="sobre-mi" className="section-light section-bg-strengths py-16 sm:py-24">
      <StrengthsScroll
        items={strengths}
        eyebrow="Cómo trabajo"
        title="Menos postureo. Más casuísticas."
        about={about}
      />
    </section>
  );
}
