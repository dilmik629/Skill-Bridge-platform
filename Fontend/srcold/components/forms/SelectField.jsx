/* ============================================
   SKILL-BRIDGE — SelectField Component
   ============================================ */

import FormError from './FormError'
import '../../styles/components/forms.css'

/*
  Props:
  ─────────────────────────────────────────────
  name        → string     (field name — required)
  label       → string
  value       → string     (controlled value)
  options     → Array of { value: string, label: string }
  placeholder → string     (first disabled option text, default: 'Select...')
  error       → string
  touched     → boolean
  onChange    → function
  onBlur      → function
  disabled    → boolean
  required    → boolean
  hint        → string

  Example:
  ─────────────────────────────────────────────
  <SelectField
    name="level"
    label="Project Level"
    value={values.level}
    error={errors.level}
    touched={touched.level}
    onChange={handleChange}
    onBlur={handleBlur}
    options={[
      { value: 'beginner',     label: 'Beginner'     },
      { value: 'intermediate', label: 'Intermediate' },
      { value: 'advanced',     label: 'Advanced'     },
    ]}
  />
*/

const SelectField = ({
  name,
  label,
  value = '',
  options = [],
  placeholder = 'Select...',
  error,
  touched,
  onChange,
  onBlur,
  disabled = false,
  required = false,
  hint,
  className = '',
}) => {
  const hasError = touched && !!error
  const errorId  = `${name}-error`

  return (
    <div className={`form-group ${className}`}>

      {/* Label */}
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="form-required" aria-hidden="true">*</span>}
        </label>
      )}

      {/* Select wrapper (for custom arrow) */}
      <div className={[
        'form-select-wrapper',
        hasError  ? 'form-input-wrapper--error'   : '',
        disabled  ? 'form-input-wrapper--disabled' : '',
      ].join(' ')}>

        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          className={[
            'form-select',
            hasError ? 'form-input--error'    : '',
            !value   ? 'form-select--empty'   : '',
          ].join(' ')}
        >
          {/* Placeholder option */}
          <option value="" disabled hidden>
            {placeholder}
          </option>

          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Custom dropdown arrow */}
        <span className="form-select__arrow" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
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

export default SelectField