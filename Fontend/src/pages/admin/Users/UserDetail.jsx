import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Avatar from '../../../components/common/Avatar'
import Badge from '../../../components/common/Badge'
import ProgressBar from '../../../components/common/ProgressBar'
import Loader from '../../../components/common/Loader'
import dashboardService from '../../../services/dashboardService'
import '../admin.css'

const UserDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardService.getUserById(id)
      .then(res => setUser(res.data))
      .catch(() => navigate('/admin/users'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <Loader fullPage text="Loading student profile..." />
  if (!user) return null

  const skills = user.quiz_attempts?.reduce((acc, attempt) => {
    if (!attempt.passed) return acc
    const cat = attempt.quiz?.project?.category?.name || 'General'
    if (!acc[cat]) acc[cat] = { count: 0, total: 0 }
    acc[cat].count++
    acc[cat].total += attempt.score
    return acc
  }, {})

  return (
    <div className="admin-page">
      <div className="admin-header animate-fadeInDown">
        <div className="admin-header__left">
          <p className="admin-header__eyebrow">Users</p>
          <h1 className="admin-header__title">👤 Student Profile</h1>
        </div>
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>← Back</button>
      </div>

      {/* Banner */}
      <div className="user-detail-banner animate-fadeInDown" style={{ animationDelay:'50ms' }}>
        <Avatar src={user.avatar} name={user.name} size="xl" />
        <div>
          <div style={{ fontSize:'var(--text-2xl)', fontWeight:'var(--font-bold)', marginBottom:4 }}>{user.name}</div>
          <div style={{ fontSize:'var(--text-sm)', opacity:.75, marginBottom:'var(--space-4)' }}>📧 {user.email}</div>
          <div style={{ display:'flex', gap:'var(--space-2)', flexWrap:'wrap' }}>
            {[
              `⚡ ${user.skill_points || 0} points`,
              `🏆 Rank #${user.leaderboard_score?.rank || '—'}`,
              `📁 ${user.submissions_count || 0} submissions`,
              `📋 ${user.applications_count || 0} applications`,
            ].map((b,i) => (
              <span key={i} style={{ background:'rgba(255,255,255,.15)', border:'1px solid rgba(255,255,255,.25)', color:'#fff', fontSize:'var(--text-xs)', fontWeight:'var(--font-semibold)', padding:'4px 12px', borderRadius:'var(--radius-full)' }}>{b}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:'var(--space-5)' }}>

        {/* Left — Projects */}
        <div>
          {/* Submissions */}
          {user.submissions?.length > 0 && (
            <div className="card animate-fadeInUp" style={{ marginBottom:'var(--space-5)' }}>
              <h3 style={{ fontSize:'var(--text-base)', fontWeight:'var(--font-semibold)', marginBottom:'var(--space-5)' }}>📁 Project Submissions</h3>
              {user.submissions.map((s,i) => (
                <div key={s.id} style={{ display:'flex', alignItems:'center', gap:'var(--space-3)', padding:'var(--space-4) 0', borderBottom: i<user.submissions.length-1?'1px solid var(--color-border)':'none' }}>
                  <div style={{ width:40, height:40, background:'var(--color-primary-bg)', borderRadius:'var(--radius-lg)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem', flexShrink:0 }}>
                    {s.project?.category?.icon || '📁'}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:'var(--font-semibold)', fontSize:'var(--text-sm)' }}>{s.project?.title}</div>
                    <div style={{ display:'flex', gap:'var(--space-2)', marginTop:4, flexWrap:'wrap' }}>
                      <Badge level={s.project?.level} size="sm" />
                      <Badge status={s.status} size="sm" />
                    </div>
                  </div>
                  {s.admin_score && (
                    <span style={{ fontWeight:'var(--font-bold)', color:'var(--color-success)', fontSize:'var(--text-sm)' }}>
                      ⭐ {s.admin_score}/100
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Applications */}
          {user.applications?.length > 0 && (
            <div className="card animate-fadeInUp" style={{ animationDelay:'100ms' }}>
              <h3 style={{ fontSize:'var(--text-base)', fontWeight:'var(--font-semibold)', marginBottom:'var(--space-5)' }}>📋 Project Applications</h3>
              {user.applications.map((a,i) => (
                <div key={a.id} style={{ display:'flex', alignItems:'center', gap:'var(--space-3)', padding:'var(--space-3) 0', borderBottom: i<user.applications.length-1?'1px solid var(--color-border)':'none', fontSize:'var(--text-sm)' }}>
                  <span style={{ flex:1, color:'var(--color-text-secondary)' }}>{a.project?.title}</span>
                  <Badge status={a.status} size="sm" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right — Info + Skills */}
        <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-5)' }}>
          <div className="card animate-fadeInRight">
            <h3 style={{ fontSize:'var(--text-sm)', fontWeight:'var(--font-semibold)', marginBottom:'var(--space-4)' }}>ℹ️ Details</h3>
            {[
              { label:'GitHub',  val: user.github_username ? `@${user.github_username}` : '—', link: user.github_username ? `https://github.com/${user.github_username}` : null },
              { label:'Bio',     val: user.bio || '—'                                         },
              { label:'Joined',  val: new Date(user.created_at).toLocaleDateString()          },
              { label:'Points',  val: `⚡ ${user.skill_points || 0}`                          },
            ].map((r,i) => (
              <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:'var(--space-3)', padding:'var(--space-2) 0', borderBottom: i<3?'1px solid var(--color-border)':'none', fontSize:'var(--text-sm)' }}>
                <span style={{ color:'var(--color-text-muted)', width:60, flexShrink:0 }}>{r.label}</span>
                {r.link ? (
                  <a href={r.link} target="_blank" rel="noreferrer" style={{ fontWeight:'var(--font-medium)', wordBreak:'break-word', color:'var(--color-primary)' }}>{r.val}</a>
                ) : (
                  <span style={{ fontWeight:'var(--font-medium)', wordBreak:'break-word' }}>{r.val}</span>
                )}
              </div>
            ))}
          </div>

          {/* Skills from quiz attempts */}
          {skills && Object.keys(skills).length > 0 && (
            <div className="card animate-fadeInRight" style={{ animationDelay:'100ms' }}>
              <h3 style={{ fontSize:'var(--text-sm)', fontWeight:'var(--font-semibold)', marginBottom:'var(--space-4)' }}>⚡ Skills (Quiz Based)</h3>
              {Object.entries(skills).map(([cat, data], i) => (
                <div key={i} style={{ marginBottom:'var(--space-3)' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:'var(--text-xs)', marginBottom:'var(--space-1)' }}>
                    <span style={{ color:'var(--color-text-secondary)' }}>{cat}</span>
                    <span style={{ fontWeight:'var(--font-bold)', color:'var(--color-primary)' }}>
                      {Math.round(data.total / data.count)}%
                    </span>
                  </div>
                  <ProgressBar value={Math.round(data.total / data.count)} size="sm" showValue={false} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserDetail