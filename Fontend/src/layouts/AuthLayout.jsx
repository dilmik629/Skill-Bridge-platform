/* ============================================
   SKILL-BRIDGE — AuthLayout
   Login / Register / ForgotPassword pages
   Navbar + Footer නෑ — just centered card
   ============================================ */

import { Outlet, Link } from 'react-router-dom'
import '../styles/components/authlayout.css'

const AuthLayout = () => {
  return (
    <div className="auth-layout">

      {/* Background decorative blobs */}
      <div className="auth-layout__blob auth-layout__blob--1" aria-hidden="true" />
      <div className="auth-layout__blob auth-layout__blob--2" aria-hidden="true" />

      {/* Top logo bar */}
      <header className="auth-layout__header">
        <Link to="/" className="auth-layout__logo">
          <div className="auth-layout__logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <span className="auth-layout__logo-text">Skill<span>Bridge</span></span>
        </Link>
      </header>

      {/* Main content — page injects here */}
      <main className="auth-layout__main">
        <Outlet />
      </main>

      {/* Footer note */}
      <footer className="auth-layout__footer">
        <p>© {new Date().getFullYear()} SkillBridge. All rights reserved.</p>
      </footer>

    </div>
  )
}

export default AuthLayout