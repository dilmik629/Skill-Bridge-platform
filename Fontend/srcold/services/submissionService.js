import api from './api'

const submissionService = {
  // Student
  getMine:  ()             => api.get('/my/submissions'),
  submit:   (projectId, data) => {
    if (data.file) {
      const formData = new FormData()
      formData.append('github_url', data.github_url)
      if (data.notes) formData.append('notes', data.notes)
      formData.append('file', data.file)
      return api.post(`/my/submit/${projectId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    }
    return api.post(`/my/submit/${projectId}`, data)
  },

  // Admin
  adminAll: (params)       => api.get('/admin/submissions', { params }),
  adminGet: (id)           => api.get(`/admin/submissions/${id}`),
  review:   (id, data)     => api.put(`/admin/submissions/${id}/review`, data),
}

export default submissionService