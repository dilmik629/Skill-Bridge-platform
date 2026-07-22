import '../../styles/components/badge.css'

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

  if (level && LEVEL_MAP[level]) {
    label   = LEVEL_MAP[level].label
    variant = LEVEL_MAP[level].variant
  }

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