import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../utils/constants'

const ServerError = ({ message }) => {
  const navigate = useNavigate()

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

        <div style={{
          fontSize: 'clamp(6rem, 20vw, 10rem)',
          fontWeight: 900,
          lineHeight: 1,
          letterSpacing: '-.04em',
          background: 'linear-gradient(135deg, #EF4444, #F97316)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: 'var(--space-4)',
          animation: 'fadeInDown .6s ease both',
        }}>
          500
        </div>

        <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)', animation: 'fadeInUp .5s ease .1s both' }}>
          🔧
        </div>

        <h1 style={{
          fontSize: 'var(--text-2xl)',
          fontWeight: 'var(--font-bold)',
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--space-3)',
          animation: 'fadeInUp .5s ease .15s both',
        }}>
          Something went wrong
        </h1>

        <p style={{
          fontSize: 'var(--text-base)',
          color: 'var(--color-text-muted)',
          lineHeight: 'var(--leading-relaxed)',
          marginBottom: 'var(--space-4)',
          animation: 'fadeInUp .5s ease .2s both',
        }}>
          We're sorry — our server ran into an unexpected error. Our team has been notified and we're working to fix it.
        </p>

        {message && (
          <div style={{
            background: 'var(--color-error-bg)',
            border: '1px solid rgba(239,68,68,.2)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-3)',
            marginBottom: 'var(--space-6)',
            fontSize: 'var(--text-xs)',
            color: 'var(--color-error)',
            fontFamily: 'monospace',
            textAlign: 'left',
            wordBreak: 'break-word',
            animation: 'fadeInUp .5s ease .22s both',
          }}>
            {message}
          </div>
        )}

        <div style={{
          display: 'flex',
          gap: 'var(--space-3)',
          justifyContent: 'center',
          flexWrap: 'wrap',
          animation: 'fadeInUp .5s ease .25s both',
        }}>
          <button
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            🔄 Try Again
          </button>
          <button
            className="btn btn-ghost"
            onClick={() => navigate(-1)}
          >
            ← Go Back
          </button>
          <Link to={ROUTES.HOME} className="btn btn-secondary">
            🏠 Go Home
          </Link>
        </div>

        <p style={{
          marginTop: 'var(--space-8)',
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-muted)',
          animation: 'fadeInUp .5s ease .3s both',
        }}>
          If this problem persists, contact{' '}
          <a href="mailto:support@skillbridge.com" style={{ color: 'var(--color-primary)' }}>
            support@skillbridge.com
          </a>
        </p>
      </div>
    </div>
  )
}

export default ServerError