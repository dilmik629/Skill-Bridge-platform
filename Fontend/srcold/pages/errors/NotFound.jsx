import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../utils/constants'
import useAuth from '../../hooks/useAuth'

const NotFound = () => {
  const navigate = useNavigate()
  const { isAuthenticated, isAdmin } = useAuth()

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-bg)',
      padding: 'var(--space-8)',
    }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>

        {/* Animated 404 */}
        <div style={{
          fontSize: 'clamp(6rem, 20vw, 10rem)',
          fontWeight: 900,
          lineHeight: 1,
          letterSpacing: '-.04em',
          background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: 'var(--space-4)',
          animation: 'fadeInDown .6s ease both',
        }}>
          404
        </div>

        <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)', animation: 'fadeInUp .6s ease .1s both' }}>
          🗺️
        </div>

        <h1 style={{
          fontSize: 'var(--text-2xl)',
          fontWeight: 'var(--font-bold)',
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--space-3)',
          animation: 'fadeInUp .5s ease .15s both',
        }}>
          Page not found
        </h1>

        <p style={{
          fontSize: 'var(--text-base)',
          color: 'var(--color-text-muted)',
          lineHeight: 'var(--leading-relaxed)',
          marginBottom: 'var(--space-8)',
          animation: 'fadeInUp .5s ease .2s both',
        }}>
          Oops! The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>

        <div style={{
          display: 'flex',
          gap: 'var(--space-3)',
          justifyContent: 'center',
          flexWrap: 'wrap',
          animation: 'fadeInUp .5s ease .25s both',
        }}>
          <button
            className="btn btn-ghost"
            onClick={() => navigate(-1)}
          >
            ← Go Back
          </button>

          <Link
            to={isAdmin ? ROUTES.ADMIN_DASHBOARD : isAuthenticated ? ROUTES.STUDENT_DASHBOARD : ROUTES.HOME}
            className="btn btn-primary"
          >
            🏠 Go Home
          </Link>

          <Link to={ROUTES.PROJECTS} className="btn btn-secondary">
            🔍 Browse Projects
          </Link>
        </div>

        {/* Quick links */}
        <div style={{
          marginTop: 'var(--space-10)',
          padding: 'var(--space-5)',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          animation: 'fadeInUp .5s ease .3s both',
        }}>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-3)' }}>
            Popular pages:
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { to: ROUTES.HOME,        label: '🏠 Home'        },
              { to: ROUTES.PROJECTS,    label: '📁 Projects'    },
              { to: ROUTES.COMMUNITY,   label: '🌟 Community'   },
              { to: ROUTES.LEADERBOARD, label: '🏆 Leaderboard' },
              { to: ROUTES.LOGIN,       label: '🔓 Login'       },
            ].map((l, i) => (
              <Link
                key={i}
                to={l.to}
                style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-primary)',
                  textDecoration: 'none',
                  fontWeight: 'var(--font-semibold)',
                  padding: '4px 12px',
                  background: 'var(--color-primary-bg)',
                  borderRadius: 'var(--radius-full)',
                  transition: 'all .2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--color-primary)' || (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-primary-bg)'; e.currentTarget.style.color = 'var(--color-primary)' }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound