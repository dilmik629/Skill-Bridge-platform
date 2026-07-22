import api from './api'

const authService = {
  register:           (data)  => api.post('/auth/register', data),
  login:              (data)  => api.post('/auth/login', data),
  logout:             ()      => api.post('/auth/logout'),
  me:                 ()      => api.get('/auth/me'),
  forgotPassword:     (email) => api.post('/auth/forgot-password', { email }),
  resetPassword:      (data)  => api.post('/auth/reset-password', data),
  verifyEmail:        (token) => api.get(`/auth/verify-email/${token}`),
  resendVerification: ()      => api.post('/auth/resend-verification'),
  updateProfile:      (data)  => api.put('/auth/profile', data),
  uploadAvatar:       (file)  => {
    const form = new FormData()
    form.append('avatar', file)
    return api.post('/auth/avatar', form, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
  changePassword:     (data)  => api.put('/auth/password', data),
}

export default authService