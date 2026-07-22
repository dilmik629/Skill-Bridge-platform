import axios from 'axios'
import { STORAGE_KEYS } from '../utils/constants'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept':       'application/json',
  },
})

// Request — token attach
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Response — 401 → logout, unverified email → verify page
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER)
      window.location.href = '/login'
    }
    if (err.response?.status === 403 && err.response?.data?.code === 'email_not_verified') {
      window.location.href = '/verify-email'
    }
    return Promise.reject(err)
  }
)

export default api