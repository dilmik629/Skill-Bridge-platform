import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Badge from '../../components/common/Badge'
import Loader from '../../components/common/Loader'
import useAuth from '../../hooks/useAuth'
import useToast from '../../hooks/useToast.jsx'
import projectService from '../../services/projectService'
import { ROUTES } from '../../utils/constants'

const ProjectDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, isStudent } = useAuth()
  const { success, error } = useToast()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await projectService.getById(id)
        setProject(res.data)
      } catch { error('Project not found.') ; navigate(ROUTES.PROJECTS) }
      finally { setLoading(false) }
    }
    fetch()
  }, [id])

  const handleApply = async () => {
    if (!isAuthenticated) { navigate(ROUTES.LOGIN, { state:{ from:{ pathname:`/projects/${id}` } } }); return }

    // Already approved/applied — just take them to My Projects, never re-quiz.
    if (project.application_status === 'approved') {
      navigate(ROUTES.MY_PROJECTS)
      return
    }

    // Projects with a quiz: send the student to the quiz first — the quiz
    // page itself creates the approved application once they pass.
    if (project.quiz) {
      navigate(ROUTES.QUIZ.replace(':projectId', id))
      return
    }

    // Projects without a quiz: apply immediately.
    setApplying(true)
    try {
      await projectService.apply(id)
      success('Applied! Check My Projects to get started.')
      navigate(ROUTES.MY_PROJECTS)
    } catch (err) {
      error(err.response?.data?.message || 'Could not apply for this project.')
    } finally {
      setApplying(false)
    }
  }

  if (loading) return <Loader fullPage text="Loading project..." />
  if (!project) return null

  return (
    <div style={{ minHeight:'100vh', background:'var(--color-bg)', padding:'var(--space-10) 0' }}>
      <div className="container" style={{ maxWidth:800 }}>
        <Link to={ROUTES.PROJECTS} style={{ display:'inline-flex', alignItems:'center', gap:'var(--space-2)', fontSize:'var(--text-sm)', color:'var(--color-text-muted)', textDecoration:'none', marginBottom:'var(--space-6)' }}>← Back to Projects</Link>

        {/* Hero */}
        <div className="card card-elevated" style={{ marginBottom:'var(--space-6)' }}>
          <div style={{ display:'flex', alignItems:'flex-start', gap:'var(--space-4)', marginBottom:'var(--space-5)' }}>
            <div style={{ width:60, height:60, background:'var(--color-primary-bg)', borderRadius:'var(--radius-xl)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.8rem', flexShrink:0 }}>
              {project.category?.icon || '📁'}
            </div>
            <div style={{ flex:1 }}>
              <h1 style={{ fontSize:'var(--text-2xl)', fontWeight:'var(--font-bold)', marginBottom:'var(--space-2)' }}>{project.title}</h1>
              <div style={{ display:'flex', gap:'var(--space-2)', flexWrap:'wrap' }}>
                <Badge level={project.level} />
                <Badge status={project.status} />
                {project.category && <Badge label={project.category.name} variant="neutral" />}
              </div>
            </div>
          </div>

          <p style={{ fontSize:'var(--text-base)', color:'var(--color-text-secondary)', lineHeight:'var(--leading-relaxed)', marginBottom:'var(--space-6)' }}>{project.description}</p>

          {/* Info row */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'var(--space-4)', background:'var(--color-bg)', borderRadius:'var(--radius-xl)', padding:'var(--space-5)', marginBottom:'var(--space-6)' }}>
            {[
              { icon:'📅', label:'Deadline',    val: project.deadline },
              { icon:'👥', label:'Students',    val: `${project.approved_count || 0} / ${project.max_students}` },
              { icon:'🧠', label:'Quiz',        val: project.quiz ? `${project.quiz.questions_count || '?'} Questions` : 'No Quiz' },
            ].map((r,i) => (
              <div key={i} style={{ textAlign:'center' }}>
                <div style={{ fontSize:'1.4rem', marginBottom:'var(--space-1)' }}>{r.icon}</div>
                <div style={{ fontSize:'var(--text-lg)', fontWeight:'var(--font-bold)', color:'var(--color-text-primary)' }}>{r.val}</div>
                <div style={{ fontSize:'var(--text-xs)', color:'var(--color-text-muted)' }}>{r.label}</div>
              </div>
            ))}
          </div>

          {/* Tech stack */}
          {project.tech_stack?.length > 0 && (
            <div style={{ marginBottom:'var(--space-6)' }}>
              <h3 style={{ fontSize:'var(--text-sm)', fontWeight:'var(--font-semibold)', marginBottom:'var(--space-3)', color:'var(--color-text-secondary)' }}>🛠️ Tech Stack</h3>
              <div style={{ display:'flex', gap:'var(--space-2)', flexWrap:'wrap' }}>
                {project.tech_stack.map(t => (
                  <span key={t} style={{ background:'var(--color-primary-bg)', color:'var(--color-primary)', border:'1px solid rgba(79,70,229,.2)', padding:'4px 12px', borderRadius:'var(--radius-full)', fontSize:'var(--text-xs)', fontWeight:'var(--font-semibold)' }}>{t}</span>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          {project.status === 'open' ? (
            project.application_status === 'approved' ? (
              <button className="btn btn-full btn-lg" style={{ background:'var(--color-success-bg)', color:'var(--color-success)', border:'1.5px solid var(--color-success)' }} onClick={handleApply}>
                ✅ Already Approved — Go to My Projects
              </button>
            ) : (
              <button className="btn btn-primary btn-full btn-lg" onClick={handleApply} disabled={applying}>
                {project.quiz ? '🧠 Take Quiz to Apply' : '✅ Apply Now'}
              </button>
            )
          ) : (
            <div style={{ textAlign:'center', padding:'var(--space-4)', background:'var(--color-bg)', borderRadius:'var(--radius-lg)', color:'var(--color-text-muted)', fontSize:'var(--text-sm)' }}>
              🔒 This project is no longer accepting applications.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export default ProjectDetail