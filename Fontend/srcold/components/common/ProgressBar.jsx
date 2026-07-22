/* ============================================
   SKILL-BRIDGE — ProgressBar Component
   ============================================ */

import '../../styles/components/progressbar.css'

/*
  Props:
  ─────────────────────────────────────────────
  value     → number 0–100  (required)
  label     → string        (optional — shown above bar)
  showValue → true | false  (show % on the right, default: true)
  size      → 'sm' | 'md' | 'lg'  (default: 'md')
  variant   → 'primary' | 'success' | 'warning' | 'error' (default: 'primary')
  animated  → true | false  (fill animation on mount, default: true)
  striped   → true | false  (animated stripe pattern, default: false)
*/

const ProgressBar = ({
  value = 0,
  label = '',
  showValue = true,
  size = 'md',
  variant = 'primary',
  animated = true,
  striped = false,
}) => {
  const clamped = Math.min(100, Math.max(0, value))

  // Auto variant by value if not set explicitly by consumer
  const resolvedVariant = variant === 'auto'
    ? clamped >= 70 ? 'success'
    : clamped >= 40 ? 'warning'
    : 'error'
    : variant

  return (
    <div className="progressbar">
      {(label || showValue) && (
        <div className="progressbar__header">
          {label && <span className="progressbar__label">{label}</span>}
          {showValue && (
            <span className="progressbar__value">{clamped}%</span>
          )}
        </div>
      )}

      <div className={`progressbar__track progressbar__track--${size}`}>
        <div
          className={[
            'progressbar__fill',
            `progressbar__fill--${resolvedVariant}`,
            animated  ? 'progressbar__fill--animated' : '',
            striped   ? 'progressbar__fill--striped'  : '',
          ].join(' ')}
          style={{ '--progress-value': `${clamped}%`, width: `${clamped}%` }}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  )
}

export default ProgressBar