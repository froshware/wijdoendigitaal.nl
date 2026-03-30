import { NavLink, Outlet } from 'react-router-dom'
import './Layout.css'

const navLink = ({ isActive }: { isActive: boolean }) =>
  'nav-link' + (isActive ? ' nav-link--active' : '')

export default function Layout() {
  return (
    <>
      <header className="site-header">
        <div className="site-header__inner">
          <NavLink to="/" className="brand" end>
            <span className="brand__mark" aria-hidden />
            <span className="brand__text">
              Wij doen <em>digitaal</em>
            </span>
          </NavLink>
          <nav className="site-nav" aria-label="Hoofdmenu">
            <NavLink to="/" className={navLink} end>
              Home
            </NavLink>
            <NavLink to="/diensten" className={navLink}>
              Diensten
            </NavLink>
            <NavLink to="/over-ons" className={navLink}>
              Over ons
            </NavLink>
            <NavLink to="/contact" className={navLink}>
              Contact
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="site-main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="site-footer__inner">
          <p className="site-footer__brand">Wij doen digitaal</p>
          <p className="site-footer__meta">
            Websites, platforms en digitale processen — met zorg gebouwd.
          </p>
          <p className="site-footer__legal">© {new Date().getFullYear()}</p>
        </div>
      </footer>
    </>
  )
}
