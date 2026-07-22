/* ============================================
   SKILL-BRIDGE — TextareaField Component
   ============================================ */

import FormError from './FormError'
import '../../styles/components/forms.css'

/*
  Props:
  ─────────────────────────────────────────────
  name        → string
  label       → string
  value       → string
  placeholder → string
  error       → string
  touched     → boolean
  onChange    → function
  onBlur      → function
  disabled    → boolean
  required    → boolean
  hint        → string
  rows        → number   (default: 4)
  maxLength   → number   (show character counter if set)
  resize      → 'none' | 'vertical' | 'both'  (default: 'vertical')
*/

const TextareaField = ({
  name,
  label,
  value = '',
  placeholder = '',
  error,
  touched,
  onChange,
  onBlur,
  disabled  = false,
  required  = false,
  hint,
  rows      = 4,
  maxLength,
  resize    = 'vertical',
  className = '',
}) => {
  const hasError    = touched && !!error
  const errorId     = `${name}-error`
  const charCount   = value?.length || 0
  const nearLimit   = maxLength && charCount >= maxLength * 0.85

  return (
    <div className={`form-group ${className}`}>

      {/* Label */}
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="form-required" aria-hidden="true">*</span>}
        </label>
      )}

      {/* Textarea */}
      <textarea
        id={name}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        required={required}
        rows={rows}
        maxLength={maxLength}
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : undefined}
        className={[
          'form-textarea',
          hasError  ? 'form-input--error'    : '',
          disabled  ? 'form-input--disabled' : '',
        ].join(' ')}
        style={{ resize }}
      />

      {/* Bottom row: hint or error + char count */}
      <div className="form-textarea__footer">
        <div>
          {hint && !hasError && (
            <span className="form-hint">{hint}</span>
          )}
          <FormError message={hasError ? error : ''} id={errorId} />
        </div>

        {maxLength && (
          <span className={`form-char-count ${nearLimit ? 'form-char-count--warn' : ''}`}>
            {charCount}/{maxLength}
          </span>
        )}
      </div>
    </div>
  )
}

export default TextareaField