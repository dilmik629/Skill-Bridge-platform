/* ============================================
   SKILL-BRIDGE — Avatar Component
   ============================================ */

import '../../styles/components/avatar.css'

/*
  Props:
  ─────────────────────────────────────────────
  src     → image URL (optional)
  name    → user's name (used for initials fallback)
  size    → 'xs' | 'sm' | 'md' | 'lg' | 'xl'  (default: 'md')
  online  → true | false  (show green online dot)
  rank    → 1 | 2 | 3  (show gold/silver/bronze ring — leaderboard)
*/

const getInitials = (name = '') => {
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || '?'
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

// Deterministic color from name (so same user always gets same color)
const AVATAR_COLORS = [
  '#4F46E5', '#7C3AED', '#DB2777', '#DC2626',
  '#D97706', '#059669', '#0891B2', '#2563EB',
]

const getColor = (name = '') => {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

const Avatar = ({ src, name = '', size = 'md', online = false, rank }) => {
  const initials = getInitials(name)
  const bgColor  = getColor(name)

  const rankClass = rank === 1 ? 'avatar--gold'
    : rank === 2 ? 'avatar--silver'
    : rank === 3 ? 'avatar--bronze'
    : ''

  return (
    <div className={`avatar avatar--${size} ${rankClass}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className="avatar__img"
          onError={(e) => { e.target.style.display = 'none' }}
        />
      ) : (
        <span
          className="avatar__initials"
          style={{ backgroundColor: bgColor }}
        >
          {initials}
        </span>
      )}

      {online && <span className="avatar__online-dot" aria-label="Online" />}
    </div>
  )
}

export default Avatar