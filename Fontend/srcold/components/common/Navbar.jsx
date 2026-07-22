import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import Avatar  from './Avatar'
import { ROUTES } from '../../utils/constants'
import dashboardService from '../../services/dashboardService'
import '../../styles/components/navbar.css'

const Navbar = () => {
  const { isAuthenticated, isAdmin, isStudent, user, logout } = useAuth()
  const navigate  = useNavigate()
  const [menuOpen,     setMenuOpen]     = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [unreadCount,  setUnreadCount]  = useState(0)
  const dropdownRef = useRef(null)

  // Unread notifications count fetch
  useEffect(() => {
    if (!isStudent) return
    dashboardService.getNotifications()
      .then(res => {
        const unread = (res.data || []).filter(n => !n.is_read).length
        setUnreadCount(unread)
      })
      .catch(() => {})
  }, [isStudent])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleLogout = () => {
    logout()
    setDropdownOpen(false)
    navigate(ROUTES.HOME)
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <nav className="navbar">
      <div className="container navbar__inner">

        {/* ── Logo ── */}
        <Link to={ROUTES.HOME} className="navbar__logo" onClick={closeMenu}>
          <div className="navbar__logo-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <span className="navbar__logo-text">Skill<span>Bridge</span></span>
        </Link>

        {/* ── Desktop Nav Links ── */}
        <div className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>

          {/* Public — always visible */}
          <NavLink to={ROUTES.HOME}      className="navbar__link" onClick={closeMenu}>Home</NavLink>
          <NavLink to={ROUTES.PROJECTS}  className="navbar__link" onClick={closeMenu}>Projects</NavLink>
          <NavLink to={ROUTES.COMMUNITY} className="navbar__link" onClick={closeMenu}>🌟 Community</NavLink>

          {/* Student links */}
          {isStudent && (
            <>
              <NavLink to={ROUTES.STUDENT_DASHBOARD} className="navbar__link" onClick={closeMenu}>Dashboard</NavLink>
              <NavLink to={ROUTES.MY_PROJECTS}       className="navbar__link" onClick={closeMenu}>My Projects</NavLink>
              <NavLink to={ROUTES.LEADERBOARD}       className="navbar__link" onClick={closeMenu}>Leaderboard</NavLink>
            </>
          )}

          {/* Admin shortcut */}
          {isAdmin && (
            <NavLink to={ROUTES.ADMIN_DASHBOARD} className="navbar__link" onClick={closeMenu}>
              ⚡ Admin Panel
            </NavLink>
          )}
        </div>

        {/* ── Right side ── */}
        <div className="navbar__right">

          {/* Not logged in */}
          {!isAuthenticated && (
            <div className="navbar__auth hide-mobile">
              <Link to={ROUTES.LOGIN}    className="btn btn-ghost   btn-sm">Login</Link>
              <Link to={ROUTES.REGISTER} className="btn btn-primary btn-sm">Get Started</Link>
            </div>
          )}

          {/* Logged in */}
          {isAuthenticated && (
            <div className="navbar__user" ref={dropdownRef}>

              {/* Notification bell with unread badge */}
              {isStudent && (
                <Link
                  to={ROUTES.NOTIFICATIONS}
                  className="navbar__bell"
                  aria-label="Notifications"
                  style={{ position:'relative' }}
                  onClick={() => setUnreadCount(0)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                    <path d="M13.73 21a2 2 0 01-3.46 0"/>
                  </svg>
                  {unreadCount > 0 && (
                    <span style={{
                      position:'absolute', top:-6, right:-6,
                      background:'var(--color-error)', color:'#fff',
                      fontSize:'10px', fontWeight:700,
                      width:18, height:18, borderRadius:'50%',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      border:'2px solid var(--color-surface)',
                      animation:'pulse 2s infinite',
                    }}>
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Avatar button */}
              <button
                className="navbar__avatar-btn"
                onClick={() => setDropdownOpen(p => !p)}
                aria-expanded={dropdownOpen}
                aria-label="User menu"
              >
                <Avatar src={user?.avatar} name={user?.name || ''} size="sm" />
                <svg
                  className={`navbar__chevron ${dropdownOpen ? 'navbar__chevron--open' : ''}`}
                  width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="navbar__dropdown animate-fadeInDown">
                  <div className="navbar__dropdown-header">
                    <p className="navbar__dropdown-name">{user?.name}</p>
                    <p className="navbar__dropdown-email">{user?.email}</p>
                    {isStudent && (
                      <p style={{ fontSize:'var(--text-xs)', color:'var(--color-primary)', fontWeight:'var(--font-semibold)', marginTop:2 }}>
                        ⚡ {user?.skill_points || 0} points
                      </p>
                    )}
                  </div>

                  <div className="navbar__dropdown-divider" />

                  {isStudent && (
                    <>
                      <Link to={ROUTES.PROFILE}      className="navbar__dropdown-item" onClick={() => setDropdownOpen(false)}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        Profile
                      </Link>
                      <Link to={ROUTES.PORTFOLIO}    className="navbar__dropdown-item" onClick={() => setDropdownOpen(false)}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                        Portfolio
                      </Link>
                      <Link to={ROUTES.PROGRESS}     className="navbar__dropdown-item" onClick={() => setDropdownOpen(false)}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                        Progress
                      </Link>
                      <Link to={ROUTES.NOTIFICATIONS} className="navbar__dropdown-item" onClick={() => { setDropdownOpen(false); setUnreadCount(0) }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
                        Notifications {unreadCount > 0 && <span style={{ background:'var(--color-error)', color:'#fff', fontSize:'10px', padding:'1px 6px', borderRadius:'999px', marginLeft:4 }}>{unreadCount}</span>}
                      </Link>
                    </>
                  )}

                  {isAdmin && (
                    <Link to={ROUTES.ADMIN_DASHBOARD} className="navbar__dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                      Admin Panel
                    </Link>
                  )}

                  <div className="navbar__dropdown-divider" />

                  <button className="navbar__dropdown-item navbar__dropdown-item--danger" onClick={handleLogout}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Hamburger — mobile */}
          <button
            className={`navbar__hamburger ${menuOpen ? 'navbar__hamburger--open' : ''}`}
            onClick={() => setMenuOpen(p => !p)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {menuOpen && <div className="navbar__overlay" onClick={closeMenu} aria-hidden="true" />}
    </nav>
  )
}

export default Navbar