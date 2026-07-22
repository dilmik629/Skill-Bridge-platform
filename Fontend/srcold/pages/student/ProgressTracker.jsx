import { useState, useEffect } from 'react'
import ProgressBar from '../../components/common/ProgressBar'
import Badge from '../../components/common/Badge'
import Loader from '../../components/common/Loader'
import submissionService from '../../services/submissionService'
import dashboardService from '../../services/dashboardService'
import './student.css'

const ProgressTracker = () => {
  const [submissions, setSubmissions] = useState([])
  const [portfolio,   setPortfolio]   = useState(null)
  const [loading,     setLoading]     = useState(true)

  useEffect(() => {
    Promise.all([
      submissionService.getMine(),
      dashboardService.portfolio(),
    ])
      .then(([subRes, portRes]) => {
        setSubmissions(subRes.data)
        setPortfolio(portRes.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader fullPage text="Loading progress..." />

  const active    = submissions.filter(s => s.status === 'in_progress')
  const completed = submissions.filter(s => ['approved','reviewed'].includes(s.status))
  const skills    = portfolio?.skills || []
  const stats     = portfolio?.stats  || {}

  return (
    <div className="student-page">
      <div className="container">

        <div className="page-header animate-fadeInDown">
          <p className="page-header__eyebrow">Your Growth</p>
          <h1 className="page-header__title">📊 Progress Tracker</h1>
          <p className="page-header__subtitle">Monitor your project progress and skill development over time.</p>
        </div>

        <div className="content-grid">
          {/* Left */}
          <div>
            <h2 style={{ fontSize:'var(--text-xl)', fontWeight:'var(--font-semibold)', marginBottom:'var(--space-5)' }}>📁 Active Projects</h2>

            {active.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state__icon">📭</div>
                <h3 className="empty-state__title">No active projects</h3>
                <p className="empty-state__desc">Apply for projects to track progress here.</p>
              </div>
            ) : active.map((s, i) => (
              <div className="card animate-fadeInUp" key={s.id} style={{ marginBottom:'var(--space-5)', animationDelay:`${i*80}ms` }}>
                <div style={{ display:'flex', alignItems:'center', gap:'var(--space-3)', marginBottom:'var(--space-4)' }}>
                  <div style={{ width:44, height:44, borderRadius:'var(--radius-lg)', background:'var(--color-primary-bg)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem', flexShrink:0 }}>
                    {s.project?.category?.icon || '📁'}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:'var(--text-base)', fontWeight:'var(--font-semibold)' }}>{s.project?.title}</div>
                    <Badge level={s.project?.level} size="sm" />
                  </div>
                </div>
                <ProgressBar value={30} size="md" label="Progress" />
                <p style={{ fontSize:'var(--text-xs)', color:'var(--color-text-muted)', marginTop:'var(--space-3)' }}>
                  📅 Deadline: {s.project?.deadline}
                </p>
              </div>
            ))}

            {completed.length > 0 && (
              <>
                <h2 style={{ fontSize:'var(--text-xl)', fontWeight:'var(--font-semibold)', margin:'var(--space-8) 0 var(--space-5)' }}>✅ Completed Projects</h2>
                {completed.map((s, i) => (
                  <div className="project-item animate-fadeInUp" key={s.id} style={{ marginBottom:'var(--space-4)', animationDelay:`${i*60}ms` }}>
                    <div className="project-item__icon">{s.project?.category?.icon || '✅'}</div>
                    <div className="project-item__body">
                      <div className="project-item__title">{s.project?.title}</div>
                      <div className="project-item__meta">
                        <Badge level={s.project?.level} />
                        <Badge status={s.status} />
                        {s.admin_score && <span style={{ fontSize:'var(--text-xs)', fontWeight:'var(--font-bold)', color:'var(--color-success)' }}>⭐ {s.admin_score}/100</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Right */}
          <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-5)' }}>
            {skills.length > 0 && (
              <div className="card animate-fadeInRight">
                <h3 style={{ fontSize:'var(--text-base)', fontWeight:'var(--font-semibold)', marginBottom:'var(--space-5)' }}>⚡ Skill Growth</h3>
                {skills.map((s, i) => (
                  <div key={i} style={{ marginBottom:'var(--space-4)' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'var(--space-2)' }}>
                      <span style={{ fontSize:'var(--text-sm)', fontWeight:'var(--font-medium)' }}>{s.category}</span>
                      <span style={{ fontSize:'var(--text-xs)', fontWeight:'var(--font-bold)', color:'var(--color-success)' }}>{s.count} projects</span>
                    </div>
                    <ProgressBar value={s.avg_score} size="sm" showValue />
                  </div>
                ))}
              </div>
            )}

            <div className="card animate-fadeInRight" style={{ animationDelay:'100ms' }}>
              <h3 style={{ fontSize:'var(--text-base)', fontWeight:'var(--font-semibold)', marginBottom:'var(--space-4)' }}>📈 Summary</h3>
              {[
                { label:'Projects Done',  val: stats.projects_done || 0,    icon:'📁' },
                { label:'Skill Points',   val: stats.skill_points  || 0,    icon:'⚡' },
                { label:'Rank',           val: stats.rank ? `#${stats.rank}` : '—', icon:'🏆' },
                { label:'Active Now',     val: active.length,                icon:'🔄' },
              ].map((s,i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:'var(--space-3)', padding:'var(--space-3) 0', borderBottom: i<3?'1px solid var(--color-border)':'none' }}>
                  <span style={{ fontSize:'1rem' }}>{s.icon}</span>
                  <span style={{ flex:1, fontSize:'var(--text-sm)', color:'var(--color-text-secondary)' }}>{s.label}</span>
                  <span style={{ fontSize:'var(--text-sm)', fontWeight:'var(--font-bold)', color:'var(--color-text-primary)' }}>{s.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProgressTracker