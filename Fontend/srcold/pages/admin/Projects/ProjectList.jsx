import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Badge from '../../../components/common/Badge'
import Modal from '../../../components/common/Modal'
import Loader from '../../../components/common/Loader'
import useToast from '../../../hooks/useToast.jsx'
import projectService from '../../../services/projectService'
import { ROUTES } from '../../../utils/constants'
import '../admin.css'

const ProjectList = () => {
  const [projects,  setProjects]  = useState([])
  const [loading,   setLoading]   = useState(true)
  const [search,    setSearch]    = useState('')
  const [filter,    setFilter]    = useState('all')
  const [deleteId,  setDeleteId]  = useState(null)
  const [deleting,  setDeleting]  = useState(false)
  const { success, error } = useToast()
  const navigate = useNavigate()

  const fetchProjects = () => {
    setLoading(true)
    projectService.adminGetAll({ search: search || undefined, status: filter !== 'all' ? filter : undefined })
      .then(res => setProjects(res.data.data || res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchProjects() }, [search, filter])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await projectService.adminDelete(deleteId)
      setProjects(p => p.filter(x => x.id !== deleteId))
      success('Project deleted successfully.')
      setDeleteId(null)
    } catch { error('Delete failed.') }
    finally { setDeleting(false) }
  }

  if (loading) return <Loader fullPage text="Loading projects..." />

  return (
    <div className="admin-page">
      <div className="admin-header animate-fadeInDown">
        <div className="admin-header__left">
          <p className="admin-header__eyebrow">Manage</p>
          <h1 className="admin-header__title">📁 Projects</h1>
          <p className="admin-header__sub">{projects.length} total projects on the platform.</p>
        </div>
        <Link to="/admin/projects/create" className="btn btn-primary">➕ New Project</Link>
      </div>

      <div className="admin-stats animate-fadeInUp" style={{ gridTemplateColumns:'repeat(3,1fr)' }}>
        {[
          { icon:'📁', label:'Total',  num: projects.length,                                          color:'indigo' },
          { icon:'🟢', label:'Open',   num: projects.filter(p=>p.status==='open').length,             color:'green'  },
          { icon:'🔒', label:'Closed', num: projects.filter(p=>p.status==='closed').length,           color:'amber'  },
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
            <input placeholder="Search projects..." value={search} onChange={e=>setSearch(e.target.value)} />
          </div>
          <select className="admin-filter" value={filter} onChange={e=>setFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="in_progress">In Progress</option>
          </select>
        </div>

        <table>
          <thead><tr><th>Project</th><th>Category</th><th>Level</th><th>Students</th><th>Deadline</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {projects.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign:'center', padding:'var(--space-10)', color:'var(--color-text-muted)' }}>No projects found.</td></tr>
            ) : projects.map(p => (
              <tr key={p.id}>
                <td><div style={{ fontWeight:'var(--font-semibold)' }}>{p.title}</div></td>
                <td><span style={{ fontSize:'var(--text-xs)', background:'var(--color-bg)', border:'1px solid var(--color-border)', padding:'2px 10px', borderRadius:'var(--radius-full)', color:'var(--color-text-secondary)', fontWeight:'var(--font-medium)' }}>{p.category?.name}</span></td>
                <td><Badge level={p.level} size="sm" /></td>
                <td>
                  <div style={{ display:'flex', alignItems:'center', gap:'var(--space-2)' }}>
                    <div style={{ flex:1, height:6, background:'var(--color-border)', borderRadius:'var(--radius-full)', overflow:'hidden', width:60 }}>
                      <div style={{ height:'100%', background:'var(--color-primary)', width:`${((p.approved_count||0)/p.max_students)*100}%`, borderRadius:'var(--radius-full)' }} />
                    </div>
                    <span style={{ fontSize:'var(--text-xs)', color:'var(--color-text-muted)' }}>{p.approved_count||0}/{p.max_students}</span>
                  </div>
                </td>
                <td style={{ color:'var(--color-text-muted)' }}>📅 {p.deadline}</td>
                <td><Badge status={p.status} size="sm" /></td>
                <td>
                  <div className="tbl-actions">
                    <button className="tbl-btn" title="Edit" onClick={() => navigate(`/admin/projects/${p.id}/edit`)}>✏️</button>
                    <button className="tbl-btn tbl-btn--danger" title="Delete" onClick={() => setDeleteId(p.id)}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="admin-pagination"><span>Showing {projects.length} projects</span></div>
      </div>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="🗑️ Delete Project" size="sm">
        <p style={{ color:'var(--color-text-secondary)', lineHeight:'var(--leading-relaxed)' }}>Are you sure? All related quizzes and submissions will also be removed.</p>
        <div className="modal__actions">
          <button className="btn btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button>
          <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>{deleting ? 'Deleting...' : '🗑️ Delete'}</button>
        </div>
      </Modal>
    </div>
  )
}

export default ProjectList