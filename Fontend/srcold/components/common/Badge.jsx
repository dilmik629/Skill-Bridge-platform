/* ============================================
   SKILL-BRIDGE — Badge Component
   ============================================ */

import '../../styles/components/badge.css'

/*
  Props:
  ─────────────────────────────────────────────
  label     → string (text inside badge)
  variant   → 'success' | 'warning' | 'error' | 'info' | 'primary' | 'neutral'
  size      → 'sm' | 'md'  (default: 'md')
  dot       → true | false  (show colored dot before text)

  Built-in shortcuts:
  <Badge level="beginner" />
  <Badge level="intermediate" />
  <Badge level="advanced" />
  <Badge status="open" />
  <Badge status="closed" />
  <Badge status="in_progress" />
  <Badge status="approved" />
  <Badge status="rejected" />
  <Badge status="pending" />
*/

const LEVEL_MAP = {
  beginner:     { label: 'Beginner',     variant: 'success' },
  intermediate: { label: 'Intermediate', variant: 'warning' },
  advanced:     { label: 'Advanced',     variant: 'error'   },
}

const STATUS_MAP = {
  open:        { label: 'Open',        variant: 'success' },
  closed:      { label: 'Closed',      variant: 'neutral' },
  in_progress: { label: 'In Progress', variant: 'info'    },
  approved:    { label: 'Approved',    variant: 'success' },
  rejected:    { label: 'Rejected',    variant: 'error'   },
  pending:     { label: 'Pending',     variant: 'warning' },
  submitted:   { label: 'Submitted',   variant: 'info'    },
  reviewed:    { label: 'Reviewed',    variant: 'primary' },
}

const Badge = ({
  label,
  variant = 'primary',
  size = 'md',
  dot = false,
  level,
  status,
}) => {
  // Resolve level shortcut
  if (level && LEVEL_MAP[level]) {
    label   = LEVEL_MAP[level].label
    variant = LEVEL_MAP[level].variant
  }

  // Resolve status shortcut
  if (status && STATUS_MAP[status]) {
    label   = STATUS_MAP[status].label
    variant = STATUS_MAP[status].variant
  }

  return (
    <span className={`badge badge--${variant} badge--${size}`}>
      {dot && <span className="badge__dot" />}
      {label}
    </span>
  )
}

export default Badge