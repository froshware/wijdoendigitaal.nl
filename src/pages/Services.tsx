import { Link } from 'react-router-dom'
import './Pages.css'

const services = [
  {
    title: 'Websites & webapps',
    description:
      'Vlotte marketing sites, portals en SPA’s. UX, contentstructuur en technische snelheid in één lijn.',
  },
  {
    title: 'Maatwerk & integraties',
    description:
      'Koppelingen met CRM, betalingen, identity en interne systemen — veilig en goed documenteerd.',
  },
  {
    title: 'Cloud & DevOps',
    description:
      'Deploy pipelines, observability en omgevingen die voorspelbaar uitrollen en terug te draaien zijn.',
  },
  {
    title: 'Strategie & optimalisatie',
    description:
      'Inventarisatie, roadmap en verbeterslagen op bestaande producten: minder complexiteit, meer impact.',
  },
  {
    title: 'Onderhoud & support',
    description:
      'Updates, monitoring en gerichte verbeteringen zodat uw digitale diensten betrouwbaar blijven.',
  },
  {
    title: 'Training & overdracht',
    description:
      'Uw team meenemen in architectuur en werkwijze, zodat kennis in de organisatie blijft.',
  },
] as const

export default function Services() {
  return (
    <div className="page">
      <header className="page-header">
        <p className="eyebrow">Diensten</p>
        <h1 className="page-header__title">Wat we voor u kunnen doen</h1>
        <p className="page-header__lead">
          Eén partner voor ontwerp, realisatie en doorontwikkeling — afgestemd op uw
          tempo en budget.
        </p>
      </header>

      <section className="section" aria-label="Dienstenoverzicht">
        <ul className="grid-services">
          {services.map((s) => (
            <li key={s.title} className="card card--service">
              <h2 className="card__title">{s.title}</h2>
              <p className="card__text">{s.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="section section--narrow">
        <div className="prose">
          <h2>Werkwijze</h2>
          <p>
            We starten met een korte intake: wat moet het opleveren, voor wie, en welke
            randvoorwaarden gelden? Daarna stellen we samen de eerste mijlpaal vast — vaak
            een concreet ontwerp of werkend onderdeel — zodat u vroeg zicht heeft op koers
            en kwaliteit.
          </p>
          <p>
            Vervolgens bouwen we iteratief: opleveren, testen, bijsturen. Zo blijft grip op
            scope en planning behouden, zonder creativiteit te smoren.
          </p>
        </div>
        <p className="section__actions">
          <Link to="/contact" className="btn btn--primary">
            Vraag een voorstel aan
          </Link>
        </p>
      </section>
    </div>
  )
}
