/* ============================================
   SKILL-BRIDGE — useForm Hook
   ============================================ */

import { useState, useCallback } from 'react'

/*
  Usage:
  ─────────────────────────────────────────────
  const { values, errors, touched, handleChange,
          handleBlur, handleSubmit, isSubmitting,
          setFieldValue, reset } = useForm({
    initialValues: { email: '', password: '' },
    rules: {
      email:    (v) => isEmail(v),
      password: (v) => isRequired(v),
    },
    onSubmit: async (values) => {
      await loginUser(values)
    },
  })
*/

const useForm = ({ initialValues = {}, rules = {}, onSubmit }) => {

  const [values,       setValues]       = useState(initialValues)
  const [errors,       setErrors]       = useState({})
  const [touched,      setTouched]      = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ─── Validate single field ───────────────────
  const validateField = useCallback((name, value) => {
    // rules can be a function (dynamic rules based on values) or an object
    const ruleSet = typeof rules === 'function' ? rules(values) : rules
    const validator = ruleSet[name]
    if (!validator) return null
    return validator(value)
  }, [rules, values])

  // ─── Validate all fields ─────────────────────
  const validateAll = useCallback((currentValues) => {
    const ruleSet = typeof rules === 'function' ? rules(currentValues) : rules
    const newErrors = {}

    for (const name in ruleSet) {
      const error = ruleSet[name](currentValues[name])
      if (error) newErrors[name] = error
    }

    return newErrors
  }, [rules])

  // ─── onChange ────────────────────────────────
  // Clears error as user types (after field was touched)
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value

    setValues((prev) => ({ ...prev, [name]: newValue }))

    // Clear error on change only if field was already touched
    if (touched[name]) {
      const error = validateField(name, newValue)
      setErrors((prev) => ({ ...prev, [name]: error }))
    }
  }, [touched, validateField])

  // ─── onBlur ──────────────────────────────────
  // Validates on blur (first time user leaves field)
  const handleBlur = useCallback((e) => {
    const { name, value } = e.target

    setTouched((prev) => ({ ...prev, [name]: true }))

    const error = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: error }))
  }, [validateField])

  // ─── Set single field value programmatically ─
  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }))

    if (touched[name]) {
      const error = validateField(name, value)
      setErrors((prev) => ({ ...prev, [name]: error }))
    }
  }, [touched, validateField])

  // ─── Set single field error manually ─────────
  const setFieldError = useCallback((name, error) => {
    setErrors((prev) => ({ ...prev, [name]: error }))
  }, [])

  // ─── onSubmit ────────────────────────────────
  const handleSubmit = useCallback(async (e) => {
    if (e && e.preventDefault) e.preventDefault()

    // Touch all fields to show all errors
    const allTouched = Object.keys(
      typeof rules === 'function' ? rules(values) : rules
    ).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    setTouched(allTouched)

    // Validate everything
    const newErrors = validateAll(values)
    setErrors(newErrors)

    // Stop if errors exist
    if (Object.keys(newErrors).length > 0) return

    // Run onSubmit callback
    setIsSubmitting(true)
    try {
      await onSubmit(values)
    } catch (err) {
      // Caller handles errors (e.g. API errors)
      console.error('Form submit error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }, [values, rules, validateAll, onSubmit])

  // ─── Reset form ──────────────────────────────
  const reset = useCallback((newValues = initialValues) => {
    setValues(newValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }, [initialValues])

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    reset,
  }
}

export default useForm