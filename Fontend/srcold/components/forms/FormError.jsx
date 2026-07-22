import '../../styles/components/forms.css'

/*
  Props:
  ─────────────────────────────────────────────
  message  → string   (error text — renders nothing if empty/null)
  id       → string   (aria-describedby link — optional)
*/

const FormError = ({ message, id }) => {
  if (!message) return null

  return (
    <span
      id={id}
      className="form-error animate-fadeInDown"
      role="alert"
      aria-live="polite"
    >
      {/* Error icon */}
      <svg
        className="form-error__icon"
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8"  x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>

      {message}
    </span>
  )
}

export default FormError