import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useForm from '../../../hooks/useForm'
import useToast from '../../../hooks/useToast.jsx'
import InputField from '../../../components/forms/InputField'
import SelectField from '../../../components/forms/SelectField'
import TextareaField from '../../../components/forms/TextareaField'
import Loader from '../../../components/common/Loader'
import projectService from '../../../services/projectService'
import api from '../../../services/api'
import { ROUTES } from '../../../utils/constants'
import '../admin.css'

const LEVEL_OPTIONS   = [{value:'beginner',label:'🟢 Beginner'},{value:'intermediate',label:'🟡 Intermediate'},{value:'advanced',label:'🔴 Advanced'}]
const STATUS_OPTIONS  = [{value:'open',label:'Open'},{value:'closed',label:'Closed'},{value:'in_progress',label:'In Progress'}]

const ProjectEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { success, error } = useToast()
  const [categories, setCategories] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [initVals,   setInitVals]   = useState(null)

  useEffect(() => {
    Promise.all([
      api.get('/categories'),
      projectService.adminGetAll().then(r => r.data.data?.find(p => p.id === Number(id)) || projectService.getById(id).then(r => r.data)),
    ]).then(([catRes, proj]) => {
      setCategories(catRes.data.map(c => ({ value: String(c.id), label: `${c.icon} ${c.name}` })))
      setInitVals({
        title:        proj.title        || '',
        description:  proj.description  || '',
        category_id:  String(proj.category_id || ''),
        level:        proj.level        || '',
        deadline:     proj.deadline     || '',
        max_students: String(proj.max_students || ''),
        status:       proj.status       || 'open',
        tech_stack:   Array.isArray(proj.tech_stack) ? proj.tech_stack.join(', ') : (proj.tech_stack || ''),
      })
    }).catch(() => { error('Project not found.'); navigate(ROUTES.ADMIN_PROJECTS) })
    .finally(() => setLoading(false))
  }, [id])

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } = useForm({
    initialValues: initVals || { title:'',description:'',category_id:'',level:'',deadline:'',max_students:'',status:'open',tech_stack:'' },
    rules: { title:v=>!v?.trim()?'Required.':null, description:v=>!v?.trim()?'Required.':null },
    onSubmit: async (vals) => {
      try {
        await projectService.adminUpdate(id, {
          ...vals,
          tech_stack:   vals.tech_stack ? vals.tech_stack.split(',').map(t=>t.trim()) : [],
          max_students: Number(vals.max_students),
        })
        success('Project updated! ✅')
        navigate(ROUTES.ADMIN_PROJECTS)
      } catch (err) {
        error(err.response?.data?.message || 'Update failed.')
      }
    }
  })

  if (loading || !initVals) return <Loader fullPage text="Loading project..." />

  return (
    <div className="admin-page">
      <div className="admin-header animate-fadeInDown">
        <div className="admin-header__left">
          <p className="admin-header__eyebrow">Projects</p>
          <h1 className="admin-header__title">✏️ Edit Project</h1>
          <p className="admin-header__sub">Changes are live immediately after saving.</p>
        </div>
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>← Back</button>
      </div>
      <div className="admin-form-page animate-fadeInUp">
        <form onSubmit={handleSubmit} noValidate>
          <div className="admin-form-section">
            <h3 className="admin-form-section__title">📝 Basic Information</h3>
            <div className="form-group">
              <InputField label="Title" name="title" value={values.title} error={errors.title} touched={touched.title} onChange={handleChange} onBlur={handleBlur} required />
              <TextareaField label="Description" name="description" value={values.description} error={errors.description} touched={touched.description} onChange={handleChange} onBlur={handleBlur} rows={5} required />
              <div className="form-row">
                <SelectField label="Category" name="category_id" value={values.category_id} error={errors.category_id} touched={touched.category_id} onChange={handleChange} onBlur={handleBlur} options={categories} required />
                <SelectField label="Level" name="level" value={values.level} error={errors.level} touched={touched.level} onChange={handleChange} onBlur={handleBlur} options={LEVEL_OPTIONS} required />
              </div>
              <InputField label="Tech Stack" name="tech_stack" value={values.tech_stack} error={errors.tech_stack} touched={touched.tech_stack} onChange={handleChange} onBlur={handleBlur} placeholder="React, Laravel, MySQL" />
            </div>
          </div>
          <div className="admin-form-section">
            <h3 className="admin-form-section__title">⚙️ Settings</h3>
            <div className="form-group">
              <div className="form-row">
                <InputField label="Deadline" name="deadline" type="date" value={values.deadline} error={errors.deadline} touched={touched.deadline} onChange={handleChange} onBlur={handleBlur} required />
                <InputField label="Max Students" name="max_students" type="number" value={values.max_students} error={errors.max_students} touched={touched.max_students} onChange={handleChange} onBlur={handleBlur} required />
              </div>
              <SelectField label="Status" name="status" value={values.status} error={errors.status} touched={touched.status} onChange={handleChange} onBlur={handleBlur} options={STATUS_OPTIONS} />
            </div>
          </div>
          <div style={{ display:'flex', gap:'var(--space-3)' }}>
            <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>← Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ flex:1 }} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : '💾 Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProjectEdit