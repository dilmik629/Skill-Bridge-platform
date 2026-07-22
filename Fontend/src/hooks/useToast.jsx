/* ============================================
   SKILL-BRIDGE — useToast Hook & Provider
   ============================================ */

import React, { createContext, useContext, useState, useCallback } from 'react'
import { TOAST_TYPES, TOAST_DURATION } from '../utils/constants'

// 1. Context එක නිර්මාණය කිරීම
const ToastContext = createContext(null)

let toastId = 0

// 2. ToastProvider එක නිර්මාණය කිරීම
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback((message, type = TOAST_TYPES.INFO, duration = TOAST_DURATION) => {
    const id = ++toastId
    setToasts((prev) => [...prev, { id, message, type, duration }])
    setTimeout(() => removeToast(id), duration)
    return id
  }, [removeToast])

  const success = useCallback((msg, dur) => addToast(msg, TOAST_TYPES.SUCCESS, dur), [addToast])
  const error = useCallback((msg, dur) => addToast(msg, TOAST_TYPES.ERROR, dur), [addToast])
  const warning = useCallback((msg, dur) => addToast(msg, TOAST_TYPES.WARNING, dur), [addToast])
  const info = useCallback((msg, dur) => addToast(msg, TOAST_TYPES.INFO, dur), [addToast])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, warning, info }}>
      {children}
    </ToastContext.Provider>
  )
}

// 3. useToast Hook එක
const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export default useToast