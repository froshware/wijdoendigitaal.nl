import { Link } from 'react-router-dom'
import './Pages.css'

export default function Home() {
  return (
    <div className="page">
      <section className="hero">
        <p className="eyebrow">Digitale diensten</p>
        <h1 className="hero__title">
          Ideeën omzetten in <span className="gradient-text">werkende digitale oplossingen</span>
        </h1>
        <p className="hero__lead">
          Van eerste schets tot launch: wij ontwerpen, bouwen en begeleiden uw digitale
          producten — helder, veilig en klaar om te groeien.
        </p>
        <div className="hero__actions">
          <Link to="/diensten" className="btn btn--primary">
            Bekijk diensten
          </Link>
          <Link to="/contact" className="btn btn--ghost">
            Plan een gesprek
          </Link>
        </div>
      </section>

      <section className="section" aria-labelledby="waarom-heading">
        <h2 id="waarom-heading" className="section__title">
          Waarom met ons samenwerken
        </h2>
        <ul className="grid-3">
          <li className="card">
            <h3 className="card__title">Meedenken, niet alleen bouwen</h3>
            <p className="card__text">
              We koppelen techniek aan uw doelen: sneller uitrollen, minder frictie voor
              gebruikers, meetbare verbetering.
            </p>
          </li>
          <li className="card">
            <h3 className="card__title">Modern stack, solide basis</h3>
            <p className="card__text">
              Toegankelijke interfaces, performance en onderhoudbaarheid staan centraal —
              zodat uw site of app jaren mee kan.
            </p>
          </li>
          <li className="card">
            <h3 className="card__title">Transparante samenwerking</h3>
            <p className="card__text">
              Duidelijke mijlpalen, korte lijnen en eerlijke verwachtingen over scope,
              tijd en resultaat.
            </p>
          </li>
        </ul>
      </section>

      <section className="section section--cta" aria-labelledby="cta-heading">
        <div className="cta-panel">
          <h2 id="cta-heading" className="cta-panel__title">
            Klaar om het digitale stuk te versnellen?
          </h2>
          <p className="cta-panel__text">
            Vertel kort waar u naartoe wilt — we denken graag mee over de beste route.
          </p>
          <Link to="/contact" className="btn btn--primary btn--on-dark">
            Neem contact op
          </Link>
        </div>
      </section>
    </div>
  )
}
