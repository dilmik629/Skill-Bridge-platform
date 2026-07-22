import { Link, useNavigate, useLocation } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import useForm from '../../hooks/useForm'
import useToast from '../../hooks/useToast.jsx'
import InputField from '../../components/forms/InputField'
import authService from '../../services/authService'
import { loginRules } from '../../utils/validators'
import { ROUTES } from '../../utils/constants'
import './auth.css'

const Login = () => {
  const { login }          = useAuth()
  const { success, error } = useToast()
  const navigate           = useNavigate()
  const location           = useLocation()
  const from = location.state?.from?.pathname || ROUTES.STUDENT_DASHBOARD

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } = useForm({
    initialValues: { email: '', password: '' },
    rules: loginRules,
    onSubmit: async (vals) => {
      try {
        const res = await authService.login(vals)
        login(res.data.user, res.data.token)
        success(`Welcome back, ${res.data.user.name}! 👋`)
        navigate(
          res.data.user.role === 'admin' ? ROUTES.ADMIN_DASHBOARD : from,
          { replace: true }
        )
      } catch (err) {
        error(err.response?.data?.message || 'Invalid email or password.')
      }
    },
  })

  return (
    <div className="auth-page">
      <div className="auth-hero">
        <div className="auth-hero__content">
          <div className="auth-hero__badge">🚀 Learn by Doing</div>
          <h1 className="auth-hero__title">Turn Skills Into<br /><span className="auth-hero__title-accent">Real Projects</span></h1>
          <p className="auth-hero__desc">Apply for real-world projects, pass skill quizzes, build your portfolio — all in one place.</p>
          <div className="auth-hero__cards">
            {[
              { icon:'📁', num:'120+', label:'Live Projects'    },
              { icon:'🧑‍💻', num:'2.4k+',label:'Active Students'  },
              { icon:'🏆', num:'98%',  label:'Completion Rate'  },
            ].map((c,i)=>(
              <div key={i} className={`auth-hero__card animate-fadeInUp delay-${(i+1)*100}`}>
                <div className="auth-hero__card-icon" style={{background:'rgba(255,255,255,.20)'}}>{c.icon}</div>
                <div><p className="auth-hero__card-num">{c.num}</p><p className="auth-hero__card-label">{c.label}</p></div>
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
            <span className="auth-form__header-icon">👋</span>
            <h2 className="auth-form__title">Welcome back!</h2>
            <p className="auth-form__subtitle">Sign in to continue your journey</p>
          </div>
          <form onSubmit={handleSubmit} noValidate className="auth-form">
            <InputField label="📧 Email Address" name="email" type="email" value={values.email} error={errors.email} touched={touched.email} onChange={handleChange} onBlur={handleBlur} placeholder="you@example.com" required />
            <InputField label="🔒 Password" name="password" type="password" value={values.password} error={errors.password} touched={touched.password} onChange={handleChange} onBlur={handleBlur} placeholder="Enter your password" required />
            <div className="auth-form__meta">
              <label className="auth-form__remember"><input type="checkbox" /><span>Remember me</span></label>
              <Link to={ROUTES.FORGOT_PASSWORD} className="auth-form__forgot">Forgot password?</Link>
            </div>
            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={isSubmitting}>
              {isSubmitting ? <><span className="btn-spinner" /> Signing in...</> : '🔓 Sign In'}
            </button>
            <div className="divider-text">or</div>
            <Link to={ROUTES.REGISTER} className="btn btn-secondary btn-full btn-lg">✨ Create Free Account</Link>
            <p className="auth-form__switch">Don't have an account? <Link to={ROUTES.REGISTER}>Sign up free →</Link></p>
          </form>
        </div>
      </div>
    </div>
  )
}
export default Login