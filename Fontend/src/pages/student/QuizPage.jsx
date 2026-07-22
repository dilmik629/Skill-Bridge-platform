import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Loader from '../../components/common/Loader'
import useToast from '../../hooks/useToast.jsx'
import quizService from '../../services/quizService'
import projectService from '../../services/projectService'
import { ROUTES } from '../../utils/constants'
import './student.css'

const fmt = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`

const QuizPage = () => {
  const { projectId } = useParams()
  const navigate      = useNavigate()
  const { error, info } = useToast()

  const [quiz,       setQuiz]       = useState(null)
  const [questions,  setQuestions]  = useState([])
  const [loading,    setLoading]    = useState(true)
  const [current,    setCurrent]    = useState(0)
  const [answers,    setAnswers]    = useState({})
  const [timeLeft,   setTimeLeft]   = useState(30 * 60)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    quizService.getQuiz(projectId)
      .then(res => {
        setQuiz(res.data)
        setQuestions(res.data.questions || [])
        setTimeLeft(res.data.questions?.length * 90 || 30 * 60)
      })
      .catch(err => {
        if (err.response?.data?.already_applied) {
          info(err.response.data.message || "You've already been approved for this project.")
          navigate(ROUTES.MY_PROJECTS)
        } else {
          error(err.response?.data?.message || 'Quiz not available.')
          navigate(ROUTES.PROJECTS)
        }
      })
      .finally(() => setLoading(false))
  }, [projectId])

  const handleSubmit = useCallback(async () => {
    if (submitting) return
    setSubmitting(true)
    try {
      const res = await quizService.submit(quiz.id, answers)

      // If the student passed, immediately create/approve their project
      // application so it shows up on "My Projects" as in-progress.
      // 409 = already applied (e.g. retake after already passing) — safe to ignore.
      if (res.data.passed) {
        try {
          await projectService.apply(projectId)
        } catch (applyErr) {
          if (applyErr.response?.status !== 409) {
            console.error('Auto-apply after quiz pass failed:', applyErr)
          }
        }
      }

      navigate(ROUTES.QUIZ_RESULT.replace(':projectId', projectId), {
        state: { ...res.data, projectTitle: quiz.project?.title, projectId }
      })
    } catch (err) {
      error('Submission failed. Please try again.')
      setSubmitting(false)
    }
  }, [quiz, answers, submitting])

  useEffect(() => {
    if (!quiz || submitting) return
    const t = setInterval(() => {
      setTimeLeft(p => {
        if (p <= 1) { clearInterval(t); handleSubmit(); return 0 }
        return p - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [quiz, submitting, handleSubmit])

  if (loading) return <Loader fullPage text="Loading quiz..." />
  if (!quiz || questions.length === 0) return (
    <div style={{ textAlign:'center', padding:'var(--space-20)', color:'var(--color-text-muted)' }}>
      <div style={{ fontSize:'3rem', marginBottom:'var(--space-4)' }}>🧠</div>
      <h3>No questions found for this quiz.</h3>
    </div>
  )

  const q        = questions[current]
  const progress = Math.round(((current + 1) / questions.length) * 100)
  const isWarn   = timeLeft < 5 * 60

  return (
    <div className="student-page">
      <div className="container">
        <div className="quiz-wrap animate-fadeInUp">
          <div className="quiz-header">
            <div className="quiz-header__meta">
              <div className="quiz-q-count">Question {current+1} of {questions.length}</div>
              <div className={`quiz-timer ${isWarn?'quiz-timer--warn':''}`}>{isWarn?'⚠️':'⏱️'} {fmt(timeLeft)}</div>
            </div>
            <div className="quiz-header__title">🧠 {quiz.project?.title} — Skill Quiz</div>
            <div className="quiz-progress-bar">
              <div className="quiz-progress-bar__fill" style={{ width:`${progress}%` }} />
            </div>
          </div>

          <div className="quiz-body">
            <p className="quiz-question">{current+1}. {q.question_text}</p>
            <div className="quiz-options">
              {['a','b','c','d'].map(opt => (
                <div key={opt}
                  className={`quiz-option ${answers[q.id]===opt?'quiz-option--selected':''}`}
                  onClick={() => setAnswers(p => ({...p, [q.id]: opt}))}>
                  <div className="quiz-option__letter">{opt.toUpperCase()}</div>
                  <div className="quiz-option__text">{q[`option_${opt}`]}</div>
                </div>
              ))}
            </div>

            <div className="quiz-nav">
              <button className="btn btn-ghost" onClick={() => setCurrent(p => Math.max(0, p-1))} disabled={current===0}>← Previous</button>
              <div className="quiz-dots">
                {questions.map((_,i) => (
                  <div key={i} onClick={() => setCurrent(i)}
                    className={`quiz-dot ${i===current?'quiz-dot--current':answers[questions[i].id]!==undefined?'quiz-dot--answered':''}`} />
                ))}
              </div>
              {current < questions.length-1
                ? <button className="btn btn-primary" onClick={() => setCurrent(p => p+1)}>Next →</button>
                : <button className="btn btn-primary" style={{ background:'var(--color-success)' }}
                    onClick={handleSubmit} disabled={submitting}>
                    {submitting ? 'Submitting...' : '✅ Submit Quiz'}
                  </button>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default QuizPage