/* ============================================
   SKILL-BRIDGE — InputField Component
   ============================================ */

import { useState } from 'react'
import FormError from './FormError'
import '../../styles/components/forms.css'

/*
  Props:
  ─────────────────────────────────────────────
  name        → string    (field name — required)
  label       → string    (label text)
  type        → string    (default: 'text') — text | email | password | number | url | date
  value       → string    (controlled value)
  placeholder → string
  error       → string    (error message from useForm)
  touched     → boolean   (was field touched?)
  onChange    → function  (handleChange from useForm)
  onBlur      → function  (handleBlur from useForm)
  disabled    → boolean
  required    → boolean
  hint        → string    (helper text below input)
  icon        → JSX       (left icon)
  iconRight   → JSX       (right icon — custom)
  className   → string    (extra wrapper class)
*/

const InputField = ({
  name,
  label,
  type = 'text',
  value = '',
  placeholder = '',
  error,
  touched,
  onChange,
  onBlur,
  disabled = false,
  required = false,
  hint,
  icon,
  iconRight,
  className = '',
}) => {
  const [showPassword, setShowPassword] = useState(false)

  const isPassword   = type === 'password'
  const inputType    = isPassword ? (showPassword ? 'text' : 'password') : type
  const hasError     = touched && !!error
  const errorId      = `${name}-error`

  return (
    <div className={`form-group ${className}`}>

      {/* Label */}
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="form-required" aria-hidden="true">*</span>}
        </label>
      )}

      {/* Input wrapper */}
      <div className={[
        'form-input-wrapper',
        icon        ? 'form-input-wrapper--icon-left'  : '',
        (isPassword || iconRight) ? 'form-input-wrapper--icon-right' : '',
        hasError    ? 'form-input-wrapper--error'   : '',
        disabled    ? 'form-input-wrapper--disabled' : '',
      ].join(' ')}>

        {/* Left icon */}
        {icon && (
          <span className="form-input__icon form-input__icon--left" aria-hidden="true">
            {icon}
          </span>
        )}

        {/* Input */}
        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          className={[
            'form-input',
            hasError  ? 'form-input--error'   : '',
            disabled  ? 'form-input--disabled' : '',
          ].join(' ')}
          autoComplete={
            type === 'email'    ? 'email' :
            type === 'password' ? 'current-password' :
            name === 'name'     ? 'name'  : 'off'
          }
        />

        {/* Right — password toggle */}
        {isPassword && (
          <button
            type="button"
            className="form-input__icon form-input__icon--right form-input__password-toggle"
            onClick={() => setShowPassword((p) => !p)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? (
              /* Eye-off icon */
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              /* Eye icon */
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        )}

        {/* Right custom icon */}
        {!isPassword && iconRight && (
          <span className="form-input__icon form-input__icon--right" aria-hidden="true">
            {iconRight}
          </span>
        )}
      </div>

      {/* Hint */}
      {hint && !hasError && (
        <span className="form-hint">{hint}</span>
      )}

      {/* Error */}
      <FormError message={hasError ? error : ''} id={errorId} />
    </div>
  )
}

export default InputField