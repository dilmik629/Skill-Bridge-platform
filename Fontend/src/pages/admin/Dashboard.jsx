import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Badge from '../../components/common/Badge'
import Avatar from '../../components/common/Avatar'
import Loader from '../../components/common/Loader'
import dashboardService from '../../services/dashboardService'
import { ROUTES } from '../../utils/constants'
import './admin.css'

const AdminDashboard = () => {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardService.admin()
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader fullPage text="Loading dashboard..." />

  const stats              = data?.stats              || {}
  const recentSubmissions  = data?.recent_submissions || []
  const topStudents        = data?.top_students       || []

  return (
    <div className="admin-page">
      <div className="admin-header animate-fadeInDown">
        <div className="admin-header__left">
          <p className="admin-header__eyebrow">Overview</p>
          <h1 className="admin-header__title">📊 Admin Dashboard</h1>
          <p className="admin-header__sub">Welcome back! Here's what's happening on SkillBridge.</p>
        </div>
        <div className="admin-header__actions">
          <Link to={ROUTES.ADMIN_PROJECTS}   className="btn btn-secondary btn-sm">📁 Projects</Link>
          <Link to={ROUTES.ADMIN_SUBMISSIONS} className="btn btn-primary   btn-sm">📤 Submissions</Link>
        </div>
      </div>

      <div className="admin-stats animate-fadeInUp">
        {[
          { icon:'👥', label:'Total Students',      num: stats.total_students        || 0, color:'indigo' },
          { icon:'📁', label:'Active Projects',      num: stats.active_projects       || 0, color:'cyan'   },
          { icon:'📤', label:'Pending Submissions',  num: stats.pending_submissions   || 0, color:'amber'  },
          { icon:'✅', label:'Approved Today',       num: stats.approved_today        || 0, color:'green'  },
        ].map((s,i) => (
          <div className="admin-stat" key={i}>
            <div className={`admin-stat__icon asi-${s.color}`}>{s.icon}</div>
            <div><div className="admin-stat__num">{s.num}</div><div className="admin-stat__label">{s.label}</div></div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:'var(--space-6)', alignItems:'start' }}>
        <div>
          {/* Recent Submissions */}
          <div className="admin-table-wrap animate-fadeInUp" style={{ marginBottom:'var(--space-6)' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'var(--space-4) var(--space-5)', borderBottom:'1px solid var(--color-border)' }}>
              <h2 style={{ fontSize:'var(--text-base)', fontWeight:'var(--font-semibold)' }}>📤 Recent Submissions</h2>
              <Link to={ROUTES.ADMIN_SUBMISSIONS} style={{ fontSize:'var(--text-sm)', fontWeight:'var(--font-semibold)', color:'var(--color-primary)', textDecoration:'none' }}>View all →</Link>
            </div>
            <table>
              <thead><tr><th>Student</th><th>Project</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {recentSubmissions.length === 0 ? (
                  <tr><td colSpan={4} style={{ textAlign:'center', padding:'var(--space-8)', color:'var(--color-text-muted)' }}>No pending submissions.</td></tr>
                ) : recentSubmissions.map(s => (
                  <tr key={s.id}>
                    <td><div style={{ display:'flex', alignItems:'center', gap:'var(--space-2)' }}><Avatar src={s.student?.avatar} name={s.student?.name} size="xs" /><span style={{ fontWeight:'var(--font-medium)' }}>{s.student?.name}</span></div></td>
                    <td style={{ color:'var(--color-text-secondary)', maxWidth:160, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{s.project?.title}</td>
                    <td><Badge status={s.status} size="sm" /></td>
                    <td><Link to={`/admin/submissions/${s.id}`} className="btn btn-primary btn-sm">Review</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right sidebar */}
        <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-5)' }}>
          <div className="card card-elevated animate-fadeInRight">
            <h3 style={{ fontSize:'var(--text-base)', fontWeight:'var(--font-semibold)', marginBottom:'var(--space-4)' }}>⚡ Quick Actions</h3>
            {[
              { icon:'➕', label:'New Project',    to:'/admin/projects/create', bg:'var(--color-primary-bg)', color:'var(--color-primary)'   },
              { icon:'🧠', label:'Add Quiz',       to:'/admin/quizzes/create',  bg:'var(--color-accent-bg)',  color:'var(--color-accent)'    },
              { icon:'👥', label:'View Users',     to:ROUTES.ADMIN_USERS,       bg:'var(--color-success-bg)', color:'var(--color-success)'   },
              { icon:'📊', label:'Export Reports', to:ROUTES.ADMIN_REPORTS,     bg:'var(--color-warning-bg)', color:'var(--color-warning)'   },
            ].map((a,i) => (
              <Link key={i} to={a.to}
                style={{ display:'flex', alignItems:'center', gap:'var(--space-3)', padding:'var(--space-3)', borderRadius:'var(--radius-lg)', textDecoration:'none', marginBottom: i<3?'var(--space-2)':0, background:a.bg, color:a.color, fontWeight:'var(--font-semibold)', fontSize:'var(--text-sm)', transition:'all .2s' }}>
                <span style={{ fontSize:'1.1rem' }}>{a.icon}</span>{a.label}
              </Link>
            ))}
          </div>

          {topStudents.length > 0 && (
            <div className="card animate-fadeInRight" style={{ animationDelay:'100ms' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'var(--space-4)' }}>
                <h3 style={{ fontSize:'var(--text-base)', fontWeight:'var(--font-semibold)' }}>🏆 Top Students</h3>
                <Link to={ROUTES.ADMIN_USERS} style={{ fontSize:'var(--text-xs)', color:'var(--color-primary)', textDecoration:'none', fontWeight:'var(--font-semibold)' }}>View all</Link>
              </div>
              {topStudents.map((u,i) => (
                <div key={u.id} style={{ display:'flex', alignItems:'center', gap:'var(--space-3)', padding:'var(--space-3) 0', borderBottom: i<topStudents.length-1?'1px solid var(--color-border)':'none' }}>
                  <span style={{ fontSize:'.9rem', width:16, textAlign:'center', color:'var(--color-text-muted)', fontWeight:'var(--font-bold)' }}>{i+1}</span>
                  <Avatar src={u.avatar} name={u.name} size="sm" />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:'var(--text-sm)', fontWeight:'var(--font-semibold)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{u.name}</div>
                    <div style={{ fontSize:'var(--text-xs)', color:'var(--color-text-muted)' }}>{u.submissions_count || 0} submissions</div>
                  </div>
                  <span style={{ fontSize:'var(--text-sm)', fontWeight:'var(--font-bold)', color:'var(--color-primary)' }}>{u.skill_points}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export default AdminDashboard