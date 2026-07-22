import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Badge from '../../components/common/Badge'
import Avatar from '../../components/common/Avatar'
import Loader from '../../components/common/Loader'
import Modal from '../../components/common/Modal'
import useAuth from '../../hooks/useAuth'
import useToast from '../../hooks/useToast.jsx'
import peerReviewService from '../../services/peerReviewService'
import { ROUTES } from '../../utils/constants'

const STARS = [1,2,3,4,5]

const StarRating = ({ value, onChange, readonly = false }) => (
  <div style={{ display:'flex', gap:4 }}>
    {STARS.map(s => (
      <span key={s}
        onClick={() => !readonly && onChange?.(s)}
        style={{
          fontSize: readonly ? '1rem' : '1.4rem',
          cursor:   readonly ? 'default' : 'pointer',
          color:    s <= value ? '#F59E0B' : '#D1D5DB',
          transition: 'all .15s',
          lineHeight: 1,
        }}
        onMouseEnter={e => { if (!readonly) e.currentTarget.style.transform='scale(1.2)' }}
        onMouseLeave={e => { if (!readonly) e.currentTarget.style.transform='' }}>
        ★
      </span>
    ))}
  </div>
)

const Community = () => {
  const { isAuthenticated, user } = useAuth()
  const { success, error }        = useToast()

  const [submissions, setSubmissions] = useState([])
  const [loading,     setLoading]     = useState(true)
  const [search,      setSearch]      = useState('')
  const [level,       setLevel]       = useState('all')
  const [page,        setPage]        = useState(1)
  const [meta,        setMeta]        = useState(null)

  // Review modal state
  const [reviewing,    setReviewing]    = useState(null) // submission object
  const [rating,       setRating]       = useState(0)
  const [comment,      setComment]      = useState('')
  const [submitting,   setSubmitting]   = useState(false)

  const fetchSubmissions = async () => {
    setLoading(true)
    try {
      const res = await peerReviewService.getApproved({
        search: search || undefined,
        level:  level !== 'all' ? level : undefined,
        page,
      })
      setSubmissions(res.data.data || [])
      setMeta(res.data)
    } catch { error('Failed to load community projects.') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchSubmissions() }, [search, level, page])

  const openReview = (sub) => {
    if (!isAuthenticated) {
      error('Please sign in to leave a review.')
      return
    }
    if (sub.student?.id === user?.id) {
      error('You cannot review your own submission.')
      return
    }
    const mine = sub.peerReviews?.find(pr => pr.reviewer_id === user?.id)
    setReviewing(sub)
    setRating(mine?.rating || 0)
    setComment(mine?.comment || '')
  }

  const myExistingReview = (sub) => sub.peerReviews?.find(pr => pr.reviewer_id === user?.id)

  const submitReview = async () => {
    if (rating === 0) return error('Please select a star rating.')
    setSubmitting(true)
    try {
      await peerReviewService.addReview(reviewing.id, { rating, comment })
      success(myExistingReview(reviewing) ? 'Review updated! ⭐' : 'Review submitted! ⭐')
      setReviewing(null)
      fetchSubmissions()
    } catch (err) {
      error(err.response?.data?.message || 'Review failed.')
    } finally { setSubmitting(false) }
  }

  const deleteReview = async () => {
    setSubmitting(true)
    try {
      await peerReviewService.removeReview(reviewing.id)
      success('Review deleted.')
      setReviewing(null)
      fetchSubmissions()
    } catch (err) {
      error(err.response?.data?.message || 'Failed to delete review.')
    } finally { setSubmitting(false) }
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--color-bg)', padding:'var(--space-10) 0' }}>
      <div className="container">

        {/* Header */}
        <div style={{ marginBottom:'var(--space-8)' }}>
          <p style={{ fontSize:'var(--text-xs)', fontWeight:'var(--font-bold)', color:'var(--color-primary)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:'var(--space-2)' }}>
            Community
          </p>
          <h1 style={{ fontSize:'var(--text-4xl)', fontWeight:'var(--font-bold)', marginBottom:'var(--space-3)', letterSpacing:'-.02em' }}>
            🌟 Project Showcase
          </h1>
          <p style={{ color:'var(--color-text-muted)', fontSize:'var(--text-base)' }}>
            Browse approved student projects, explore their GitHub repos, and leave peer reviews.
          </p>
        </div>

        {/* Search + Filter */}
        <div style={{ display:'flex', gap:'var(--space-3)', marginBottom:'var(--space-6)', flexWrap:'wrap' }}>
          <div style={{ flex:1, minWidth:240, position:'relative' }}>
            <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--color-text-muted)' }}>🔍</span>
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search projects..."
              style={{ width:'100%', padding:'10px 14px 10px 36px', border:'1.5px solid var(--color-border)', borderRadius:'var(--radius-lg)', fontSize:'var(--text-sm)', outline:'none', fontFamily:'inherit', background:'var(--color-surface)' }}
            />
          </div>
          <div style={{ display:'flex', background:'var(--color-surface)', border:'1px solid var(--color-border)', borderRadius:'var(--radius-xl)', padding:4, gap:4 }}>
            {['all','beginner','intermediate','advanced'].map(l => (
              <button key={l} onClick={() => { setLevel(l); setPage(1) }}
                style={{ padding:'var(--space-2) var(--space-4)', borderRadius:'var(--radius-lg)', border:'none', cursor:'pointer', fontFamily:'inherit', fontSize:'var(--text-sm)', fontWeight:'var(--font-semibold)', transition:'all .2s',
                  background: level===l ? 'var(--color-primary)' : 'none',
                  color:      level===l ? '#fff' : 'var(--color-text-secondary)',
                }}>
                {l === 'all' ? 'All' : l.charAt(0).toUpperCase()+l.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? <Loader fullPage text="Loading community projects..." /> : (
          <>
            {submissions.length === 0 ? (
              <div style={{ textAlign:'center', padding:'var(--space-20) 0', color:'var(--color-text-muted)' }}>
                <div style={{ fontSize:'3rem', marginBottom:'var(--space-4)' }}>📭</div>
                <h3 style={{ marginBottom:'var(--space-2)' }}>No projects yet</h3>
                <p>Be the first to complete a project!</p>
              </div>
            ) : (
              <div className="grid-3">
                {submissions.map((s, i) => (
                  <div key={s.id} className="card" style={{ display:'flex', flexDirection:'column', gap:'var(--space-3)', animation:`fadeInUp .4s ease ${i*60}ms both` }}>

                    {/* Student */}
                    <div style={{ display:'flex', alignItems:'center', gap:'var(--space-3)' }}>
                      <Avatar name={s.student?.name} size="sm" />
                      <div>
                        <div style={{ fontSize:'var(--text-sm)', fontWeight:'var(--font-semibold)' }}>{s.student?.name}</div>
                        {s.student?.github_username && (
                          <a href={`https://github.com/${s.student.github_username}`} target="_blank" rel="noreferrer"
                            style={{ fontSize:'var(--text-xs)', color:'var(--color-text-muted)', textDecoration:'none' }}>
                            🐙 @{s.student.github_username}
                          </a>
                        )}
                      </div>
                      <Badge level={s.project?.level} size="sm" style={{ marginLeft:'auto' }} />
                    </div>

                    {/* Project */}
                    <div>
                      <h3 style={{ fontSize:'var(--text-base)', fontWeight:'var(--font-semibold)', marginBottom:'var(--space-1)' }}>
                        {s.project?.title}
                      </h3>
                      <span style={{ fontSize:'var(--text-xs)', color:'var(--color-text-muted)' }}>
                        {s.project?.category?.icon} {s.project?.category?.name}
                      </span>
                    </div>

                    {/* Tech stack */}
                    {s.project?.tech_stack?.length > 0 && (
                      <div style={{ display:'flex', gap:'var(--space-1)', flexWrap:'wrap' }}>
                        {s.project.tech_stack.slice(0,3).map(t => (
                          <span key={t} style={{ fontSize:'var(--text-xs)', background:'var(--color-primary-bg)', color:'var(--color-primary)', border:'1px solid rgba(124, 58, 237,.15)', padding:'2px 8px', borderRadius:'var(--radius-full)', fontWeight:'var(--font-semibold)' }}>{t}</span>
                        ))}
                      </div>
                    )}

                    {/* Ratings */}
                    <div style={{ display:'flex', alignItems:'center', gap:'var(--space-3)', padding:'var(--space-3) 0', borderTop:'1px solid var(--color-border)' }}>
                      <StarRating value={Math.round(s.peer_reviews_avg_rating || 0)} readonly />
                      <span style={{ fontSize:'var(--text-xs)', color:'var(--color-text-muted)' }}>
                        {s.peer_reviews_avg_rating ? Number(s.peer_reviews_avg_rating).toFixed(1) : '—'}
                        {' '}({s.peer_reviews_count || 0} reviews)
                      </span>
                    </div>

                    {/* Actions */}
                    <div style={{ display:'flex', gap:'var(--space-2)' }}>
                      <a href={s.github_url} target="_blank" rel="noreferrer"
                        className="btn btn-ghost btn-sm"
                        style={{ flex:1, textDecoration:'none', textAlign:'center' }}>
                        🐙 GitHub
                      </a>
                      <button
                        className="btn btn-primary btn-sm"
                        style={{ flex:1 }}
                        onClick={() => openReview(s)}
                        disabled={s.student?.id === user?.id}>
                        {s.student?.id === user?.id
                          ? '⭐ Your Project'
                          : myExistingReview(s) ? '✏️ Edit Review' : '⭐ Review'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {meta && meta.last_page > 1 && (
              <div style={{ display:'flex', justifyContent:'center', gap:'var(--space-2)', marginTop:'var(--space-8)' }}>
                {Array.from({ length: meta.last_page }, (_,i) => i+1).map(p => (
                  <button key={p} onClick={() => setPage(p)}
                    style={{ width:36, height:36, borderRadius:'var(--radius-md)', border:'1.5px solid var(--color-border)', cursor:'pointer', fontFamily:'inherit', fontSize:'var(--text-sm)', transition:'all .2s',
                      background: page===p ? 'var(--color-primary)' : 'var(--color-surface)',
                      color:      page===p ? '#fff' : 'var(--color-text-secondary)',
                      borderColor:page===p ? 'var(--color-primary)' : 'var(--color-border)',
                    }}>{p}</button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Review Modal */}
      <Modal isOpen={!!reviewing} onClose={() => setReviewing(null)} title={reviewing && myExistingReview(reviewing) ? '✏️ Edit Your Review' : '⭐ Leave a Peer Review'} size="md">
        {reviewing && (
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:'var(--space-3)', padding:'var(--space-4)', background:'var(--color-bg)', borderRadius:'var(--radius-lg)', marginBottom:'var(--space-5)' }}>
              <Avatar name={reviewing.student?.name} size="sm" />
              <div>
                <div style={{ fontSize:'var(--text-sm)', fontWeight:'var(--font-semibold)' }}>{reviewing.student?.name}</div>
                <div style={{ fontSize:'var(--text-xs)', color:'var(--color-text-muted)' }}>{reviewing.project?.title}</div>
              </div>
            </div>

            {/* Star rating */}
            <div style={{ marginBottom:'var(--space-5)', textAlign:'center' }}>
              <p style={{ fontSize:'var(--text-sm)', fontWeight:'var(--font-semibold)', marginBottom:'var(--space-3)', color:'var(--color-text-secondary)' }}>
                How would you rate this project?
              </p>
              <div style={{ display:'flex', justifyContent:'center', gap:8, marginBottom:'var(--space-2)' }}>
                <StarRating value={rating} onChange={setRating} />
              </div>
              <p style={{ fontSize:'var(--text-xs)', color:'var(--color-text-muted)' }}>
                {rating === 0 && 'Select a rating'}
                {rating === 1 && '😔 Needs improvement'}
                {rating === 2 && '😐 Below average'}
                {rating === 3 && '🙂 Average'}
                {rating === 4 && '😊 Good work!'}
                {rating === 5 && '🤩 Excellent!'}
              </p>
            </div>

            {/* Comment */}
            <div className="form-field" style={{ marginBottom:'var(--space-5)' }}>
              <label className="form-label">💬 Comment (Optional)</label>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                maxLength={500}
                rows={4}
                placeholder="What did you think of this project? What was done well? What could be improved?"
                style={{ width:'100%', padding:'var(--space-3)', border:'1.5px solid var(--color-border)', borderRadius:'var(--radius-lg)', fontSize:'var(--text-sm)', outline:'none', fontFamily:'inherit', resize:'vertical', transition:'border .2s' }}
                onFocus={e => e.target.style.borderColor='var(--color-primary)'}
                onBlur={e => e.target.style.borderColor='var(--color-border)'}
              />
              <div style={{ fontSize:'var(--text-xs)', color:'var(--color-text-muted)', marginTop:4, textAlign:'right' }}>
                {comment.length}/500
              </div>
            </div>

            <div className="modal__actions" style={{ justifyContent: myExistingReview(reviewing) ? 'space-between' : 'flex-end' }}>
              {myExistingReview(reviewing) && (
                <button className="btn btn-danger" onClick={deleteReview} disabled={submitting}>
                  🗑️ Delete Review
                </button>
              )}
              <div style={{ display:'flex', gap:'var(--space-3)' }}>
                <button className="btn btn-ghost" onClick={() => setReviewing(null)}>Cancel</button>
                <button className="btn btn-primary" onClick={submitReview} disabled={submitting || rating === 0}>
                  {submitting ? 'Saving...' : myExistingReview(reviewing) ? '💾 Update Review' : '⭐ Submit Review'}
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default Community