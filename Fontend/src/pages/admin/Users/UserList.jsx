import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Avatar from '../../../components/common/Avatar'
import Badge from '../../../components/common/Badge'
import Modal from '../../../components/common/Modal'
import Loader from '../../../components/common/Loader'
import useToast from '../../../hooks/useToast.jsx'
import dashboardService from '../../../services/dashboardService'
import '../admin.css'

const UserList = () => {
  const [users,    setUsers]    = useState([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const { success, error } = useToast()

  useEffect(() => {
    dashboardService.getUsers()
      .then(res => setUsers(res.data.data || res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await dashboardService.deleteUser(deleteId)
      setUsers(p => p.filter(u => u.id !== deleteId))
      success('User removed from platform.')
      setDeleteId(null)
    } catch { error('Delete failed.') }
    finally { setDeleting(false) }
  }

  if (loading) return <Loader fullPage text="Loading users..." />

  return (
    <div className="admin-page">
      <div className="admin-header animate-fadeInDown">
        <div className="admin-header__left">
          <p className="admin-header__eyebrow">Manage</p>
          <h1 className="admin-header__title">👥 Users</h1>
          <p className="admin-header__sub">{users.length} registered students on the platform.</p>
        </div>
      </div>

      <div className="admin-stats animate-fadeInUp" style={{ gridTemplateColumns:'repeat(3,1fr)' }}>
        {[
          { icon:'👥', label:'Total Students', num: users.length,                                                     color:'indigo' },
          { icon:'🟢', label:'Active',         num: users.filter(u => u.submissions_count > 0 || u.applications_count > 0).length, color:'green'  },
          { icon:'⚡', label:'Avg Points',     num: users.length ? Math.round(users.reduce((a,u) => a+(u.skill_points||0), 0) / users.length) : 0, color:'amber'  },
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
            <input placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        <table>
          <thead><tr><th>Student</th><th>Points</th><th>Submissions</th><th>Applications</th><th>Joined</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign:'center', padding:'var(--space-10)', color:'var(--color-text-muted)' }}>No students found.</td></tr>
            ) : filtered.map(u => (
              <tr key={u.id}>
                <td>
                  <div style={{ display:'flex', alignItems:'center', gap:'var(--space-3)' }}>
                    <Avatar src={u.avatar} name={u.name} size="sm" />
                    <div>
                      <div style={{ fontWeight:'var(--font-semibold)' }}>{u.name}</div>
                      <div style={{ fontSize:'var(--text-xs)', color:'var(--color-text-muted)' }}>{u.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ fontWeight:'var(--font-bold)', color:'var(--color-primary)' }}>{u.skill_points || 0}</td>
                <td style={{ color:'var(--color-text-secondary)' }}>{u.submissions_count || 0}</td>
                <td style={{ color:'var(--color-text-secondary)' }}>{u.applications_count || 0}</td>
                <td style={{ color:'var(--color-text-muted)', fontSize:'var(--text-xs)' }}>
                  {new Date(u.created_at).toLocaleDateString()}
                </td>
                <td>
                  <div className="tbl-actions">
                    <Link to={`/admin/users/${u.id}`} className="tbl-btn" title="View">👁️</Link>
                    <button className="tbl-btn tbl-btn--danger" title="Remove" onClick={() => setDeleteId(u.id)}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="admin-pagination">
          <span>Showing {filtered.length} of {users.length} students</span>
        </div>
      </div>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="🗑️ Remove User" size="sm">
        <p style={{ color:'var(--color-text-secondary)', lineHeight:'var(--leading-relaxed)' }}>
          Remove this student from SkillBridge? Their submissions and progress will be permanently deleted.
        </p>
        <div className="modal__actions">
          <button className="btn btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button>
          <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>{deleting ? 'Removing...' : 'Remove'}</button>
        </div>
      </Modal>
    </div>
  )
}

export default UserList