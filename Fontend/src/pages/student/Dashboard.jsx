import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import Badge from '../../components/common/Badge'
import ProgressBar from '../../components/common/ProgressBar'
import Avatar from '../../components/common/Avatar'
import Loader from '../../components/common/Loader'
import dashboardService from '../../services/dashboardService'
import { ROUTES } from '../../utils/constants'
import './student.css'

const Dashboard = () => {
  const { user } = useAuth()
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardService.student()
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader fullPage text="Loading dashboard..." />

  const stats = data?.stats || {}
  const activeProjects = data?.active_projects || []
  const recentSubmissions = data?.recent_submissions || []

  return (
    <div className="student-page">
      <div className="container">
        <div className="page-header animate-fadeInDown">
          <div className="page-header__top">
            <div>
              <p className="page-header__eyebrow">Student Dashboard</p>
              <h1 className="page-header__title">Hey, {user?.name?.split(' ')[0] || 'Student'} 👋</h1>
              <p className="page-header__subtitle">Here's what's happening with your learning journey.</p>
            </div>
            <Link to={ROUTES.PROJECTS} className="btn btn-primary">🔍 Browse Projects</Link>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid animate-fadeInUp">
          {[
            { icon:'📁', label:'Active Projects',  num: stats.active_projects    || 0, color:'indigo' },
            { icon:'✅', label:'Completed',         num: stats.completed_projects  || 0, color:'green'  },
            { icon:'🏆', label:'Leaderboard Rank', num: stats.rank ? `#${stats.rank}` : '—', color:'amber' },
            { icon:'⚡', label:'Skill Points',     num: stats.skill_points       || 0, color:'cyan'   },
          ].map((s,i) => (
            <div className="stat-card" key={i}>
              <div className={`stat-card__icon stat-card__icon--${s.color}`}>{s.icon}</div>
              <div><div className="stat-card__num">{s.num}</div><div className="stat-card__label">{s.label}</div></div>
            </div>
          ))}
        </div>

        <div className="content-grid">
          {/* LEFT */}
          <div>
            <div className="section-header">
              <h2 className="section-title">📁 Active Projects</h2>
              <Link to={ROUTES.MY_PROJECTS} className="section-link">View all →</Link>
            </div>

            {activeProjects.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state__icon">📭</div>
                <h3 className="empty-state__title">No active projects</h3>
                <p className="empty-state__desc">Browse projects and apply to get started!</p>
                <Link to={ROUTES.PROJECTS} className="btn btn-primary">Browse Projects</Link>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-4)' }}>
                {activeProjects.map((app, i) => (
                  <div className="project-item animate-fadeInUp" key={app.id} style={{ animationDelay:`${i*80}ms` }}>
                    <div className="project-item__icon">{app.project?.category?.icon || '📁'}</div>
                    <div className="project-item__body">
                      <div className="project-item__title">{app.project?.title}</div>
                      <div className="project-item__meta">
                        <Badge level={app.project?.level} />
                        <span className="project-item__meta-text">📅 Due {app.project?.deadline}</span>
                      </div>
                    </div>
                    <div className="project-item__actions">
                      <Link to={`/submit/${app.project_id}`} className="btn btn-primary btn-sm">Submit</Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Recent submissions */}
            {recentSubmissions.length > 0 && (
              <div style={{ marginTop:'var(--space-8)' }}>
                <div className="section-header">
                  <h2 className="section-title">📤 Recent Submissions</h2>
                  <Link to={ROUTES.MY_PROJECTS} className="section-link">See all →</Link>
                </div>
                <div style={{ background:'var(--color-surface)', border:'1px solid var(--color-border)', borderRadius:'var(--radius-xl)', overflow:'hidden' }}>
                  {recentSubmissions.map((s, i) => (
                    <div key={s.id} style={{ display:'flex', alignItems:'center', gap:'var(--space-3)', padding:'var(--space-4) var(--space-5)', borderBottom: i < recentSubmissions.length-1 ? '1px solid var(--color-border)' : 'none' }}>
                      <span style={{ fontSize:'1.1rem' }}>{s.status==='approved'?'🎉':s.status==='rejected'?'❌':'⏳'}</span>
                      <p style={{ fontSize:'var(--text-sm)', color:'var(--color-text-secondary)', flex:1 }}>{s.project?.title}</p>
                      <Badge status={s.status} size="sm" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-5)' }}>
            <div className="card card-elevated animate-fadeInRight">
              <h3 style={{ fontSize:'var(--text-base)', fontWeight:'var(--font-semibold)', marginBottom:'var(--space-4)' }}>🔗 Quick Links</h3>
              {[
                { icon:'📁', label:'My Projects',      to: ROUTES.MY_PROJECTS   },
                { icon:'👤', label:'Edit Profile',      to: ROUTES.PROFILE       },
                { icon:'🎯', label:'My Portfolio',      to: ROUTES.PORTFOLIO     },
                { icon:'🏆', label:'Leaderboard',       to: ROUTES.LEADERBOARD   },
                { icon:'📊', label:'Progress Tracker',  to: ROUTES.PROGRESS      },
              ].map((l, i) => (
                <Link key={i} to={l.to}
                  style={{ display:'flex', alignItems:'center', gap:'var(--space-3)', padding:'var(--space-2) 0', fontSize:'var(--text-sm)', color:'var(--color-text-secondary)', textDecoration:'none', borderBottom: i<4?'1px solid var(--color-border)':'none' }}
                  onMouseEnter={e=>e.currentTarget.style.color='var(--color-primary)'}
                  onMouseLeave={e=>e.currentTarget.style.color='var(--color-text-secondary)'}>
                  <span>{l.icon}</span>{l.label}
                  <span style={{ marginLeft:'auto', opacity:.4 }}>→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Dashboard