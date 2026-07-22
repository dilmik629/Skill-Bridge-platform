import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Badge from '../../../components/common/Badge'
import Modal from '../../../components/common/Modal'
import Loader from '../../../components/common/Loader'
import useToast from '../../../hooks/useToast.jsx'
import quizService from '../../../services/quizService'
import '../admin.css'

const QuizList = () => {
  const [quizzes,  setQuizzes]  = useState([])
  const [search, setSearch] = useState('')
  const [loading,  setLoading]  = useState(true)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const { success, error } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    quizService.adminGetAll()
      .then(res => setQuizzes(res.data))
      .catch(() => error('Failed to load quizzes.'))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await quizService.adminDelete(deleteId)
      setQuizzes(p => p.filter(q => q.id !== deleteId))
      success('Quiz deleted.')
      setDeleteId(null)
    } catch { error('Delete failed.') }
    finally { setDeleting(false) }
  }
  const filteredQuizzes = quizzes.filter(q =>
    q.project?.title?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <Loader fullPage text="Loading quizzes..." />

  return (
    <div className="admin-page">
      <div className="admin-header animate-fadeInDown">
        <div className="admin-header__left">
          <p className="admin-header__eyebrow">Manage</p>
          <h1 className="admin-header__title">🧠 Quizzes</h1>
          <p className="admin-header__sub">Manage skill assessment quizzes per project.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/admin/quizzes/create')}>➕ New Quiz</button>
      </div>

      <div className="admin-table-wrap animate-fadeInUp">
        <div className="admin-table-toolbar">
          <div className="admin-search">
            <span className="admin-search__icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </span>
            <input placeholder="Search quizzes..." 
            value={search}
            onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <table>
          <thead><tr><th>Project</th><th>Level</th><th>Questions</th><th>Pass Mark</th><th>Attempts</th><th>Pass Rate</th><th>Actions</th></tr></thead>
          <tbody>
            {filteredQuizzes.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign:'center', padding:'var(--space-10)', color:'var(--color-text-muted)' }}>
                {search ? `No quizzes match "${search}"` : 'No quizzes yet. Create one!'}
              </td></tr>
            ) : filteredQuizzes.map(q => {
              const passRate = q.attempts_count > 0
                ? Math.round((q.attempts?.filter(a => a.passed).length / q.attempts_count) * 100)
                : 0

              return (
                <tr key={q.id}>
                  <td style={{ fontWeight:'var(--font-semibold)' }}>{q.project?.title}</td>
                  <td><Badge level={q.project?.level} size="sm" /></td>
                  <td>{q.questions?.length || 0} Qs</td>
                  <td>{q.pass_mark}%</td>
                  <td>{q.attempts_count || 0}</td>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:'var(--space-2)' }}>
                      <div style={{ flex:1, height:6, background:'var(--color-border)', borderRadius:'var(--radius-full)', overflow:'hidden', width:60 }}>
                        <div style={{ height:'100%', background: passRate>=70?'var(--color-success)':'var(--color-warning)', width:`${passRate}%`, borderRadius:'var(--radius-full)' }} />
                      </div>
                      <span style={{ fontSize:'var(--text-xs)', fontWeight:'var(--font-bold)', color: passRate>=70?'var(--color-success)':'var(--color-warning)' }}>{passRate}%</span>
                    </div>
                  </td>
                  <td>
                    <div className="tbl-actions">
                      <button className="tbl-btn" title="Edit" onClick={() => navigate(`/admin/quizzes/${q.id}/edit`)}>✏️</button>
                      <button className="tbl-btn tbl-btn--danger" title="Delete" onClick={() => setDeleteId(q.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      <div className="admin-pagination"><span>Showing {filteredQuizzes.length} of {quizzes.length} quizzes</span></div>
      </div>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="🗑️ Delete Quiz" size="sm">
        <p style={{ color:'var(--color-text-secondary)' }}>Are you sure? All student attempts will also be removed.</p>
        <div className="modal__actions">
          <button className="btn btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button>
          <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>{deleting ? 'Deleting...' : 'Delete'}</button>
        </div>
      </Modal>
    </div>
  )
}

export default QuizList