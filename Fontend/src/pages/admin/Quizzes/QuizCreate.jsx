import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useToast from '../../../hooks/useToast.jsx'
import InputField from '../../../components/forms/InputField'
import SelectField from '../../../components/forms/SelectField'
import Loader from '../../../components/common/Loader'
import quizService from '../../../services/quizService'
import projectService from '../../../services/projectService'
import '../admin.css'

const emptyQ = () => ({ question_text:'', option_a:'', option_b:'', option_c:'', option_d:'', correct_option:'a' })

const QuizCreate = () => {
  const navigate = useNavigate()
  const { success, error } = useToast()
  const [projects,   setProjects]   = useState([])
  const [projectId,  setProjectId]  = useState('')
  const [passmark,   setPassmark]   = useState('70')
  const [cooldown,   setCooldown]   = useState('24')
  const [questions,  setQuestions]  = useState([emptyQ()])
  const [saving,     setSaving]     = useState(false)
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    // A project can only have ONE quiz (backend enforces this with a unique
    // constraint), so projects that already have a quiz must be excluded
    // from this dropdown — otherwise "Create Quiz" fails with a confusing
    // "project id has already been taken" error and no clear reason why.
    Promise.all([projectService.adminGetAll(), quizService.adminGetAll()])
      .then(([projectsRes, quizzesRes]) => {
        const allProjects = projectsRes.data.data || projectsRes.data
        const existingQuizzes = quizzesRes.data.data || quizzesRes.data
        const projectIdsWithQuiz = new Set(existingQuizzes.map(q => q.project_id))

        const available = allProjects.filter(p => !projectIdsWithQuiz.has(p.id))
        setProjects(available.map(p => ({ value: String(p.id), label: p.title })))

        if (available.length === 0 && allProjects.length > 0) {
          error('Every project already has a quiz. Create a new project first, or edit an existing quiz instead.')
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const addQ    = () => setQuestions(p => [...p, emptyQ()])
  const removeQ = (i) => setQuestions(p => p.filter((_,j) => j!==i))
  const updateQ = (i, key, val) => setQuestions(p => p.map((q,j) => j===i ? {...q,[key]:val} : q))

  const handleSave = async () => {
    if (!projectId) return error('Please select a project.')
    if (questions.some(q => !q.question_text.trim())) return error('All questions must have text.')
    if (questions.some(q => !q.option_a || !q.option_b || !q.option_c || !q.option_d)) return error('All options must be filled.')

    setSaving(true)
    try {
      await quizService.adminCreate({
        project_id:             Number(projectId),
        pass_mark:              Number(passmark),
        retake_cooldown_hours:  Number(cooldown),
        questions,
      })
      success('Quiz created! ✅')
      navigate('/admin/quizzes')
    } catch (err) {
      error(err.response?.data?.message || 'Failed to create quiz.')
    } finally { setSaving(false) }
  }

  if (loading) return <Loader fullPage text="Loading..." />

  return (
    <div className="admin-page">
      <div className="admin-header animate-fadeInDown">
        <div className="admin-header__left">
          <p className="admin-header__eyebrow">Quizzes</p>
          <h1 className="admin-header__title">➕ Create Quiz</h1>
          <p className="admin-header__sub">Build a skill assessment quiz for a project.</p>
        </div>
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>← Back</button>
      </div>

      <div className="admin-form-page animate-fadeInUp">

        {/* Settings */}
        <div className="admin-form-section">
          <h3 className="admin-form-section__title">⚙️ Quiz Settings</h3>
          <div className="form-group">
            <SelectField label="Project" name="project_id" value={projectId} onChange={e => setProjectId(e.target.value)} onBlur={() => {}} options={projects} placeholder="Select project..." required />
            <div className="form-row">
              <InputField label="Pass Mark (%)" name="pass_mark" type="number" value={passmark} onChange={e => setPassmark(e.target.value)} onBlur={() => {}} hint="Minimum score to pass (default: 70)" />
              <InputField label="Retake Cooldown (hours)" name="cooldown" type="number" value={cooldown} onChange={e => setCooldown(e.target.value)} onBlur={() => {}} hint="Wait time before retake (default: 24)" />
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="admin-form-section">
          <h3 className="admin-form-section__title">❓ Questions ({questions.length})</h3>

          {questions.map((q, i) => (
            <div className="question-card" key={i}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'var(--space-3)' }}>
                <div className="question-card__num">Question {i + 1}</div>
                {questions.length > 1 && (
                  <button className="tbl-btn tbl-btn--danger" onClick={() => removeQ(i)}>✕</button>
                )}
              </div>

              <textarea
                value={q.question_text}
                onChange={e => updateQ(i, 'question_text', e.target.value)}
                placeholder={`Enter question ${i + 1}...`}
                rows={2}
                style={{ width:'100%', padding:'var(--space-3)', border:'1.5px solid var(--color-border)', borderRadius:'var(--radius-lg)', fontSize:'var(--text-sm)', outline:'none', fontFamily:'inherit', resize:'vertical', marginBottom:'var(--space-3)', transition:'border var(--transition-fast)' }}
                onFocus={e => e.target.style.borderColor='var(--color-primary)'}
                onBlur={e => e.target.style.borderColor='var(--color-border)'}
              />

              <div className="options-grid">
                {['a','b','c','d'].map(opt => (
                  <div className="option-row" key={opt}>
                    <div className="option-letter">{opt.toUpperCase()}</div>
                    <input
                      type="text"
                      value={q[`option_${opt}`]}
                      onChange={e => updateQ(i, `option_${opt}`, e.target.value)}
                      placeholder={`Option ${opt.toUpperCase()}`}
                    />
                    <input
                      type="radio"
                      name={`correct-${i}`}
                      checked={q.correct_option === opt}
                      onChange={() => updateQ(i, 'correct_option', opt)}
                      title="Mark as correct answer"
                    />
                  </div>
                ))}
              </div>
              <p style={{ fontSize:'var(--text-xs)', color:'var(--color-text-muted)', marginTop:'var(--space-2)' }}>
                🔘 Select the radio button next to the correct answer.
              </p>
            </div>
          ))}

          <button type="button" className="btn btn-secondary btn-full" onClick={addQ}>
            ➕ Add Question
          </button>
        </div>

        <div style={{ display:'flex', gap:'var(--space-3)' }}>
          <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>← Cancel</button>
          <button type="button" className="btn btn-primary" style={{ flex:1 }} onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : '✅ Save Quiz'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default QuizCreate