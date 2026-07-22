/* ============================================
   SKILL-BRIDGE — Toast Component
   ============================================ */

import { useEffect, useState } from 'react'
import { TOAST_TYPES } from '../../utils/constants'
import '../../styles/components/toast.css'

/* ─── Single Toast Item ──────────────────────── */
const ToastItem = ({ id, message, type, onRemove }) => {
  const [exiting, setExiting] = useState(false)

  const handleClose = () => {
    setExiting(true)
    setTimeout(() => onRemove(id), 350)
  }

  const icons = {
    [TOAST_TYPES.SUCCESS]: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    [TOAST_TYPES.ERROR]: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    ),
    [TOAST_TYPES.WARNING]: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    [TOAST_TYPES.INFO]: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
      </svg>
    ),
  }

  return (
    <div className={`toast toast--${type} ${exiting ? 'toast--exit' : 'toast--enter'}`}>
      <span className="toast__icon">{icons[type]}</span>
      <p className="toast__message">{message}</p>
      <button className="toast__close" onClick={handleClose} aria-label="Close">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  )
}

/* ─── Toast Container ────────────────────────── */
/*
  Usage:
  ─────────────────────────────────────────────
  const { toasts, removeToast, success, error } = useToast()

  // In JSX (App level):
  <ToastContainer toasts={toasts} onRemove={removeToast} />

  // Trigger anywhere:
  success('Project submitted successfully!')
  error('Something went wrong.')
*/
const ToastContainer = ({ toasts = [], onRemove }) => {
  if (toasts.length === 0) return null

  return (
    <div className="toast-container" role="region" aria-label="Notifications">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          onRemove={onRemove}
        />
      ))}
    </div>
  )
}

export default ToastContainer