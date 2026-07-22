import { useState, useEffect, useRef } from 'react'
import useAuth from '../../hooks/useAuth'
import useForm from '../../hooks/useForm'
import useToast from '../../hooks/useToast.jsx'
import Avatar from '../../components/common/Avatar'
import InputField from '../../components/forms/InputField'
import TextareaField from '../../components/forms/TextareaField'
import Loader from '../../components/common/Loader'
import authService from '../../services/authService'
import './student.css'

const Profile = () => {
  const { user, updateUser } = useAuth()
  const { success, error }   = useToast()
  const [editing,  setEditing]      = useState(false)
  const [profile,  setProfile]      = useState(null)
  const [loading,  setLoading]      = useState(true)
  const [uploading, setUploading]   = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    authService.me()
      .then(res => setProfile(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit, reset } = useForm({
    initialValues: {
      name:            user?.name            || '',
      bio:             user?.bio             || '',
      github_username: user?.github_username || '',
      location:        user?.location        || '',
      linkedin_url:    user?.linkedin_url    || '',
      portfolio_url:   user?.portfolio_url   || '',
      skills:          user?.skills          || '',
    },
    rules: {
      name: v => !v?.trim() ? 'Name is required.' : null,
      linkedin_url:  v => v && !/^https?:\/\//.test(v) ? 'Include http:// or https://' : null,
      portfolio_url: v => v && !/^https?:\/\//.test(v) ? 'Include http:// or https://' : null,
    },
    onSubmit: async (vals) => {
      try {
        const res = await authService.updateProfile(vals)
        updateUser(res.data)
        setProfile(res.data)
        success('Profile updated! ✅')
        setEditing(false)
      } catch (err) {
        error(err.response?.data?.message || 'Update failed.')
      }
    }
  })

  const handlePhotoClick = () => fileInputRef.current?.click()

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!['image/jpeg','image/jpg','image/png','image/webp'].includes(file.type)) {
      error('Please choose a JPG, PNG or WEBP image.')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      error('Image must be under 2MB.')
      return
    }

    setUploading(true)
    try {
      const res = await authService.uploadAvatar(file)
      updateUser(res.data)
      setProfile(res.data)
      success('Profile picture updated! 📸')
    } catch (err) {
      error(err.response?.data?.message || 'Could not upload photo.')
    } finally {
      setUploading(false)
      e.target.value = '' // allow re-selecting the same file later
    }
  }

  if (loading) return <Loader fullPage text="Loading profile..." />

  const p = profile || user

  return (
    <div className="student-page">
      <div className="container" style={{ maxWidth:720 }}>

        {/* Banner */}
        <div className="profile-header animate-fadeInDown">
          <div className="profile-header__avatar-wrap" onClick={handlePhotoClick} title="Change profile picture">
            <Avatar src={p?.avatar} name={p?.name || ''} size="xl" />
            <div className="profile-header__avatar-overlay">
              {uploading ? '⏳' : '📷'}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handlePhotoChange}
              style={{ display:'none' }}
            />
          </div>
          <div className="profile-header__info">
            <div className="profile-header__name">{p?.name}</div>
            <div className="profile-header__email">📧 {p?.email}</div>
            <div className="profile-header__badges">
              <span className="profile-badge">🎓 Student</span>
              <span className="profile-badge">⚡ {p?.skill_points || 0} points</span>
              {p?.github_username && <span className="profile-badge">🐙 @{p.github_username}</span>}
              {p?.location && <span className="profile-badge">📍 {p.location}</span>}
            </div>
          </div>
          <button
            className="btn btn-sm"
            style={{ marginLeft:'auto', color:'#fff', borderColor:'rgba(255,255,255,.4)', background:'rgba(255,255,255,.15)', border:'1px solid' }}
            onClick={() => setEditing(p => !p)}>
            {editing ? '✕ Cancel' : '✏️ Edit Profile'}
          </button>
        </div>

        {editing ? (
          <div className="card card-elevated animate-scaleIn">
            <h2 style={{ fontSize:'var(--text-xl)', fontWeight:'var(--font-semibold)', marginBottom:'var(--space-6)' }}>✏️ Edit Profile</h2>
            <form onSubmit={handleSubmit} noValidate className="form-group">
              <InputField
                label="😊 Full Name" name="name"
                value={values.name} error={errors.name} touched={touched.name}
                onChange={handleChange} onBlur={handleBlur} required
              />
              <div className="form-row">
                <InputField
                  label="🐙 GitHub Username" name="github_username"
                  value={values.github_username} error={errors.github_username} touched={touched.github_username}
                  onChange={handleChange} onBlur={handleBlur} placeholder="yourusername"
                />
                <InputField
                  label="📍 Location" name="location"
                  value={values.location} error={errors.location} touched={touched.location}
                  onChange={handleChange} onBlur={handleBlur} placeholder="Colombo, Sri Lanka"
                />
              </div>
              <div className="form-row">
                <InputField
                  label="💼 LinkedIn URL" name="linkedin_url" type="url"
                  value={values.linkedin_url} error={errors.linkedin_url} touched={touched.linkedin_url}
                  onChange={handleChange} onBlur={handleBlur} placeholder="https://linkedin.com/in/you"
                />
                <InputField
                  label="🌐 Portfolio / Website" name="portfolio_url" type="url"
                  value={values.portfolio_url} error={errors.portfolio_url} touched={touched.portfolio_url}
                  onChange={handleChange} onBlur={handleBlur} placeholder="https://yoursite.com"
                />
              </div>
              <InputField
                label="🛠️ Skills" name="skills"
                value={values.skills} error={errors.skills} touched={touched.skills}
                onChange={handleChange} onBlur={handleBlur} placeholder="React, Laravel, UI Design (comma-separated)"
                hint="Separate each skill with a comma"
              />
              <TextareaField
                label="📝 Bio" name="bio"
                value={values.bio} error={errors.bio} touched={touched.bio}
                onChange={handleChange} onBlur={handleBlur}
                rows={3} maxLength={200} placeholder="Tell others about yourself..."
              />
              <div style={{ display:'flex', gap:'var(--space-3)' }}>
                <button type="button" className="btn btn-ghost" onClick={() => { setEditing(false); reset() }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex:1 }} disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : '💾 Save Changes'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-5)' }}>
            <div className="card animate-fadeInUp">
              <h3 style={{ fontSize:'var(--text-base)', fontWeight:'var(--font-semibold)', marginBottom:'var(--space-5)' }}>👤 About</h3>
              {[
                { label:'Full Name',    val: p?.name,            icon:'😊' },
                { label:'Email',        val: p?.email,           icon:'📧' },
                { label:'Location',     val: p?.location || '—', icon:'📍' },
                { label:'GitHub',       val: p?.github_username ? `@${p.github_username}` : '—', icon:'🐙' },
                { label:'LinkedIn',     val: p?.linkedin_url || '—',  icon:'💼', link: p?.linkedin_url },
                { label:'Portfolio',    val: p?.portfolio_url || '—', icon:'🌐', link: p?.portfolio_url },
                { label:'Skills',       val: p?.skills || 'No skills added yet.', icon:'🛠️' },
                { label:'Skill Points', val: p?.skill_points || 0, icon:'⚡' },
                { label:'Bio',          val: p?.bio || 'No bio yet.', icon:'📝' },
              ].map((r,i,arr) => (
                <div key={i} style={{ display:'flex', gap:'var(--space-3)', padding:'var(--space-3) 0', borderBottom: i<arr.length-1?'1px solid var(--color-border)':'none', alignItems:'flex-start' }}>
                  <span style={{ fontSize:'1rem', width:24, flexShrink:0 }}>{r.icon}</span>
                  <span style={{ fontSize:'var(--text-xs)', color:'var(--color-text-muted)', width:110, flexShrink:0, marginTop:2 }}>{r.label}</span>
                  {r.link ? (
                    <a href={r.link} target="_blank" rel="noreferrer" style={{ fontSize:'var(--text-sm)', color:'var(--color-primary)', fontWeight:'var(--font-medium)' }}>{r.val}</a>
                  ) : (
                    <span style={{ fontSize:'var(--text-sm)', color:'var(--color-text-primary)', fontWeight:'var(--font-medium)' }}>{r.val}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
