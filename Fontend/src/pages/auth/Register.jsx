import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import useForm from '../../hooks/useForm'
import useToast from '../../hooks/useToast.jsx'
import InputField from '../../components/forms/InputField'
import authService from '../../services/authService'
import { registerRules } from '../../utils/validators'
import { ROUTES } from '../../utils/constants'
import './auth.css'

const Register = () => {
  const { login }          = useAuth()
  const { success, error } = useToast()
  const navigate           = useNavigate()

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } = useForm({
    initialValues: { name:'', email:'', password:'', confirmPassword:'' },
    rules: (vals) => registerRules(vals),
    onSubmit: async (vals) => {
      try {
        const res = await authService.register({
          name: vals.name, email: vals.email,
          password: vals.password,
          password_confirmation: vals.confirmPassword,
        })
        login(res.data.user, res.data.token)
        success('Account created! Welcome to SkillBridge 🎉')
        navigate(ROUTES.STUDENT_DASHBOARD)
      } catch (err) {
        const msg = err.response?.data?.message
          || Object.values(err.response?.data?.errors || {})[0]?.[0]
          || 'Registration failed.'
        error(msg)
      }
    },
  })

  return (
    <div className="auth-page">
      <div className="auth-hero">
        <div className="auth-hero__content">
          <div className="auth-hero__badge">✨ Free to Join</div>
          <h1 className="auth-hero__title">Start Building<br /><span className="auth-hero__title-accent">Your Future</span></h1>
          <p className="auth-hero__desc">Join thousands of students working on real projects and building careers that matter.</p>
          <div className="auth-hero__steps">
            {[
              {icon:'🎯',text:'Apply for real-world projects'},
              {icon:'🧠',text:'Prove skills with quizzes'},
              {icon:'🏆',text:'Climb the leaderboard'},
              {icon:'📁',text:'Auto-generate your portfolio'},
            ].map((s,i)=>(
              <div key={i} className={`auth-hero__step animate-fadeInLeft delay-${(i+1)*100}`}>
                <span className="auth-hero__step-icon">{s.icon}</span>
                <span className="auth-hero__step-text">{s.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="auth-hero__blob auth-hero__blob--1" />
        <div className="auth-hero__blob auth-hero__blob--2" />
      </div>
      <div className="auth-form-panel">
        <div className="auth-form-wrap animate-fadeInRight">
          <div className="auth-form__logo">
            <div className="auth-form__logo-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className="auth-form__logo-text">Skill<span>Bridge</span></span>
          </div>
          <div className="auth-form__header">
            <span className="auth-form__header-icon">🎉</span>
            <h2 className="auth-form__title">Create account</h2>
            <p className="auth-form__subtitle">Free forever · No credit card needed</p>
          </div>
          <form onSubmit={handleSubmit} noValidate className="auth-form">
            <InputField label="😊 Full Name" name="name" value={values.name} error={errors.name} touched={touched.name} onChange={handleChange} onBlur={handleBlur} placeholder="Your full name" required />
            <InputField label="📧 Email Address" name="email" type="email" value={values.email} error={errors.email} touched={touched.email} onChange={handleChange} onBlur={handleBlur} placeholder="you@example.com" required />
            <div className="form-row">
              <InputField label="🔒 Password" name="password" type="password" value={values.password} error={errors.password} touched={touched.password} onChange={handleChange} onBlur={handleBlur} placeholder="Min 8 chars" hint="Uppercase + number" required />
              <InputField label="🔁 Confirm" name="confirmPassword" type="password" value={values.confirmPassword} error={errors.confirmPassword} touched={touched.confirmPassword} onChange={handleChange} onBlur={handleBlur} placeholder="Repeat password" required />
            </div>
            <p className="auth-form__terms">By registering, you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.</p>
            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={isSubmitting}>
              {isSubmitting ? <><span className="btn-spinner" /> Creating...</> : '🚀 Create Free Account'}
            </button>
            <div className="divider-text">already a member?</div>
            <Link to={ROUTES.LOGIN} className="btn btn-secondary btn-full btn-lg">🔓 Sign In Instead</Link>
            <p className="auth-form__switch">Already have an account? <Link to={ROUTES.LOGIN}>Sign in →</Link></p>
          </form>
        </div>
      </div>
    </div>
  )
}
export default Register