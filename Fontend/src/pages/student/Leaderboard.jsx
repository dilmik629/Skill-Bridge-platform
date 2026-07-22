import { useState, useEffect } from 'react'
import Avatar from '../../components/common/Avatar'
import Badge from '../../components/common/Badge'
import Loader from '../../components/common/Loader'
import leaderboardService from '../../services/leaderboardService'
import './student.css'

const FILTERS = ['All Time','This Month','This Week']

const Leaderboard = () => {
  const [data,    setData]    = useState([])
  const [loading, setLoading] = useState(true)
  const [filter,  setFilter]  = useState('All Time')

  useEffect(() => {
    leaderboardService.get()
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader fullPage text="Loading leaderboard..." />

  const top3 = data.slice(0, 3)
  const rest  = data.slice(3)

  return (
    <div className="student-page">
      <div className="container">
        <div className="page-header animate-fadeInDown">
          <div className="page-header__top">
            <div>
              <p className="page-header__eyebrow">Rankings</p>
              <h1 className="page-header__title">🏆 Leaderboard</h1>
              <p className="page-header__subtitle">Top students ranked by project completion and scores.</p>
            </div>
            <div style={{ display:'flex', background:'var(--color-surface)', border:'1px solid var(--color-border)', borderRadius:'var(--radius-xl)', padding:4, gap:4 }}>
              {FILTERS.map(f => (
                <button key={f} onClick={()=>setFilter(f)}
                  style={{ padding:'var(--space-2) var(--space-4)', borderRadius:'var(--radius-lg)', border:'none', cursor:'pointer', fontSize:'var(--text-sm)', fontWeight:'var(--font-semibold)', fontFamily:'inherit', transition:'all .2s',
                    background:filter===f?'var(--color-primary)':'none', color:filter===f?'#fff':'var(--color-text-secondary)' }}>
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Podium */}
        {top3.length > 0 && (
          <div className="leaderboard-podium animate-fadeInUp">
            {[top3[1], top3[0], top3[2]].filter(Boolean).map(u => (
              <div key={u.rank} className={`podium-card podium-card--${u.rank===1?'1st':u.rank===2?'2nd':'3rd'}`}>
                <div className="podium-rank">{u.rank===1?'🥇':u.rank===2?'🥈':'🥉'}</div>
                <Avatar name={u.student?.name} size="lg" rank={u.rank} />
                <div className="podium-name">{u.student?.name}{u.is_me && ' 👈'}</div>
                <div className="podium-pts">{u.total_points} pts</div>
                <div className="podium-label">{u.projects_completed} projects</div>
              </div>
            ))}
          </div>
        )}

        {/* Table */}
        {rest.length > 0 && (
          <div className="leaderboard-table animate-fadeInUp" style={{ animationDelay:'200ms' }}>
            <div style={{ padding:'var(--space-4) var(--space-6)', borderBottom:'1px solid var(--color-border)', display:'grid', gridTemplateColumns:'48px 1fr auto auto', gap:'var(--space-4)', fontSize:'var(--text-xs)', fontWeight:'var(--font-bold)', color:'var(--color-text-muted)', textTransform:'uppercase', letterSpacing:'.06em' }}>
              <span style={{textAlign:'center'}}>#</span><span>Student</span><span style={{textAlign:'right'}}>Projects</span><span style={{textAlign:'right'}}>Points</span>
            </div>
            {rest.map(u => (
              <div key={u.rank} className={`leaderboard-row ${u.is_me?'leaderboard-row--me':''}`}>
                <span className="lb-rank">{u.rank}</span>
                <div className="lb-user">
                  <Avatar name={u.student?.name} size="sm" />
                  <div>
                    <div className="lb-name">{u.student?.name}{u.is_me&&<span style={{color:'var(--color-primary)',marginLeft:6,fontSize:'var(--text-xs)',fontWeight:'var(--font-bold)'}}>YOU</span>}</div>
                  </div>
                </div>
                <span className="lb-projects">{u.projects_completed} done</span>
                <span className="lb-pts">{u.total_points}</span>
              </div>
            ))}
          </div>
        )}

        {data.length === 0 && (
          <div className="empty-state">
            <div className="empty-state__icon">🏆</div>
            <h3 className="empty-state__title">Leaderboard is empty</h3>
            <p className="empty-state__desc">Complete projects to appear on the leaderboard!</p>
          </div>
        )}
      </div>
    </div>
  )
}
export default Leaderboard