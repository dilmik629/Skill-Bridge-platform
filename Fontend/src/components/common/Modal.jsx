import { useEffect, useCallback } from 'react'
import '../../styles/components/modal.css'
 
const Modal = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  closeable = true,
  children,
}) => {

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape' && closeable) onClose()
  }, [closeable, onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  return (
    <div
      className="modal-overlay"
      onClick={closeable ? onClose : undefined}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        className={`modal modal--${size}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || closeable) && (
          <div className="modal__header">
            {title && (
              <h3 className="modal__title" id="modal-title">{title}</h3>
            )}
            {closeable && (
              <button
                className="modal__close"
                onClick={onClose}
                aria-label="Close modal"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="modal__body">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal