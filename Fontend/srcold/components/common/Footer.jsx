/* ============================================
   SKILL-BRIDGE — Footer Component
   ============================================ */

import { Link } from 'react-router-dom'
import { ROUTES } from '../../utils/constants'
import '../../styles/components/footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer__inner">

        {/* Brand */}
        <div className="footer__brand">
          <Link to={ROUTES.HOME} className="footer__logo">
            <div className="footer__logo-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span>Skill<b>Bridge</b></span>
          </Link>
          <p className="footer__tagline">
            Build real projects. Earn real skills.
          </p>
        </div>

        {/* Links */}
        <div className="footer__links">
          <div className="footer__col">
            <h4 className="footer__col-title">Platform</h4>
            <Link to={ROUTES.PROJECTS}  className="footer__link">Browse Projects</Link>
            <Link to={ROUTES.LEADERBOARD} className="footer__link">Leaderboard</Link>
            <Link to={ROUTES.REGISTER}  className="footer__link">Get Started</Link>
          </div>
          <div className="footer__col">
            <h4 className="footer__col-title">Account</h4>
            <Link to={ROUTES.LOGIN}     className="footer__link">Login</Link>
            <Link to={ROUTES.REGISTER}  className="footer__link">Register</Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer__bottom">
        <div className="container">
          <p>© {new Date().getFullYear()} SkillBridge. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer