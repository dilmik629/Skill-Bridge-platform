import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Badge from '../../components/common/Badge'
import Loader from '../../components/common/Loader'
import projectService from '../../services/projectService'
import { ROUTES } from '../../utils/constants'

const LEVELS = ['all','beginner','intermediate','advanced']

const ProjectList = () => {
  const [projects, setProjects] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')
  const [level,    setLevel]    = useState('all')
  const [page,     setPage]     = useState(1)
  const [meta,     setMeta]     = useState(null)

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const res = await projectService.getAll({
        search: search || undefined,
        level:  level  !== 'all' ? level : undefined,
        page,
      })
      setProjects(res.data.data)
      setMeta(res.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProjects() }, [search, level, page])

  return (
    <div style={{ minHeight:'100vh', background:'var(--color-bg)', padding:'var(--space-10) 0' }}>
      <div className="container">

        {/* Header */}
        <div style={{ marginBottom:'var(--space-8)' }}>
          <p style={{ fontSize:'var(--text-xs)', fontWeight:'var(--font-bold)', color:'var(--color-primary)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:'var(--space-2)' }}>Browse</p>
          <h1 style={{ fontSize:'var(--text-4xl)', fontWeight:'var(--font-bold)', marginBottom:'var(--space-3)' }}>🔍 All Projects</h1>
          <p style={{ color:'var(--color-text-muted)' }}>Find projects that match your skills and start building.</p>
        </div>

        {/* Search + Filter */}
        <div style={{ display:'flex', gap:'var(--space-3)', marginBottom:'var(--space-6)', flexWrap:'wrap' }}>
          <div style={{ flex:1, minWidth:240, position:'relative' }}>
            <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--color-text-muted)' }}>🔍</span>
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search projects..."
              style={{ width:'100%', padding:'10px 14px 10px 36px', border:'1.5px solid var(--color-border)', borderRadius:'var(--radius-lg)', fontSize:'var(--text-sm)', outline:'none', fontFamily:'inherit', background:'var(--color-surface)' }}
            />
          </div>
          <div style={{ display:'flex', background:'var(--color-surface)', border:'1px solid var(--color-border)', borderRadius:'var(--radius-xl)', padding:4, gap:4 }}>
            {LEVELS.map(l => (
              <button key={l} onClick={() => { setLevel(l); setPage(1) }}
                style={{ padding:'var(--space-2) var(--space-4)', borderRadius:'var(--radius-lg)', border:'none', cursor:'pointer', fontFamily:'inherit', fontSize:'var(--text-sm)', fontWeight:'var(--font-semibold)', transition:'all .2s',
                  background: level===l ? 'var(--color-primary)' : 'none',
                  color:      level===l ? '#fff' : 'var(--color-text-secondary)',
                }}>
                {l === 'all' ? 'All' : l.charAt(0).toUpperCase() + l.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? <Loader fullPage text="Loading projects..." /> : (
          <>
            {projects.length === 0 ? (
              <div style={{ textAlign:'center', padding:'var(--space-20) 0', color:'var(--color-text-muted)' }}>
                <div style={{ fontSize:'3rem', marginBottom:'var(--space-4)' }}>📭</div>
                <h3 style={{ marginBottom:'var(--space-2)' }}>No projects found</h3>
                <p>Try a different search or filter.</p>
              </div>
            ) : (
              <div className="grid-3">
                {projects.map((p, i) => (
                  <Link key={p.id} to={`/projects/${p.id}`} style={{ textDecoration:'none' }}>
                    <div className="card" style={{ cursor:'pointer', height:'100%', display:'flex', flexDirection:'column', gap:'var(--space-3)', animation:`fadeInUp .4s ease ${i*60}ms both` }}>
                      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
                        <div style={{ width:46, height:46, background:'var(--color-primary-bg)', borderRadius:'var(--radius-lg)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem' }}>
                          {p.category?.icon || '📁'}
                        </div>
                        <Badge status={p.status} size="sm" />
                      </div>
                      <h3 style={{ fontSize:'var(--text-base)', fontWeight:'var(--font-semibold)', color:'var(--color-text-primary)' }}>{p.title}</h3>
                      <p style={{ fontSize:'var(--text-sm)', color:'var(--color-text-muted)', lineHeight:'var(--leading-relaxed)', flex:1 }}>
                        {p.description?.slice(0, 100)}...
                      </p>
                      <div style={{ display:'flex', gap:'var(--space-2)', flexWrap:'wrap' }}>
                        <Badge level={p.level} size="sm" />
                        {p.tech_stack?.slice(0,2).map(t => (
                          <span key={t} style={{ fontSize:'var(--text-xs)', background:'var(--color-bg)', border:'1px solid var(--color-border)', padding:'2px 8px', borderRadius:'var(--radius-full)', color:'var(--color-text-secondary)', fontWeight:'var(--font-medium)' }}>{t}</span>
                        ))}
                      </div>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:'var(--space-3)', borderTop:'1px solid var(--color-border)', fontSize:'var(--text-xs)', color:'var(--color-text-muted)' }}>
                        <span>📅 {p.deadline}</span>
                        <span>👥 {p.approved_count || 0}/{p.max_students}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {meta && meta.last_page > 1 && (
              <div style={{ display:'flex', justifyContent:'center', gap:'var(--space-2)', marginTop:'var(--space-8)' }}>
                {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(p => (
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
    </div>
  )
}
export default ProjectList