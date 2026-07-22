import { createContext, useState, useEffect, useCallback } from 'react'
import { STORAGE_KEYS, ROLES } from '../utils/constants'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {

  const [user, setUser]       = useState(null)     
  const [token, setToken]     = useState(null)     
  const [loading, setLoading] = useState(true)   


  useEffect(() => {
    const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN)
    const storedUser  = localStorage.getItem(STORAGE_KEYS.USER)

    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem(STORAGE_KEYS.TOKEN)
        localStorage.removeItem(STORAGE_KEYS.USER)
      }
    }

    setLoading(false)
  }, [])

  const login = useCallback((userData, authToken) => {
    setUser(userData)
    setToken(authToken)
    localStorage.setItem(STORAGE_KEYS.TOKEN, authToken)
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData))
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER)
  }, [])

  const updateUser = useCallback((updatedData) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedData }
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated))
      return updated
    })
  }, [])

  const isAuthenticated = !!token && !!user
  const isAdmin         = isAuthenticated && user?.role === ROLES.ADMIN
  const isStudent       = isAuthenticated && user?.role === ROLES.STUDENT

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated,
    isAdmin,
    isStudent,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}