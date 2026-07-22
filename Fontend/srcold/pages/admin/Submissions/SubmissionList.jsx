import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Badge from '../../../components/common/Badge'
import Avatar from '../../../components/common/Avatar'
import Loader from '../../../components/common/Loader'
import submissionService from '../../../services/submissionService'
import '../admin.css'

const SubmissionList = () => {
  const [submissions, setSubmissions] = useState([])
  const [loading,     setLoading]     = useState(true)
  const [filter,      setFilter]      = useState('all')
  const [search,      setSearch]      = useState('')

  useEffect(() => {
    submissionService.adminAll({ status: filter !== 'all' ? filter : undefined })
      .then(res => setSubmissions(res.data.data || res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [filter])

  const filtered = submissions.filter(s =>
    s.student?.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.project?.title?.toLowerCase().includes(search.toLowerCase())
  )

  const pending = submissions.filter(s => s.status === 'submitted').length

  if (loading) return <Loader fullPage text="Loading submissions..." />

  return (
    <div className="admin-page">
      <div className="admin-header animate-fadeInDown">
        <div className="admin-header__left">
          <p className="admin-header__eyebrow">Review Queue</p>
          <h1 className="admin-header__title">
            📤 Submissions
            {pending > 0 && (
              <span style={{ marginLeft:'var(--space-3)', background:'var(--color-error)', color:'#fff', fontSize:'var(--text-sm)', fontWeight:'var(--font-bold)', padding:'2px 12px', borderRadius:'var(--radius-full)' }}>
                {pending} pending
              </span>
            )}
          </h1>
          <p className="admin-header__sub">Review and score student project submissions.</p>
        </div>
      </div>

      <div className="admin-stats animate-fadeInUp" style={{ gridTemplateColumns:'repeat(4,1fr)' }}>
        {[
          { icon:'⏳', label:'Pending',  num: submissions.filter(s=>s.status==='submitted').length, color:'amber'  },
          { icon:'👁️', label:'Reviewed', num: submissions.filter(s=>s.status==='reviewed').length,  color:'indigo' },
          { icon:'✅', label:'Approved', num: submissions.filter(s=>s.status==='approved').length,  color:'green'  },
          { icon:'❌', label:'Rejected', num: submissions.filter(s=>s.status==='rejected').length,  color:'red'    },
        ].map((s,i) => (
          <div className="admin-stat" key={i}>
            <div className={`admin-stat__icon asi-${s.color}`}>{s.icon}</div>
            <div><div className="admin-stat__num">{s.num}</div><div className="admin-stat__label">{s.label}</div></div>
          </div>
        ))}
      </div>

      <div className="admin-table-wrap animate-fadeInUp" style={{ animationDelay:'100ms' }}>
        <div className="admin-table-toolbar">
          <div className="admin-search">
            <span className="admin-search__icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </span>
            <input placeholder="Search student or project..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="admin-filter" value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="submitted">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <table>
          <thead><tr><th>Student</th><th>Project</th><th>Level</th><th>Submitted</th><th>Status</th><th>Score</th><th>Action</th></tr></thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign:'center', padding:'var(--space-10)', color:'var(--color-text-muted)' }}>No submissions found.</td></tr>
            ) : filtered.map(s => (
              <tr key={s.id}>
                <td>
                  <div style={{ display:'flex', alignItems:'center', gap:'var(--space-2)' }}>
                    <Avatar src={s.student?.avatar} name={s.student?.name} size="xs" />
                    <span style={{ fontWeight:'var(--font-medium)' }}>{s.student?.name}</span>
                  </div>
                </td>
                <td style={{ color:'var(--color-text-secondary)', maxWidth:180, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{s.project?.title}</td>
                <td><Badge level={s.project?.level} size="sm" /></td>
                <td style={{ color:'var(--color-text-muted)', fontSize:'var(--text-xs)' }}>
                  {new Date(s.submitted_at).toLocaleDateString()}
                </td>
                <td><Badge status={s.status} size="sm" /></td>
                <td style={{ fontWeight:'var(--font-bold)', color: s.admin_score>=70?'var(--color-success)':s.admin_score?'var(--color-error)':'var(--color-text-muted)' }}>
                  {s.admin_score ? `${s.admin_score}/100` : '—'}
                </td>
                <td>
                  <Link to={`/admin/submissions/${s.id}`}
                    className={`btn btn-sm ${s.status==='submitted'?'btn-primary':'btn-ghost'}`}>
                    {s.status === 'submitted' ? '👁️ Review' : 'View'}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="admin-pagination">
          <span>Showing {filtered.length} of {submissions.length} submissions</span>
        </div>
      </div>
    </div>
  )
}

export default SubmissionList