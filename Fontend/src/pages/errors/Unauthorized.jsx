import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../utils/constants'

const Unauthorized = () => {
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
          background: 'linear-gradient(135deg, #F59E0B, #EF4444)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: 'var(--space-4)',
          animation: 'fadeInDown .6s ease both',
        }}>
          403
        </div>

        <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)', animation: 'fadeInUp .5s ease .1s both' }}>
          🔒
        </div>

        <h1 style={{
          fontSize: 'var(--text-2xl)',
          fontWeight: 'var(--font-bold)',
          marginBottom: 'var(--space-3)',
          animation: 'fadeInUp .5s ease .15s both',
        }}>
          Access Denied
        </h1>

        <p style={{
          fontSize: 'var(--text-base)',
          color: 'var(--color-text-muted)',
          lineHeight: 'var(--leading-relaxed)',
          marginBottom: 'var(--space-8)',
          animation: 'fadeInUp .5s ease .2s both',
        }}>
          You don't have permission to view this page. Please sign in with the correct account or contact an administrator.
        </p>

        <div style={{
          display: 'flex',
          gap: 'var(--space-3)',
          justifyContent: 'center',
          flexWrap: 'wrap',
          animation: 'fadeInUp .5s ease .25s both',
        }}>
          <button className="btn btn-ghost" onClick={() => navigate(-1)}>← Go Back</button>
          <Link to={ROUTES.LOGIN}   className="btn btn-primary">🔓 Sign In</Link>
          <Link to={ROUTES.HOME}    className="btn btn-secondary">🏠 Home</Link>
        </div>
      </div>
    </div>
  )
}

export default Unauthorized