import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useForm from '../../hooks/useForm'
import useToast from '../../hooks/useToast.jsx'
import InputField from '../../components/forms/InputField'
import TextareaField from '../../components/forms/TextareaField'
import Loader from '../../components/common/Loader'
import submissionService from '../../services/submissionService'
import { submissionRules } from '../../utils/validators'
import { ROUTES } from '../../utils/constants'
import './student.css'

const SubmitProject = () => {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const { success, error } = useToast()
  const [existing, setExisting] = useState(null) // the student's own pending submission for this project, if any
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    submissionService.getMine()
      .then(res => {
        const sub = res.data.find(s => s.project_id === Number(projectId) && s.status === 'submitted')
        setExisting(sub || null)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [projectId])

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit, reset } = useForm({
    initialValues: { github_url:'', notes:'' },
    rules: submissionRules,
    onSubmit: async (vals) => {
      try {
        if (existing) {
          await submissionService.update(existing.id, vals)
          success('Submission updated! ✅')
        } else {
          await submissionService.submit(projectId, vals)
          success('Project submitted successfully! 🎉 Admin will review it soon.')
        }
        navigate(ROUTES.MY_PROJECTS)
      } catch (err) {
        error(err.response?.data?.message || 'Submission failed. Please try again.')
      }
    }
  })

  // useForm only seeds its state from initialValues on first mount, so once
  // the existing submission (if any) has loaded asynchronously, push it
  // into the form explicitly.
  useEffect(() => {
    if (existing) reset({ github_url: existing.github_url || '', notes: existing.notes || '' })
  }, [existing])

  if (loading) return <Loader fullPage text="Loading..." />

  return (
    <div className="student-page">
      <div className="container" style={{ maxWidth:640 }}>
        <div className="page-header animate-fadeInDown">
          <p className="page-header__eyebrow">Project Submission</p>
          <h1 className="page-header__title">{existing ? '✏️ Edit Your Submission' : '📤 Submit Your Work'}</h1>
          <p className="page-header__subtitle">
            {existing
              ? 'You can update your repo link and notes until the admin reviews it.'
              : 'Share your GitHub repo and notes for the admin reviewer.'}
          </p>
        </div>
        <div className="card card-elevated animate-fadeInUp">
          <form onSubmit={handleSubmit} noValidate className="form-group">
            <InputField label="🔗 GitHub Repository URL" name="github_url" type="url" value={values.github_url} error={errors.github_url} touched={touched.github_url} onChange={handleChange} onBlur={handleBlur} placeholder="https://github.com/yourusername/project-name" hint="Make sure the repo is public" required />
            <TextareaField label="📝 Notes for Admin (Optional)" name="notes" value={values.notes} error={errors.notes} touched={touched.notes} onChange={handleChange} onBlur={handleBlur} placeholder="Describe what you built, challenges, features..." rows={5} maxLength={500} />
            <div style={{ display:'flex', gap:'var(--space-3)' }}>
              <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>← Cancel</button>
              <button type="submit" className="btn btn-primary" style={{ flex:1 }} disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : (existing ? '💾 Save Changes' : '🚀 Submit Project')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
export default SubmitProject