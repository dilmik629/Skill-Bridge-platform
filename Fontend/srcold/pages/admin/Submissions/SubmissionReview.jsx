import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useToast from '../../../hooks/useToast.jsx'
import Avatar from '../../../components/common/Avatar'
import Badge from '../../../components/common/Badge'
import TextareaField from '../../../components/forms/TextareaField'
import Loader from '../../../components/common/Loader'
import submissionService from '../../../services/submissionService'
import '../admin.css'

const SubmissionReview = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { success, error } = useToast()

  const [submission, setSubmission] = useState(null)
  const [loading,    setLoading]    = useState(true)
  const [score,      setScore]      = useState(75)
  const [feedback,   setFeedback]   = useState('')
  const [saving,     setSaving]     = useState(false)

  useEffect(() => {
    submissionService.adminGet(id)
      .then(res => {
        setSubmission(res.data)
        if (res.data.admin_score) setScore(res.data.admin_score)
        if (res.data.feedback?.comment) setFeedback(res.data.feedback.comment)
      })
      .catch(() => { error('Submission not found.'); navigate('/admin/submissions') })
      .finally(() => setLoading(false))
  }, [id])

  const handleAction = async (action) => {
    if (!feedback.trim()) return error('Please add feedback before submitting.')
    setSaving(true)
    try {
      await submissionService.review(id, { admin_score: score, comment: feedback, action })
      success(action === 'approve' ? '✅ Submission approved!' : '❌ Submission rejected.')
      navigate('/admin/submissions')
    } catch (err) {
      error(err.response?.data?.message || 'Action failed.')
    } finally { setSaving(false) }
  }

  if (loading) return <Loader fullPage text="Loading submission..." />
  if (!submission) return null

  const scoreColor = score >= 70 ? 'var(--color-success)' : score >= 50 ? 'var(--color-warning)' : 'var(--color-error)'
  const isReviewed = ['approved','rejected','reviewed'].includes(submission.status)

  return (
    <div className="admin-page">
      <div className="admin-header animate-fadeInDown">
        <div className="admin-header__left">
          <p className="admin-header__eyebrow">Submissions</p>
          <h1 className="admin-header__title">👁️ Review Submission</h1>
          <p className="admin-header__sub">Evaluate the student's work and provide feedback.</p>
        </div>
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>← Back</button>
      </div>

      <div className="review-layout animate-fadeInUp">

        {/* LEFT — Details */}
        <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-5)' }}>

          {/* Student info */}
          <div className="review-card">
            <h3 style={{ fontSize:'var(--text-base)', fontWeight:'var(--font-semibold)', marginBottom:'var(--space-4)' }}>👤 Submission Info</h3>
            <div style={{ display:'flex', alignItems:'center', gap:'var(--space-4)', marginBottom:'var(--space-5)', padding:'var(--space-4)', background:'var(--color-bg)', borderRadius:'var(--radius-lg)' }}>
              <Avatar src={submission.student?.avatar} name={submission.student?.name} size="md" />
              <div>
                <div style={{ fontWeight:'var(--font-semibold)', marginBottom:2 }}>{submission.student?.name}</div>
                <div style={{ fontSize:'var(--text-xs)', color:'var(--color-text-muted)' }}>{submission.student?.email}</div>
              </div>
              <div style={{ marginLeft:'auto', textAlign:'right' }}>
                <div style={{ fontSize:'var(--text-xs)', color:'var(--color-text-muted)' }}>Submitted</div>
                <div style={{ fontSize:'var(--text-sm)', fontWeight:'var(--font-medium)' }}>
                  {new Date(submission.submitted_at).toLocaleDateString()}
                </div>
              </div>
            </div>
            {[
              { label:'Project', val: submission.project?.title },
              { label:'Level',   val: <Badge level={submission.project?.level} size="sm" /> },
              { label:'Status',  val: <Badge status={submission.status} size="sm" /> },
            ].map((r,i) => (
              <div key={i} style={{ display:'flex', gap:'var(--space-3)', padding:'var(--space-3) 0', borderBottom:'1px solid var(--color-border)', fontSize:'var(--text-sm)', alignItems:'center' }}>
                <span style={{ color:'var(--color-text-muted)', width:80, flexShrink:0 }}>{r.label}</span>
                <span style={{ fontWeight:'var(--font-medium)' }}>{r.val}</span>
              </div>
            ))}
          </div>

          {/* GitHub */}
          <div className="review-card">
            <h3 style={{ fontSize:'var(--text-base)', fontWeight:'var(--font-semibold)', marginBottom:'var(--space-4)' }}>🐙 GitHub Repository</h3>
            <a href={submission.github_url} target="_blank" rel="noreferrer"
              style={{ display:'flex', alignItems:'center', gap:'var(--space-3)', padding:'var(--space-4)', background:'var(--color-bg)', border:'1px solid var(--color-border)', borderRadius:'var(--radius-lg)', textDecoration:'none', color:'var(--color-primary)', fontWeight:'var(--font-medium)', fontSize:'var(--text-sm)', transition:'all .2s', wordBreak:'break-all' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              {submission.github_url} ↗
            </a>
          </div>

          {/* Submitted Project Files */}
          {submission.file_path && (
            <div className="review-card">
              <h3 style={{ fontSize:'var(--text-base)', fontWeight:'var(--font-semibold)', marginBottom:'var(--space-4)' }}>📁 Submitted Project Files</h3>
              <a href={submission.file_path} target="_blank" rel="noreferrer" download
                style={{ display:'flex', alignItems:'center', gap:'var(--space-3)', padding:'var(--space-4)', background:'var(--color-bg)', border:'1px solid var(--color-border)', borderRadius:'var(--radius-lg)', textDecoration:'none', color:'var(--color-success)', fontWeight:'var(--font-medium)', fontSize:'var(--text-sm)', transition:'all .2s', wordBreak:'break-all' }}>
                <span style={{ fontSize:'1.1rem' }}>💾</span> Download/View Submitted Files ↗
              </a>
            </div>
          )}

          {/* Student notes */}
          {submission.notes && (
            <div className="review-card">
              <h3 style={{ fontSize:'var(--text-base)', fontWeight:'var(--font-semibold)', marginBottom:'var(--space-4)' }}>📝 Student's Notes</h3>
              <p style={{ fontSize:'var(--text-sm)', color:'var(--color-text-secondary)', lineHeight:'var(--leading-relaxed)', background:'var(--color-bg)', padding:'var(--space-4)', borderRadius:'var(--radius-lg)', borderLeft:'3px solid var(--color-primary)' }}>
                {submission.notes}
              </p>
            </div>
          )}

          {/* Existing feedback */}
          {submission.feedback && (
            <div className="review-card" style={{ background:'var(--color-success-bg)', border:'1px solid rgba(16,185,129,.2)' }}>
              <h3 style={{ fontSize:'var(--text-base)', fontWeight:'var(--font-semibold)', marginBottom:'var(--space-3)', color:'var(--color-success)' }}>✅ Previous Feedback</h3>
              <p style={{ fontSize:'var(--text-sm)', color:'var(--color-text-secondary)', lineHeight:'var(--leading-relaxed)' }}>{submission.feedback.comment}</p>
              {submission.feedback.rating && (
                <div style={{ marginTop:'var(--space-2)', fontSize:'var(--text-sm)', color:'var(--color-text-muted)' }}>
                  Rating: {'⭐'.repeat(submission.feedback.rating)}
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT — Scoring */}
        <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-5)' }}>
          <div className="review-card card-elevated">
            <h3 style={{ fontSize:'var(--text-base)', fontWeight:'var(--font-semibold)', marginBottom:'var(--space-5)' }}>⭐ Score & Feedback</h3>

            {/* Score slider */}
            <div style={{ textAlign:'center', marginBottom:'var(--space-5)', padding:'var(--space-5)', background:'var(--color-bg)', borderRadius:'var(--radius-xl)' }}>
              <div style={{ fontSize:'var(--text-4xl)', fontWeight:'var(--font-extrabold)', color:scoreColor, lineHeight:1 }}>{score}</div>
              <div style={{ fontSize:'var(--text-xs)', color:'var(--color-text-muted)', marginBottom:'var(--space-4)' }}>out of 100</div>
              <input
                type="range" min={0} max={100} value={score}
                onChange={e => setScore(Number(e.target.value))}
                className="score-slider"
                disabled={isReviewed}
              />
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'var(--text-xs)', color:'var(--color-text-muted)', marginTop:'var(--space-2)' }}>
                <span>0</span>
                <span style={{ color:scoreColor, fontWeight:'var(--font-bold)' }}>{score>=70?'✅ Pass':'❌ Fail'}</span>
                <span>100</span>
              </div>
            </div>

            {/* Feedback */}
            <div style={{ marginBottom:'var(--space-5)' }}>
              <TextareaField
                label="📝 Feedback for Student"
                name="feedback"
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                onBlur={() => {}}
                rows={5}
                maxLength={500}
                placeholder="Provide constructive feedback on the work. What was good? What can improve?"
                disabled={isReviewed}
              />
            </div>

            {/* Actions */}
            {!isReviewed ? (
              <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-3)' }}>
                <button
                  className="btn btn-full"
                  style={{ background:'var(--color-success)', color:'#fff', padding:'var(--space-4)', fontSize:'var(--text-base)', borderRadius:'var(--radius-xl)', boxShadow:'0 4px 14px rgba(16,185,129,.3)', border:'none', cursor:'pointer', fontFamily:'inherit', fontWeight:'var(--font-semibold)', transition:'all .2s' }}
                  onClick={() => handleAction('approve')}
                  disabled={saving}>
                  {saving ? 'Processing...' : '✅ Approve Submission'}
                </button>
                <button
                  className="btn btn-danger btn-full"
                  onClick={() => handleAction('reject')}
                  disabled={saving}>
                  {saving ? 'Processing...' : '❌ Reject Submission'}
                </button>
              </div>
            ) : (
              <div style={{ textAlign:'center', padding:'var(--space-4)', background:'var(--color-bg)', borderRadius:'var(--radius-lg)', fontSize:'var(--text-sm)', color:'var(--color-text-muted)' }}>
                This submission has been <strong>{submission.status}</strong>.
              </div>
            )}
          </div>

          {/* Rubric */}
          <div className="card">
            <h3 style={{ fontSize:'var(--text-sm)', fontWeight:'var(--font-semibold)', marginBottom:'var(--space-3)' }}>📋 Scoring Rubric</h3>
            {[
              { range:'90–100', label:'Excellent',  desc:'Exceeds all requirements', color:'var(--color-success)'  },
              { range:'70–89',  label:'Good',       desc:'Meets all requirements',   color:'var(--color-primary)'  },
              { range:'50–69',  label:'Average',    desc:'Meets most requirements',  color:'var(--color-warning)'  },
              { range:'0–49',   label:'Poor',       desc:'Does not meet standards',  color:'var(--color-error)'    },
            ].map((r,i) => (
              <div key={i} style={{ display:'flex', gap:'var(--space-3)', padding:'var(--space-2) 0', borderBottom: i<3?'1px solid var(--color-border)':'none', fontSize:'var(--text-xs)' }}>
                <span style={{ background:'var(--color-primary-bg)', color:'var(--color-primary)', fontWeight:'var(--font-bold)', padding:'2px 8px', borderRadius:'var(--radius-full)', flexShrink:0 }}>{r.range}</span>
                <div>
                  <span style={{ fontWeight:'var(--font-semibold)', color:r.color }}>{r.label}</span>
                  <span style={{ color:'var(--color-text-muted)' }}> — {r.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubmissionReview