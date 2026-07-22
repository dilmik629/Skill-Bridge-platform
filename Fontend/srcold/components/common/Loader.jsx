/* ============================================
   SKILL-BRIDGE — Loader Component
   ============================================ */

import '../../styles/components/loader.css'

/*
  Props:
  ─────────────────────────────────────────────
  size      → 'sm' | 'md' | 'lg'  (default: 'md')
  fullPage  → true | false         (default: false) — center on full page
  text      → string               (optional loading text)
  overlay   → true | false         (default: false) — dark overlay behind
*/

const Loader = ({ size = 'md', fullPage = false, text = '', overlay = false }) => {

  if (fullPage) {
    return (
      <div className={`loader-fullpage ${overlay ? 'loader-overlay' : ''}`}>
        <div className="loader-content">
          <div className={`loader-spinner loader-spinner--${size}`} />
          {text && <p className="loader-text">{text}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="loader-inline">
      <div className={`loader-spinner loader-spinner--${size}`} />
      {text && <p className="loader-text">{text}</p>}
    </div>
  )
}

export default Loader