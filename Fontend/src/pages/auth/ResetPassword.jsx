import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import useForm from '../../hooks/useForm'
import useToast from '../../hooks/useToast.jsx'
import InputField from '../../components/forms/InputField'
import authService from '../../services/authService'
import { resetPasswordRules } from '../../utils/validators'
import { ROUTES } from '../../utils/constants'
import './auth.css'

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const email = searchParams.get('email')
  const navigate = useNavigate()
  const { success, error } = useToast()
  const [done, setDone] = useState(false)

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } = useForm({
    initialValues: { password: '', confirmPassword: '' },
    rules: resetPasswordRules,
    onSubmit: async (vals) => {
      try {
        await authService.resetPassword({
          token,
          email,
          password: vals.password,
          password_confirmation: vals.confirmPassword,
        })
        setDone(true)
        success('Password reset successfully! 🎉')
        setTimeout(() => navigate(ROUTES.LOGIN), 2000)
      } catch (err) {
        error(err.response?.data?.message || 'Reset link is invalid or expired.')
      }
    },
  })

  if (!token || !email) {
    return (
      <div className="auth-card--narrow animate-scaleIn">
        <div className="auth-form__header">
          <span className="auth-form__header-icon">⚠️</span>
          <h2 className="auth-form__title">Invalid Link</h2>
          <p className="auth-form__subtitle">This reset link is missing required info. Request a new one.</p>
        </div>
        <Link to={ROUTES.FORGOT_PASSWORD} className="btn btn-primary btn-full btn-lg">🔐 Request New Link</Link>
      </div>
    )
  }

  return (
    <div className="auth-card--narrow animate-scaleIn">
      <div className="auth-form__logo">
        <div className="auth-form__logo-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
          </svg>
        </div>
        <span className="auth-form__logo-text">Skill<span>Bridge</span></span>
      </div>

      {done ? (
        <div className="auth-sent">
          <div style={{ fontSize:'4rem', animation:'heartbeat .5s ease' }}>✅</div>
          <h2 className="auth-form__title">Password Reset!</h2>
          <p className="auth-form__subtitle">Redirecting you to sign in...</p>
        </div>
      ) : (
        <>
          <div className="auth-form__header animate-fadeInDown">
            <span className="auth-form__header-icon">🔑</span>
            <h2 className="auth-form__title">Set new password</h2>
            <p className="auth-form__subtitle">For <strong>{email}</strong></p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="auth-form animate-fadeInUp">
            <InputField
              label="🔒 New Password" name="password" type="password"
              value={values.password} error={errors.password} touched={touched.password}
              onChange={handleChange} onBlur={handleBlur}
              placeholder="Min 8 characters" required
            />
            <InputField
              label="🔒 Confirm Password" name="confirmPassword" type="password"
              value={values.confirmPassword} error={errors.confirmPassword} touched={touched.confirmPassword}
              onChange={handleChange} onBlur={handleBlur}
              placeholder="Re-enter password" required
            />
            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={isSubmitting}>
              {isSubmitting ? <><span className="btn-spinner" /> Resetting...</> : '🔑 Reset Password'}
            </button>
          </form>
        </>
      )}
    </div>
  )
}

export default ResetPassword