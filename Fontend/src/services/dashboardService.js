import api from './api'

const dashboardService = {

  student:      () => api.get('/my/dashboard'),
  portfolio:    () => api.get('/my/portfolio'),
  exportPortfolio: () => api.get('/my/portfolio/export', { responseType: 'blob' }),
  // Admin
  admin:       () => api.get('/admin/dashboard'),

  // Notifications
  getNotifications: ()    => api.get('/my/notifications'),
  markRead:         (id)  => api.put(`/my/notifications/${id}/read`),
  markAllRead:      ()    => api.put('/my/notifications/read-all'),

  // Admin Users
  getUsers:    (params)   => api.get('/admin/users', { params }),
  getUserById: (id)       => api.get(`/admin/users/${id}`),
  deleteUser:  (id)       => api.delete(`/admin/users/${id}`),
}

export default dashboardService