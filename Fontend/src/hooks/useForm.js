import { useState, useCallback } from 'react'

const useForm = ({ initialValues = {}, rules = {}, onSubmit }) => {

  const [values,       setValues]       = useState(initialValues)
  const [errors,       setErrors]       = useState({})
  const [touched,      setTouched]      = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateField = useCallback((name, value) => {
    // rules can be a function (dynamic rules based on values) or an object
    const ruleSet = typeof rules === 'function' ? rules(values) : rules
    const validator = ruleSet[name]
    if (!validator) return null
    return validator(value)
  }, [rules, values])

  const validateAll = useCallback((currentValues) => {
    const ruleSet = typeof rules === 'function' ? rules(currentValues) : rules
    const newErrors = {}

    for (const name in ruleSet) {
      const error = ruleSet[name](currentValues[name])
      if (error) newErrors[name] = error
    }

    return newErrors
  }, [rules])

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value

    setValues((prev) => ({ ...prev, [name]: newValue }))

    if (touched[name]) {
      const error = validateField(name, newValue)
      setErrors((prev) => ({ ...prev, [name]: error }))
    }
  }, [touched, validateField])

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target

    setTouched((prev) => ({ ...prev, [name]: true }))

    const error = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: error }))
  }, [validateField])

  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }))

    if (touched[name]) {
      const error = validateField(name, value)
      setErrors((prev) => ({ ...prev, [name]: error }))
    }
  }, [touched, validateField])

  const setFieldError = useCallback((name, error) => {
    setErrors((prev) => ({ ...prev, [name]: error }))
  }, [])

  const handleSubmit = useCallback(async (e) => {
    if (e && e.preventDefault) e.preventDefault()

    const allTouched = Object.keys(
      typeof rules === 'function' ? rules(values) : rules
    ).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    setTouched(allTouched)


    const newErrors = validateAll(values)
    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) return

    setIsSubmitting(true)
    try {
      await onSubmit(values)
    } catch (err) {
      
      console.error('Form submit error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }, [values, rules, validateAll, onSubmit])

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