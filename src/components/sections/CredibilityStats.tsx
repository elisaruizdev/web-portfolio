import { credibilityStats } from "../../data/site";



export function CredibilityStats() {

  return (

    <section className="stats-strip" aria-label="Datos destacados">

      <div className="stats-strip__grid">

        {credibilityStats.map((stat) => (
          <div key={stat.label} className="stats-strip__item">

            <span className="stats-strip__value">{stat.value}</span>

            <span className="stats-strip__label">{stat.label}</span>

          </div>

        ))}

      </div>

    </section>

  );

}

