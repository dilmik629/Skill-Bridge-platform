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
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span>Skill<b>Bridge</b></span>
          </Link>
          <p className="footer__tagline">
            Build real projects, prove your skills with quizzes, and grow a portfolio employers actually notice.
          </p>
          <div className="footer__contact">
            <a href="mailto:hello@skillbridge.dev">✉️ hello@skillbridge.dev</a>
            <span>📍 Colombo, Sri Lanka</span>
          </div>
          <div className="footer__social">
            <a href="#" className="footer__social-link" aria-label="GitHub">🐙</a>
            <a href="#" className="footer__social-link" aria-label="LinkedIn">in</a>
            <a href="#" className="footer__social-link" aria-label="Twitter / X">𝕏</a>
            <a href="mailto:hello@skillbridge.dev" className="footer__social-link" aria-label="Email">✉️</a>
          </div>
        </div>

        {/* Links */}
        <div className="footer__links">
          <div className="footer__col">
            <h4 className="footer__col-title">Platform</h4>
            <Link to={ROUTES.PROJECTS}    className="footer__link">Browse Projects</Link>
            <Link to={ROUTES.COMMUNITY}   className="footer__link">Community</Link>
            <Link to={ROUTES.LEADERBOARD} className="footer__link">Leaderboard</Link>
            <Link to={ROUTES.REGISTER}    className="footer__link">Get Started</Link>
          </div>
          <div className="footer__col">
            <h4 className="footer__col-title">Account</h4>
            <Link to={ROUTES.LOGIN}       className="footer__link">Login</Link>
            <Link to={ROUTES.REGISTER}    className="footer__link">Register</Link>
            <Link to={ROUTES.PROFILE}     className="footer__link">My Profile</Link>
            <Link to={ROUTES.PORTFOLIO}   className="footer__link">My Portfolio</Link>
          </div>
          <div className="footer__col">
            <h4 className="footer__col-title">Company</h4>
            <a href="#" className="footer__link">About Us</a>
            <a href="#" className="footer__link">Blog</a>
            <a href="#" className="footer__link">Careers</a>
            <a href="mailto:hello@skillbridge.dev" className="footer__link">Contact</a>
          </div>
          <div className="footer__col">
            <h4 className="footer__col-title">Resources</h4>
            <a href="#" className="footer__link">Help Center</a>
            <a href="#" className="footer__link">FAQ</a>
            <a href="#" className="footer__link">Guidelines</a>
            <a href="#" className="footer__link">Sitemap</a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p>© {new Date().getFullYear()} SkillBridge. All rights reserved.</p>
          <div className="footer__legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer