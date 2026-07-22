/* ============================================
   SKILL-BRIDGE — AuthContext
   ============================================ */

import { createContext, useState, useEffect, useCallback } from 'react'
import { STORAGE_KEYS, ROLES } from '../utils/constants'

// ─── Create Context ───────────────────────────
export const AuthContext = createContext(null)

// ─── Provider ─────────────────────────────────
export const AuthProvider = ({ children }) => {

  const [user, setUser]       = useState(null)     // { id, name, email, role, avatar, ... }
  const [token, setToken]     = useState(null)     // JWT / Sanctum token
  const [loading, setLoading] = useState(true)     // Initial auth check

  // ─── Restore session on mount ──────────────
  useEffect(() => {
    const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN)
    const storedUser  = localStorage.getItem(STORAGE_KEYS.USER)

    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      } catch {
        // Corrupted data — clear it
        localStorage.removeItem(STORAGE_KEYS.TOKEN)
        localStorage.removeItem(STORAGE_KEYS.USER)
      }
    }

    setLoading(false)
  }, [])

  // ─── Login ─────────────────────────────────
  const login = useCallback((userData, authToken) => {
    setUser(userData)
    setToken(authToken)
    localStorage.setItem(STORAGE_KEYS.TOKEN, authToken)
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData))
  }, [])

  // ─── Logout ────────────────────────────────
  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER)
  }, [])

  // ─── Update user (profile edit etc.) ───────
  const updateUser = useCallback((updatedData) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedData }
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated))
      return updated
    })
  }, [])

  // ─── Role helpers ───────────────────────────
  const isAuthenticated = !!token && !!user
  const isAdmin         = isAuthenticated && user?.role === ROLES.ADMIN
  const isStudent       = isAuthenticated && user?.role === ROLES.STUDENT

  // ─── Context value ──────────────────────────
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