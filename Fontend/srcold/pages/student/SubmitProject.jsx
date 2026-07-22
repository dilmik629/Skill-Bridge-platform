import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useForm from '../../hooks/useForm'
import useToast from '../../hooks/useToast.jsx'
import InputField from '../../components/forms/InputField'
import TextareaField from '../../components/forms/TextareaField'
import submissionService from '../../services/submissionService'
import { submissionRules } from '../../utils/validators'
import { ROUTES } from '../../utils/constants'
import './student.css'

const SubmitProject = () => {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const { success, error } = useToast()
  const [file, setFile] = useState(null)

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } = useForm({
    initialValues: { github_url:'', notes:'' },
    rules: submissionRules,
    onSubmit: async (vals) => {
      try {
        await submissionService.submit(projectId, { ...vals, file })
        success('Project submitted successfully! 🎉 Admin will review it soon.')
        navigate(ROUTES.MY_PROJECTS)
      } catch (err) {
        error(err.response?.data?.message || 'Submission failed. Please try again.')
      }
    }
  })

  return (
    <div className="student-page">
      <div className="container" style={{ maxWidth:640 }}>
        <div className="page-header animate-fadeInDown">
          <p className="page-header__eyebrow">Project Submission</p>
          <h1 className="page-header__title">📤 Submit Your Work</h1>
          <p className="page-header__subtitle">Share your GitHub repo, files, and notes for the admin reviewer.</p>
        </div>
        <div className="card card-elevated animate-fadeInUp">
          <form onSubmit={handleSubmit} noValidate className="form-group">
            <InputField label="🔗 GitHub Repository URL" name="github_url" type="url" value={values.github_url} error={errors.github_url} touched={touched.github_url} onChange={handleChange} onBlur={handleBlur} placeholder="https://github.com/yourusername/project-name" hint="Make sure the repo is public" required />
            
            <div className="form-field" style={{ marginBottom:'var(--space-5)' }}>
              <label className="form-label" style={{ display:'block', marginBottom:'var(--space-2)', fontWeight:'var(--font-semibold)', fontSize:'var(--text-sm)' }}>📁 Upload Project Files (Zip/PDF/Doc/Image, optional)</label>
              <input type="file" onChange={e => setFile(e.target.files[0])}
                style={{ width:'100%', padding:'var(--space-3)', border:'1.5px dashed var(--color-border)', borderRadius:'var(--radius-lg)', fontSize:'var(--text-sm)', outline:'none', fontFamily:'inherit', background:'var(--color-surface)' }} />
              <p style={{ fontSize:'var(--text-xs)', color:'var(--color-text-muted)', marginTop:4 }}>
                Maximum size: 10MB. Supported formats: .zip, .rar, .pdf, .doc, .docx, images.
              </p>
            </div>

            <TextareaField label="📝 Notes for Admin (Optional)" name="notes" value={values.notes} error={errors.notes} touched={touched.notes} onChange={handleChange} onBlur={handleBlur} placeholder="Describe what you built, challenges, features..." rows={5} maxLength={500} />
            <div style={{ display:'flex', gap:'var(--space-3)' }}>
              <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>← Cancel</button>
              <button type="submit" className="btn btn-primary" style={{ flex:1 }} disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : '🚀 Submit Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
export default SubmitProject