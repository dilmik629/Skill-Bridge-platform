import { useState, useEffect } from 'react'
import Loader from '../../components/common/Loader'
import dashboardService from '../../services/dashboardService'
import './student.css'

const NOTIF_ICONS = {
  project_approved: { icon:'🎉', bg:'var(--color-success-bg)'  },
  project_rejected: { icon:'❌', bg:'var(--color-error-bg)'    },
  quiz_passed:      { icon:'🧠', bg:'var(--color-accent-bg)'   },
  quiz_failed:      { icon:'😢', bg:'var(--color-warning-bg)'  },
  new_submission:   { icon:'📤', bg:'var(--color-primary-bg)'  },
  default:          { icon:'🔔', bg:'var(--color-bg)'          },
}

const Notifications = () => {
  const [notifs,  setNotifs]  = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardService.getNotifications()
      .then(res => setNotifs(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const markRead = async (id) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
    try { await dashboardService.markRead(id) } catch {}
  }

  const markAll = async () => {
    setNotifs(prev => prev.map(n => ({ ...n, is_read: true })))
    try { await dashboardService.markAllRead() } catch {}
  }

  const unread = notifs.filter(n => !n.is_read).length

  if (loading) return <Loader fullPage text="Loading notifications..." />

  return (
    <div className="student-page">
      <div className="container" style={{ maxWidth:680 }}>

        <div className="page-header animate-fadeInDown">
          <div className="page-header__top">
            <div>
              <p className="page-header__eyebrow">Inbox</p>
              <h1 className="page-header__title">
                🔔 Notifications
                {unread > 0 && (
                  <span style={{ marginLeft:'var(--space-3)', background:'var(--color-error)', color:'#fff', fontSize:'var(--text-xs)', fontWeight:'var(--font-bold)', padding:'2px 10px', borderRadius:'var(--radius-full)' }}>
                    {unread}
                  </span>
                )}
              </h1>
            </div>
            {unread > 0 && (
              <button className="btn btn-ghost btn-sm" onClick={markAll}>✓ Mark all read</button>
            )}
          </div>
        </div>

        {notifs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">📭</div>
            <h3 className="empty-state__title">No notifications yet</h3>
            <p className="empty-state__desc">Activity updates will appear here.</p>
          </div>
        ) : (
          <div style={{ background:'var(--color-surface)', border:'1px solid var(--color-border)', borderRadius:'var(--radius-2xl)', overflow:'hidden', boxShadow:'var(--shadow-sm)' }} className="animate-fadeInUp">
            {notifs.map((n, i) => {
              const style = NOTIF_ICONS[n.type] || NOTIF_ICONS.default
              return (
                <div
                  key={n.id}
                  className={`notif-item ${!n.is_read ? 'notif-item--unread' : ''}`}
                  onClick={() => markRead(n.id)}
                  style={{ borderBottom: i < notifs.length-1 ? '1px solid var(--color-border)' : 'none' }}>
                  <div className="notif-item__icon" style={{ background: style.bg }}>{style.icon}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div className="notif-item__title">{n.title}</div>
                    <div className="notif-item__desc">{n.message}</div>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'var(--space-2)', flexShrink:0 }}>
                    <span className="notif-item__time">
                      {new Date(n.created_at).toLocaleDateString()}
                    </span>
                    {!n.is_read && <div className="notif-dot" />}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Notifications