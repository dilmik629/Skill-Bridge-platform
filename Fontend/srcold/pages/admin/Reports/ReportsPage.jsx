import { useState, useEffect } from 'react'
import useToast from '../../../hooks/useToast.jsx'
import reportService from '../../../services/reportService'
import dashboardService from '../../../services/dashboardService'
import Loader from '../../../components/common/Loader'
import '../admin.css'

const REPORTS = [
  { icon:'👥', title:'Student Report',      desc:'All registered students with points, projects, quiz scores and rank.',                 type:'students'    },
  { icon:'📁', title:'Projects Report',     desc:'All projects with status, student count, completion rate and admin notes.',            type:'projects'    },
  { icon:'📤', title:'Submissions Report',  desc:'All project submissions with scores, feedback status and approval rates by category.', type:'submissions'  },
  { icon:'🧠', title:'Quiz Performance',    desc:'Quiz attempt stats, pass rates by project, average scores and retake frequency.',      type:'quizzes'      },
  { icon:'🏆', title:'Leaderboard Export',  desc:'Current leaderboard ranking with points breakdown and achievement badges.',            type:'leaderboard'  },
  { icon:'📊', title:'Platform Analytics',  desc:'Overall platform stats, monthly active users, project completion trends.',             type:'analytics'    },
]

const ReportsPage = () => {
  const { success, error } = useToast()
  const [generating, setGenerating] = useState(null)
  const [dateFrom,   setDateFrom]   = useState('')
  const [dateTo,     setDateTo]     = useState('')
  const [stats,      setStats]      = useState(null)
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    dashboardService.admin()
      .then(res => setStats(res.data.stats))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleExport = async (type, format) => {
    setGenerating(`${type}-${format}`)
    try {
      const res = await reportService.export(type, format, dateFrom, dateTo)
      // Create download link
      const blob   = new Blob([res.data], { type: format === 'pdf' ? 'application/pdf' : 'text/csv' })
      const url    = window.URL.createObjectURL(blob)
      const link   = document.createElement('a')
      link.href    = url
      link.download = `skillbridge-${type}-${new Date().toISOString().split('T')[0]}.${format}`
      link.click()
      window.URL.revokeObjectURL(url)
      success(`${type} report exported as ${format.toUpperCase()}! 📥`)
    } catch (err) {
      // If API not ready yet, show friendly message
      if (err.response?.status === 404) {
        error('Report endpoint not yet available. Connect backend first.')
      } else {
        error('Export failed. Please try again.')
      }
    } finally { setGenerating(null) }
  }

  if (loading) return <Loader fullPage text="Loading reports..." />

  return (
    <div className="admin-page">
      <div className="admin-header animate-fadeInDown">
        <div className="admin-header__left">
          <p className="admin-header__eyebrow">Analytics</p>
          <h1 className="admin-header__title">📊 Reports</h1>
          <p className="admin-header__sub">Export platform data as CSV or PDF for analysis.</p>
        </div>
      </div>

      {/* Date range filter */}
      <div className="card animate-fadeInUp" style={{ marginBottom:'var(--space-8)', maxWidth:500 }}>
        <h3 style={{ fontSize:'var(--text-base)', fontWeight:'var(--font-semibold)', marginBottom:'var(--space-4)' }}>📅 Date Range (Optional)</h3>
        <div className="form-row">
          <div className="form-field">
            <label className="form-label">From</label>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">To</label>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="form-input" />
          </div>
        </div>
      </div>

      {/* Platform stats */}
      {stats && (
        <div className="admin-stats animate-fadeInUp" style={{ animationDelay:'50ms' }}>
          {[
            { icon:'👥', label:'Total Students',    num: stats.total_students        || 0, color:'indigo' },
            { icon:'📁', label:'Active Projects',    num: stats.active_projects       || 0, color:'cyan'   },
            { icon:'📤', label:'Total Submissions',  num: stats.pending_submissions   || 0, color:'amber'  },
            { icon:'✅', label:'Approved Today',     num: stats.approved_today        || 0, color:'green'  },
          ].map((s,i) => (
            <div className="admin-stat" key={i}>
              <div className={`admin-stat__icon asi-${s.color}`}>{s.icon}</div>
              <div><div className="admin-stat__num">{s.num}</div><div className="admin-stat__label">{s.label}</div></div>
            </div>
          ))}
        </div>
      )}

      {/* Report cards */}
      <div className="report-grid animate-fadeInUp" style={{ animationDelay:'100ms' }}>
        {REPORTS.map((r,i) => (
          <div className="report-card" key={i}>
            <div className="report-card__icon">{r.icon}</div>
            <div className="report-card__title">{r.title}</div>
            <div className="report-card__desc">{r.desc}</div>
            <div style={{ display:'flex', gap:'var(--space-2)', marginTop:'auto' }}>
              <button
                className="btn btn-secondary btn-sm"
                style={{ flex:1 }}
                onClick={() => handleExport(r.type, 'csv')}
                disabled={!!generating}>
                {generating === `${r.type}-csv` ? '⏳' : '📄'} CSV
              </button>
              <button
                className="btn btn-primary btn-sm"
                style={{ flex:1 }}
                onClick={() => handleExport(r.type, 'pdf')}
                disabled={!!generating}>
                {generating === `${r.type}-pdf` ? '⏳' : '📑'} PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReportsPage