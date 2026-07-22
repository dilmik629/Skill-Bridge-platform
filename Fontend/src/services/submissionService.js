import api from './api'

const submissionService = {
  // Student
  getMine:  ()             => api.get('/my/submissions'),
  submit:   (projectId, data) => api.post(`/my/submit/${projectId}`, data),
  update:   (id, data)     => api.put(`/my/submissions/${id}`, data),

  // Admin
  adminAll: (params)       => api.get('/admin/submissions', { params }),
  adminGet: (id)           => api.get(`/admin/submissions/${id}`),
  review:   (id, data)     => api.put(`/admin/submissions/${id}/review`, data),
}

export default submissionService