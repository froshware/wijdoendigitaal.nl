import { Link } from 'react-router-dom'
import './Pages.css'

export default function About() {
  return (
    <div className="page">
      <header className="page-header">
        <p className="eyebrow">Over ons</p>
        <h1 className="page-header__title">Digitale ambities, nuchter uitgevoerd</h1>
        <p className="page-header__lead">
          Wij zijn een compact team van ontwerpers en ontwikkelaars. We combineren
          vakmanschap met een pragmatische aanpak: eerst begrijpen, dan bouwen.
        </p>
      </header>

      <section className="section section--narrow" aria-labelledby="waarden-heading">
        <h2 id="waarden-heading" className="section__title">
          Waarden
        </h2>
        <ul className="values">
          <li>
            <strong>Kwaliteit boven buzzwords</strong> — We kiezen technologie die past bij
            uw vraag, niet bij de laatste hype.
          </li>
          <li>
            <strong>Toegankelijkheid en ethiek</strong> — Inclusieve interfaces en zorgvuldig
            omgaan met data horen bij goed vakmanschap.
          </li>
          <li>
            <strong>Partnerschap</strong> — We werken het liefst langdurig samen: kennis van
            uw domein maakt elk volgend project scherper.
          </li>
        </ul>
      </section>

      <section
        className="section section--certs"
        aria-labelledby="certs-heading"
      >
        <h2 id="certs-heading" className="section__title">
          Gecertificeerd op Azure en AWS
        </h2>
        <p className="certs__intro">
          Onze professionals beschikken over officiële cloudcertificeringen voor{' '}
          <strong>Microsoft Azure</strong> en <strong>Amazon Web Services (AWS)</strong>.
          Zo sluiten architectuur, beveiliging en beheer netjes aan op de richtlijnen en
          best practices van beide platformen — zodat uw omgeving betrouwbaar schaalt en
          compliance en audits overzichtelijker blijven.
        </p>
        <ul className="certs-grid">
          <li className="cert-card cert-card--azure">
            <p className="cert-card__provider" aria-hidden>
              Microsoft
            </p>
            <h3 className="cert-card__title">Azure</h3>
            <p className="cert-card__text">
              Erkende certificeringen voor het ontwerpen, uitrollen en beheren van
              workloads op Azure, inclusief netwerk, identiteit en kostenbeheersing.
            </p>
          </li>
          <li className="cert-card cert-card--aws">
            <p className="cert-card__provider cert-card__provider--aws" aria-hidden>
              Amazon
            </p>
            <h3 className="cert-card__title">AWS</h3>
            <p className="cert-card__text">
              Erkende certificeringen voor veilige, schaalbare oplossingen op AWS —
              van fundamenteel cloudgebruik tot geavanceerde services en operations.
            </p>
          </li>
        </ul>
      </section>

      <section className="section section--cta">
        <div className="cta-panel cta-panel--muted">
          <h2 className="cta-panel__title">Nieuwsgierig of we bij elkaar passen?</h2>
          <p className="cta-panel__text">
            Een kennismaking verplicht tot niets — wel tot duidelijkheid.
          </p>
          <Link to="/contact" className="btn btn--primary btn--on-dark">
            Maak een afspraak
          </Link>
        </div>
      </section>
    </div>
  )
}
