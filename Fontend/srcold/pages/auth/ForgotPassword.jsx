import { useState } from 'react'
import { Link } from 'react-router-dom'
import useForm from '../../hooks/useForm'
import useToast from '../../hooks/useToast.jsx'
import InputField from '../../components/forms/InputField'
import authService from '../../services/authService'
import { forgotPasswordRules } from '../../utils/validators'
import { ROUTES } from '../../utils/constants'
import './auth.css'

const ForgotPassword = () => {
  const [sent, setSent]    = useState(false)
  const { success, error } = useToast()

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } = useForm({
    initialValues: { email: '' },
    rules: forgotPasswordRules,
    onSubmit: async (vals) => {
      try {
        await authService.forgotPassword(vals.email)
        setSent(true)
        success('Reset link sent! 📧')
      } catch (err) {
        error(err.response?.data?.message || 'Could not send reset link. Try again.')
      }
    },
  })

  return (
    <div className="auth-card--narrow animate-scaleIn">
      {sent ? (
        <div className="auth-sent">
          <div style={{ fontSize:'4rem', animation:'heartbeat .5s ease' }}>📬</div>
          <h2 className="auth-form__title">Check your inbox!</h2>
          <p className="auth-form__subtitle">
            We sent a reset link to <strong>{values.email}</strong>.<br />
            It expires in <strong>30 minutes</strong>.
          </p>
          <div className="auth-sent__actions">
            <Link to={ROUTES.LOGIN} className="btn btn-primary btn-full btn-lg">🔓 Back to Sign In</Link>
            <button className="btn btn-ghost btn-full" onClick={() => setSent(false)}>📧 Send again</button>
          </div>
        </div>
      ) : (
        <>
          <div className="auth-form__logo">
            <div className="auth-form__logo-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className="auth-form__logo-text">Skill<span>Bridge</span></span>
          </div>

          <div className="auth-form__header animate-fadeInDown">
            <span className="auth-form__header-icon">🔐</span>
            <h2 className="auth-form__title">Forgot password?</h2>
            <p className="auth-form__subtitle">Enter your email and we'll send a reset link.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="auth-form animate-fadeInUp">
            <InputField
              label="📧 Email Address" name="email" type="email"
              value={values.email} error={errors.email} touched={touched.email}
              onChange={handleChange} onBlur={handleBlur}
              placeholder="you@example.com" required
            />
            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={isSubmitting}>
              {isSubmitting ? <><span className="btn-spinner" /> Sending...</> : '📨 Send Reset Link'}
            </button>
            <div className="divider-text">or</div>
            <Link to={ROUTES.LOGIN} className="btn btn-secondary btn-full">← Back to Sign In</Link>
          </form>
        </>
      )}
    </div>
  )
}

export default ForgotPassword