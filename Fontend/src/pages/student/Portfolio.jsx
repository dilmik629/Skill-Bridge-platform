import { useState, useEffect } from 'react'
import useToast from '../../hooks/useToast.jsx'
import Badge from '../../components/common/Badge'
import ProgressBar from '../../components/common/ProgressBar'
import Loader from '../../components/common/Loader'
import dashboardService from '../../services/dashboardService'
import './student.css'

const Portfolio = () => {

  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const { success, error }    = useToast()
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    dashboardService.portfolio()
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader fullPage text="Building your portfolio..." />

  const student   = data?.student           || {}
  const projects  = data?.completed_projects || []
  const skills    = data?.skills            || []
  const stats     = data?.stats             || {}

  const handleExportPdf = async () => {
    setExporting(true)
    try {
      const res = await dashboardService.exportPortfolio()
      const blob = new Blob([res.data], { type: 'application/pdf' })
      const url  = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `skillbridge-portfolio-${student.name || 'student'}.pdf`
      link.click()
      window.URL.revokeObjectURL(url)
      success('Portfolio PDF downloaded! 📄')
    } catch (err) {
      error('Failed to export PDF.')
    } finally {
      setExporting(false)
    }
  }

//-----------

  return (
    <div className="student-page">
      <div className="container">

        {/* Hero */}
        <div className="portfolio-hero animate-fadeInDown">
          <div style={{ position:'relative', zIndex:1 }}>
            <div style={{ width:80, height:80, borderRadius:'50%', background:'rgba(255,255,255,.15)', border:'3px solid rgba(255,255,255,.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem', margin:'0 auto var(--space-5)' }}>
              {(student.name||'S')[0].toUpperCase()}
            </div>
            <h1 className="portfolio-hero__name">{student.name || 'Student Name'}</h1>
            <p className="portfolio-hero__title">Full-Stack Developer</p>
            <p className="portfolio-hero__bio">{student.bio || 'Passionate about building real-world applications and learning through hands-on projects on SkillBridge.'}</p>
            <div className="portfolio-hero__skills">
              {skills.map((s,i) => (
                <span key={i} className="portfolio-skill-tag">{s.category}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display:'flex', gap:'var(--space-3)', marginBottom:'var(--space-8)', flexWrap:'wrap' }}>
          <button className="btn btn-primary" onClick={() => { navigator.clipboard?.writeText(window.location.href); success('Portfolio link copied! 🔗') }}>🔗 Share Portfolio</button>
          <button className="btn btn-secondary" onClick={handleExportPdf} disabled={exporting}>
            {exporting ? '⏳ Generating...' : '📄 Export as PDF'}
          </button>
          </div>

        <div className="content-grid">
          {/* Projects */}
          <div>
            <h2 style={{ fontSize:'var(--text-2xl)', fontWeight:'var(--font-bold)', marginBottom:'var(--space-6)' }}>📁 Completed Projects</h2>

            {projects.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state__icon">📭</div>
                <h3 className="empty-state__title">No completed projects yet</h3>
                <p className="empty-state__desc">Complete projects to build your portfolio!</p>
              </div>
            ) : projects.map((s, i) => (
              <div className="card animate-fadeInUp" key={s.id} style={{ marginBottom:'var(--space-5)', animationDelay:`${i*80}ms` }}>
                <div style={{ display:'flex', alignItems:'flex-start', gap:'var(--space-4)', marginBottom:'var(--space-4)' }}>
                  <div style={{ width:48, height:48, borderRadius:'var(--radius-lg)', background:'var(--color-primary-bg)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem', flexShrink:0 }}>
                    {s.project?.category?.icon || '📁'}
                  </div>
                  <div style={{ flex:1 }}>
                    <h3 style={{ fontSize:'var(--text-lg)', fontWeight:'var(--font-semibold)', marginBottom:'var(--space-2)' }}>{s.project?.title}</h3>
                    <div style={{ display:'flex', gap:'var(--space-2)', flexWrap:'wrap' }}>
                      <Badge level={s.project?.level} />
                      <Badge status="approved" />
                      {s.admin_score && <span style={{ fontSize:'var(--text-xs)', fontWeight:'var(--font-bold)', color:'var(--color-success)' }}>⭐ {s.admin_score}/100</span>}
                    </div>
                  </div>
                </div>

                {s.feedback && (
                  <p style={{ fontSize:'var(--text-sm)', color:'var(--color-text-secondary)', lineHeight:'var(--leading-relaxed)', marginBottom:'var(--space-4)', background:'var(--color-bg)', padding:'var(--space-3)', borderRadius:'var(--radius-lg)', borderLeft:'3px solid var(--color-primary)' }}>
                    💬 {s.feedback.comment}
                  </p>
                )}

                {s.project?.tech_stack && (
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'var(--space-2)', marginBottom:'var(--space-4)' }}>
                    {s.project.tech_stack.map(t => (
                      <span key={t} style={{ background:'var(--color-bg)', border:'1px solid var(--color-border)', padding:'2px 10px', borderRadius:'var(--radius-full)', fontSize:'var(--text-xs)', fontWeight:'var(--font-semibold)', color:'var(--color-text-secondary)' }}>{t}</span>
                    ))}
                  </div>
                )}

                {s.github_url && (
                  <a href={s.github_url} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">
                    🐙 View on GitHub
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-5)' }}>
            <div className="card animate-fadeInRight">
              <h3 style={{ fontSize:'var(--text-base)', fontWeight:'var(--font-semibold)', marginBottom:'var(--space-4)' }}>📊 Stats</h3>
              {[
                { icon:'📁', label:'Projects Done', val: stats.projects_done || 0   },
                { icon:'⚡', label:'Skill Points',  val: stats.skill_points  || 0   },
                { icon:'🏆', label:'Rank',          val: stats.rank ? `#${stats.rank}` : '—' },
              ].map((s,i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:'var(--space-3)', padding:'var(--space-3) 0', borderBottom: i<2?'1px solid var(--color-border)':'none' }}>
                  <span style={{ fontSize:'1rem' }}>{s.icon}</span>
                  <span style={{ flex:1, fontSize:'var(--text-sm)', color:'var(--color-text-secondary)' }}>{s.label}</span>
                  <span style={{ fontSize:'var(--text-sm)', fontWeight:'var(--font-bold)', color:'var(--color-primary)' }}>{s.val}</span>
                </div>
              ))}
            </div>

            {skills.length > 0 && (
              <div className="card animate-fadeInRight" style={{ animationDelay:'100ms' }}>
                <h3 style={{ fontSize:'var(--text-base)', fontWeight:'var(--font-semibold)', marginBottom:'var(--space-5)' }}>⚡ Skills</h3>
                {skills.map((s, i) => (
                  <div key={i} style={{ marginBottom:'var(--space-3)' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:'var(--text-xs)', marginBottom:'var(--space-1)' }}>
                      <span>{s.category}</span>
                      <span style={{ fontWeight:'var(--font-bold)', color:'var(--color-primary)' }}>{s.avg_score}%</span>
                    </div>
                    <ProgressBar value={s.avg_score} size="sm" showValue={false} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Portfolio