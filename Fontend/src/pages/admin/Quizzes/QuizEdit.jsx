import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useToast from '../../../hooks/useToast.jsx'
import Loader from '../../../components/common/Loader'
import quizService from '../../../services/quizService'
import '../admin.css'

const emptyQ = () => ({ question_text:'', option_a:'', option_b:'', option_c:'', option_d:'', correct_option:'a' })

const QuizEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { success, error } = useToast()
  const [quiz,      setQuiz]      = useState(null)
  const [questions, setQuestions] = useState([])
  const [passmark,  setPassmark]  = useState('70')
  const [cooldown,  setCooldown]  = useState('24')
  const [loading,   setLoading]   = useState(true)
  const [saving,    setSaving]    = useState(false)

  useEffect(() => {
    quizService.adminGetAll()
      .then(res => {
        const q = res.data.find(q => q.id === Number(id))
        if (!q) { error('Quiz not found.'); navigate('/admin/quizzes'); return }
        setQuiz(q)
        setPassmark(String(q.pass_mark))
        setCooldown(String(q.retake_cooldown_hours))
        setQuestions(q.questions?.map(({ id, question_text, option_a, option_b, option_c, option_d, correct_option }) =>
          ({ id, question_text, option_a, option_b, option_c, option_d, correct_option })
        ) || [])
      })
      .catch(() => { error('Failed to load quiz.'); navigate('/admin/quizzes') })
      .finally(() => setLoading(false))
  }, [id])

  const updateQ = (i, key, val) => setQuestions(p => p.map((q,j) => j===i ? {...q,[key]:val} : q))
  const addQ    = () => setQuestions(p => [...p, emptyQ()])
  const removeQ = (i) => setQuestions(p => p.filter((_,j) => j!==i))

  const handleSave = async () => {
    if (questions.length === 0) return error('A quiz needs at least one question.')
    if (questions.some(q => !q.question_text.trim())) return error('All questions must have text.')
    if (questions.some(q => !q.option_a?.trim() || !q.option_b?.trim() || !q.option_c?.trim() || !q.option_d?.trim())) return error('All options must be filled.')
    setSaving(true)
    try {
      await quizService.adminUpdate(id, {
        pass_mark: Number(passmark),
        retake_cooldown_hours: Number(cooldown),
        questions,
      })
      success('Quiz updated! ✅')
      navigate('/admin/quizzes')
    } catch (err) {
      error(err.response?.data?.message || 'Update failed.')
    } finally { setSaving(false) }
  }

  if (loading) return <Loader fullPage text="Loading quiz..." />

  return (
    <div className="admin-page">
      <div className="admin-header animate-fadeInDown">
        <div className="admin-header__left">
          <p className="admin-header__eyebrow">Quizzes</p>
          <h1 className="admin-header__title">✏️ Edit Quiz</h1>
          <p className="admin-header__sub">Update quiz for: {quiz?.project?.title}</p>
        </div>
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>← Back</button>
      </div>

      <div className="admin-form-page animate-fadeInUp">
        <div className="admin-form-section">
          <h3 className="admin-form-section__title">⚙️ Settings</h3>
          <div className="form-row">
            <div className="form-field">
              <label className="form-label">Pass Mark (%)</label>
              <input type="number" className="form-input" value={passmark} onChange={e => setPassmark(e.target.value)} />
            </div>
            <div className="form-field">
              <label className="form-label">Retake Cooldown (hours)</label>
              <input type="number" className="form-input" value={cooldown} onChange={e => setCooldown(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="admin-form-section">
          <h3 className="admin-form-section__title">❓ Questions ({questions.length})</h3>
          {questions.map((q, i) => (
            <div className="question-card" key={q.id ?? `new-${i}`}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'var(--space-3)' }}>
                <div className="question-card__num">Question {i + 1}</div>
                {questions.length > 1 && (
                  <button type="button" className="tbl-btn tbl-btn--danger" title="Remove question" onClick={() => removeQ(i)}>✕</button>
                )}
              </div>
              <textarea
                value={q.question_text}
                onChange={e => updateQ(i, 'question_text', e.target.value)}
                placeholder={`Enter question ${i + 1}...`}
                rows={2}
                style={{ width:'100%', padding:'var(--space-3)', border:'1.5px solid var(--color-border)', borderRadius:'var(--radius-lg)', fontSize:'var(--text-sm)', outline:'none', fontFamily:'inherit', resize:'vertical', marginBottom:'var(--space-3)' }}
              />
              <div className="options-grid">
                {['a','b','c','d'].map(opt => (
                  <div className="option-row" key={opt}>
                    <div className="option-letter">{opt.toUpperCase()}</div>
                    <input type="text" value={q[`option_${opt}`]} onChange={e => updateQ(i, `option_${opt}`, e.target.value)} placeholder={`Option ${opt.toUpperCase()}`} />
                    <input type="radio" name={`correct-${i}`} checked={q.correct_option === opt} onChange={() => updateQ(i, 'correct_option', opt)} title="Mark as correct answer" />
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
          <button className="btn btn-ghost" onClick={() => navigate(-1)}>← Cancel</button>
          <button className="btn btn-primary" style={{ flex:1 }} onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : '💾 Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default QuizEdit