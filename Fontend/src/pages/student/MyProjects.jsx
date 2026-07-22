import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Badge from '../../components/common/Badge'
import ProgressBar from '../../components/common/ProgressBar'
import Loader from '../../components/common/Loader'
import submissionService from '../../services/submissionService'
import { ROUTES } from '../../utils/constants'
import './student.css'

const TABS = ['All','Active','Completed','Pending']

const MyProjects = () => {
  const [submissions, setSubmissions] = useState([])
  const [loading,     setLoading]     = useState(true)
  const [tab,         setTab]         = useState('All')

  useEffect(() => {
    submissionService.getMine()
      .then(res => setSubmissions(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = submissions.filter(s => {
    if (tab === 'All')       return true
    if (tab === 'Active')    return s.status === 'in_progress'
    if (tab === 'Completed') return ['approved','reviewed'].includes(s.status)
    if (tab === 'Pending')   return s.status === 'submitted'
    return true
  })

  if (loading) return <Loader fullPage text="Loading your projects..." />

  return (
    <div className="student-page">
      <div className="container">
        <div className="page-header animate-fadeInDown">
          <div className="page-header__top">
            <div>
              <p className="page-header__eyebrow">My Work</p>
              <h1 className="page-header__title">📁 My Projects</h1>
              <p className="page-header__subtitle">Track all your project applications and submissions.</p>
            </div>
            <Link to={ROUTES.PROJECTS} className="btn btn-primary">＋ Find New Project</Link>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid" style={{ gridTemplateColumns:'repeat(4,1fr)' }}>
          {[
            { icon:'⚡', label:'Active',    num: submissions.filter(s=>s.status==='in_progress').length,                  color:'indigo' },
            { icon:'✅', label:'Completed', num: submissions.filter(s=>['approved','reviewed'].includes(s.status)).length, color:'green'  },
            { icon:'⏳', label:'Pending',   num: submissions.filter(s=>s.status==='submitted').length,                    color:'amber'  },
            { icon:'📊', label:'Total',     num: submissions.length,                                                      color:'cyan'   },
          ].map((s,i) => (
            <div className="stat-card" key={i}>
              <div className={`stat-card__icon stat-card__icon--${s.color}`}>{s.icon}</div>
              <div><div className="stat-card__num">{s.num}</div><div className="stat-card__label">{s.label}</div></div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:'var(--space-2)', marginBottom:'var(--space-6)', background:'var(--color-surface)', padding:4, borderRadius:'var(--radius-xl)', border:'1px solid var(--color-border)', width:'fit-content' }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding:'var(--space-2) var(--space-5)', borderRadius:'var(--radius-lg)', border:'none', cursor:'pointer', fontFamily:'inherit', fontSize:'var(--text-sm)', fontWeight:'var(--font-semibold)', transition:'all .2s',
                background: tab===t ? 'var(--color-primary)' : 'none',
                color:      tab===t ? '#fff' : 'var(--color-text-secondary)',
              }}>{t}</button>
          ))}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">📭</div>
            <h3 className="empty-state__title">No projects here</h3>
            <p className="empty-state__desc">Browse projects and apply to get started!</p>
            <Link to={ROUTES.PROJECTS} className="btn btn-primary">Browse Projects</Link>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-4)' }}>
            {filtered.map((s, i) => (
              <div className="project-item animate-fadeInUp" key={s.id} style={{ animationDelay:`${i*60}ms` }}>
                <div className="project-item__icon">{s.project?.category?.icon || '📁'}</div>
                <div className="project-item__body">
                  <div className="project-item__title">{s.project?.title}</div>
                  <div className="project-item__meta">
                    <Badge level={s.project?.level} />
                    <Badge status={s.status} />
                    <span className="project-item__meta-text">🏷️ {s.project?.category?.name}</span>
                    {s.admin_score && (
                      <span style={{ fontSize:'var(--text-xs)', fontWeight:'var(--font-bold)', color:'var(--color-success)' }}>
                        ⭐ Score: {s.admin_score}/100
                      </span>
                    )}
                  </div>
                  {s.status === 'in_progress' && (
                    <ProgressBar value={30} size="sm" showValue />
                  )}
                  {s.feedback && (
                    <p style={{ fontSize:'var(--text-xs)', color:'var(--color-text-muted)', marginTop:'var(--space-2)', background:'var(--color-bg)', padding:'var(--space-2) var(--space-3)', borderRadius:'var(--radius-md)', borderLeft:'3px solid var(--color-primary)' }}>
                      💬 {s.feedback.comment}
                    </p>
                  )}
                </div>
                <div className="project-item__actions">
                  {s.github_url && (
                    <a href={s.github_url} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">
                      🐙 GitHub
                    </a>
                  )}
                  {s.status === 'in_progress' && (
                    <Link to={`/submit/${s.project_id}`} className="btn btn-primary btn-sm">📤 Submit</Link>
                  )}
                  {s.status === 'submitted' && (
                    <Link to={`/submit/${s.project_id}`} className="btn btn-ghost btn-sm">✏️ Edit Submission</Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyProjects