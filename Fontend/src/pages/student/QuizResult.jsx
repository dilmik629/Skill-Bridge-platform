import { useLocation, useNavigate, Link } from 'react-router-dom'
import { ROUTES } from '../../utils/constants'
import './student.css'

const QuizResult = () => {
  const { state } = useLocation()
  const navigate  = useNavigate()
  const { score=72, passed=true, total=5, correct=4, projectTitle='E-Commerce Website' } = state || {}

  const color  = passed ? 'var(--color-success)' : 'var(--color-error)'
  const bgCol  = passed ? 'var(--color-success-bg)' : 'var(--color-error-bg)'

  return (
    <div className="student-page">
      <div className="container" style={{ maxWidth:560, margin:'0 auto' }}>
        <div className="card card-elevated animate-scaleInBounce" style={{ textAlign:'center', padding:'var(--space-12) var(--space-8)' }}>

          {/* Result icon */}
          <div style={{ fontSize:'5rem', marginBottom:'var(--space-4)', animation:'heartbeat .6s ease' }}>
            {passed ? '🎉' : '😢'}
          </div>

          <h1 style={{ fontSize:'var(--text-3xl)', fontWeight:'var(--font-bold)', color:'var(--color-text-primary)', marginBottom:'var(--space-2)' }}>
            {passed ? 'Quiz Passed!' : 'Not This Time'}
          </h1>
          <p style={{ color:'var(--color-text-muted)', marginBottom:'var(--space-8)' }}>
            {projectTitle}
          </p>

          {/* Score circle */}
          <div style={{ width:140, height:140, borderRadius:'50%', background: bgCol, border:`4px solid ${color}`, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', margin:'0 auto var(--space-8)' }}>
            <span style={{ fontSize:'var(--text-4xl)', fontWeight:'var(--font-extrabold)', color }}>{score}%</span>
            <span style={{ fontSize:'var(--text-xs)', color:'var(--color-text-muted)', fontWeight:'var(--font-semibold)' }}>Score</span>
          </div>

          {/* Stats */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'var(--space-4)', marginBottom:'var(--space-8)', background:'var(--color-bg)', borderRadius:'var(--radius-xl)', padding:'var(--space-5)' }}>
            {[
              { label:'Correct',   val:`${correct}/${total}`, icon:'✅' },
              { label:'Pass Mark', val:'70%',                  icon:'🎯' },
              { label:'Status',    val: passed?'Passed':'Failed', icon: passed?'🏆':'❌' },
            ].map((s,i) => (
              <div key={i}>
                <div style={{ fontSize:'1.4rem', marginBottom:4 }}>{s.icon}</div>
                <div style={{ fontSize:'var(--text-lg)', fontWeight:'var(--font-bold)', color:'var(--color-text-primary)' }}>{s.val}</div>
                <div style={{ fontSize:'var(--text-xs)', color:'var(--color-text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Message */}
          <div style={{ background: bgCol, border:`1px solid ${color}20`, borderRadius:'var(--radius-lg)', padding:'var(--space-4)', marginBottom:'var(--space-8)', fontSize:'var(--text-sm)', color:'var(--color-text-secondary)', lineHeight:'var(--leading-relaxed)' }}>
            {passed
              ? '🎊 Congratulations! You have been approved for this project. Head to My Projects to start working!'
              : '💪 Don\'t give up! You can retake this quiz after 24 hours. Review the topic and try again.'}
          </div>

          {/* Actions */}
          <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-3)' }}>
            {passed
              ? <Link to={ROUTES.MY_PROJECTS} className="btn btn-primary btn-lg btn-full">📁 Go to My Projects</Link>
              : <Link to={ROUTES.PROJECTS}    className="btn btn-primary btn-lg btn-full">🔍 Browse Other Projects</Link>}
            <Link to={ROUTES.STUDENT_DASHBOARD} className="btn btn-ghost btn-full">← Back to Dashboard</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuizResult