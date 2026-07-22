/* ============================================
   SKILL-BRIDGE — FORM VALIDATORS
   ============================================ */

// ─── BASIC VALIDATORS ─────────────────────────

export const isRequired = (value) => {
  if (value === null || value === undefined) return 'This field is required.'
  if (typeof value === 'string' && value.trim() === '') return 'This field is required.'
  return null
}

export const isEmail = (value) => {
  if (!value) return 'Email is required.'
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!regex.test(value.trim())) return 'Please enter a valid email address.'
  return null
}

export const isPassword = (value) => {
  if (!value) return 'Password is required.'
  if (value.length < 8) return 'Password must be at least 8 characters.'
  if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter.'
  if (!/[0-9]/.test(value)) return 'Password must contain at least one number.'
  return null
}

export const isPasswordMatch = (password, confirm) => {
  if (!confirm) return 'Please confirm your password.'
  if (password !== confirm) return 'Passwords do not match.'
  return null
}

export const isName = (value) => {
  if (!value || value.trim() === '') return 'Name is required.'
  if (value.trim().length < 2) return 'Name must be at least 2 characters.'
  if (value.trim().length > 100) return 'Name must be under 100 characters.'
  return null
}

export const isUrl = (value) => {
  if (!value) return 'URL is required.'
  try {
    new URL(value)
    return null
  } catch {
    return 'Please enter a valid URL.'
  }
}

export const isGithubUrl = (value) => {
  if (!value) return 'GitHub URL is required.'
  const regex = /^https:\/\/github\.com\/.+/
  if (!regex.test(value.trim())) return 'Please enter a valid GitHub repository URL.'
  return null
}

export const isMinLength = (min) => (value) => {
  if (!value) return `Minimum ${min} characters required.`
  if (value.trim().length < min) return `Must be at least ${min} characters.`
  return null
}

export const isMaxLength = (max) => (value) => {
  if (value && value.trim().length > max) return `Must be under ${max} characters.`
  return null
}

export const isNumber = (value) => {
  if (value === '' || value === null || value === undefined) return 'This field is required.'
  if (isNaN(Number(value))) return 'Please enter a valid number.'
  return null
}

export const isInRange = (min, max) => (value) => {
  const num = Number(value)
  if (isNaN(num)) return 'Please enter a valid number.'
  if (num < min || num > max) return `Value must be between ${min} and ${max}.`
  return null
}

// ─── COMPOSITE VALIDATORS ─────────────────────
// Pass multiple validators — first error wins

export const validate = (value, ...validators) => {
  for (const validator of validators) {
    const error = validator(value)
    if (error) return error
  }
  return null
}

// ─── FORM-LEVEL VALIDATOR ─────────────────────
// Runs all field validators and returns errors object
// rules = { fieldName: (value) => errorString | null }

export const validateForm = (values, rules) => {
  const errors = {}
  for (const field in rules) {
    const error = rules[field](values[field])
    if (error) errors[field] = error
  }
  return errors
}

// ─── AUTH FORM RULES ──────────────────────────
// ─── AUTH FORM RULES ──────────────────────────

export const loginRules = {
  email:    (v) => validate(v, isRequired, isEmail),
  password: (v) => isRequired(v),
}

export const registerRules = (values) => ({
  name:            (v) => validate(v, isRequired, isName),
  email:           (v) => validate(v, isRequired, isEmail),
  password:        (v) => validate(v, isRequired, isPassword),
  confirmPassword: (v) => isPasswordMatch(values.password, v),
})

export const forgotPasswordRules = {
  email: (v) => validate(v, isRequired, isEmail),
}

export const resetPasswordRules = (values) => ({
  password:        (v) => validate(v, isRequired, isPassword),
  confirmPassword: (v) => isPasswordMatch(values.password, v),
})

// ─── PROJECT FORM RULES ───────────────────────

export const projectRules = {
  title:       (v) => validate(v, isRequired, isMinLength(5), isMaxLength(200)),
  description: (v) => validate(v, isRequired, isMinLength(20)),
  category_id: (v) => isRequired(v),
  level:       (v) => isRequired(v),
  deadline:    (v) => isRequired(v),
  max_students:(v) => validate(v, isRequired, isNumber, isInRange(1, 100)),
}

// ─── SUBMISSION FORM RULES ────────────────────

export const submissionRules = {
  github_url: (v) => validate(v, isRequired, isGithubUrl),
}