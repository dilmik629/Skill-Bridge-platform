import { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import useToast from '../../hooks/useToast.jsx'
import authService from '../../services/authService'
import { ROUTES } from '../../utils/constants'
import './auth.css'

const EmailVerification = () => {
  const [searchParams]      = useSearchParams()
  const token               = searchParams.get('token')
  const [status, setStatus] = useState(token ? 'verifying' : 'pending')
  const [resending, setResending] = useState(false)
  const { success, error }  = useToast()
  const navigate            = useNavigate()
  const { isAuthenticated, updateUser } = useAuth()

  // Same browser/session that registered (still logged in) → straight to the
  // dashboard. Verified from a different device/browser (e.g. opened the
  // link from their phone's mail app) → send them to sign in.
  const destination = isAuthenticated ? ROUTES.STUDENT_DASHBOARD : ROUTES.LOGIN

  useEffect(() => {
    if (!token) return
    const verify = async () => {
      try {
        await authService.verifyEmail(token)
        setStatus('success')
        success('Email verified! 🎉')
        if (isAuthenticated) updateUser({ email_verified_at: new Date().toISOString() })
        setTimeout(() => navigate(destination), 2500)
      } catch {
        setStatus('failed')
        error('Verification failed. Link may have expired.')
      }
    }
    verify()
  }, [token])

  const handleResend = async () => {
    setResending(true)
    try {
      // POST /api/auth/resend-verification
      await authService.resendVerification()
      success('Verification email sent! 📧')
      setStatus('pending')
    } catch (err) {
      error(err.response?.data?.message || 'Could not resend. Try again.')
    } finally { setResending(false) }
  }

  const STATES = {
    pending: {
      icon: '📧', pulse: true,
      title: 'Verify your email',
      desc:  'We sent a verification link to your email. Click it to activate your account.',
    },
    verifying: {
      icon: '⏳', pulse: true,
      title: 'Verifying...',
      desc:  'Please wait while we verify your email address.',
    },
    success: {
      icon: '✅', pulse: false,
      title: 'Email verified!',
      desc:  isAuthenticated
        ? 'Your account is now active. Taking you to your dashboard...'
        : 'Your account is now active. Redirecting you to sign in...',
    },
    failed: {
      icon: '❌', pulse: false,
      title: 'Verification failed',
      desc:  'The link may have expired or already been used. Request a new one below.',
    },
  }

  const current = STATES[status]

  return (
    <div className="auth-card--narrow animate-scaleIn">

      {/* Logo */}
      <div className="auth-form__logo">
        <div className="auth-form__logo-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
          </svg>
        </div>
        <span className="auth-form__logo-text">Skill<span>Bridge</span></span>
      </div>

      <div className="auth-verify">
        <div className={`auth-verify__icon ${current.pulse ? 'animate-pulse' : 'animate-heartbeat'}`}
          style={{ fontSize:'4rem' }}>
          {current.icon}
        </div>

        <div style={{ textAlign:'center' }}>
          <h2 className="auth-form__title">{current.title}</h2>
          <p className="auth-form__subtitle" style={{ marginTop:'var(--space-2)' }}>{current.desc}</p>
        </div>

        <div className="auth-verify__actions">
          {status === 'success' && (
            <Link to={destination} className="btn btn-primary btn-full btn-lg">
              {isAuthenticated ? '🚀 Go to Dashboard' : '🔓 Go to Sign In'}
            </Link>
          )}

          {status === 'failed' && (
            <>
              <button className="btn btn-primary btn-full btn-lg" onClick={handleResend} disabled={resending}>
                {resending ? 'Sending...' : '📧 Resend Verification Email'}
              </button>
              <Link to={ROUTES.LOGIN} className="btn btn-ghost btn-full">← Back to Sign In</Link>
            </>
          )}

          {status === 'pending' && (
            <>
              <div className="auth-verify__tip">
                <span>💡</span>
                <p>Can't find the email? Check your spam folder.</p>
              </div>
              <button className="btn btn-secondary btn-full" onClick={handleResend} disabled={resending}>
                {resending ? 'Sending...' : '📨 Resend Email'}
              </button>
              <Link to={ROUTES.LOGIN} className="btn btn-ghost btn-full">← Back to Sign In</Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default EmailVerification