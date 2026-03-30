import { useState, type FormEvent } from 'react'
import './Pages.css'

export default function Contact() {
  const [sent, setSent] = useState(false)

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="page">
      <header className="page-header">
        <p className="eyebrow">Contact</p>
        <h1 className="page-header__title">Laten we kennismaken</h1>
        <p className="page-header__lead">
          Vul het formulier in — we lezen alles zelf en reageren binnen enkele werkdagen.
          Liever direct mailen? Gebruik dan{' '}
          <a className="inline-link" href="mailto:hello@wijdoendigitaal.nl">
            hello@wijdoendigitaal.nl
          </a>
          .
        </p>
      </header>

      <section className="section section--form" aria-label="Contactformulier">
        {sent ? (
          <div className="card card--success" role="status">
            <h2 className="card__title">Bedankt!</h2>
            <p className="card__text">
              Uw bericht is lokaal verwerkt (demo). Koppel dit formulier in productie aan uw
              e-mail, CRM of server endpoint.
            </p>
          </div>
        ) : (
          <form className="contact-form" onSubmit={onSubmit} noValidate>
            <div className="field">
              <label htmlFor="name">Naam</label>
              <input id="name" name="name" type="text" autoComplete="name" required />
            </div>
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input id="email" name="email" type="email" autoComplete="email" required />
            </div>
            <div className="field">
              <label htmlFor="org">Organisatie (optioneel)</label>
              <input id="org" name="org" type="text" autoComplete="organization" />
            </div>
            <div className="field">
              <label htmlFor="message">Waar kunnen we mee helpen?</label>
              <textarea id="message" name="message" rows={5} required />
            </div>
            <button type="submit" className="btn btn--primary btn--wide">
              Verstuur
            </button>
          </form>
        )}
      </section>
    </div>
  )
}
