import api from './api'

const projectService = {
  getAll:     (params)     => api.get('/projects', { params }),
  getById:    (id)         => api.get(`/projects/${id}`),
  apply:      (id)         => api.post(`/my/projects/${id}/apply`),
  adminGetAll:(params)     => api.get('/admin/projects', { params }),
  adminCreate:(data)       => api.post('/admin/projects', data),
  adminUpdate:(id, data)   => api.put(`/admin/projects/${id}`, data),
  adminDelete:(id)         => api.delete(`/admin/projects/${id}`),
}

export default projectService