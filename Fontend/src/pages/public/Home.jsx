import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Badge from '../../components/common/Badge'
import projectService from '../../services/projectService'
import { ROUTES } from '../../utils/constants'

const CATEGORIES = [
  { icon: '💻', title: 'Web Development',  count: '38 projects', variant: 'violet' },
  { icon: '🎨', title: 'UI / UX Design',    count: '21 projects', variant: 'pink'   },
  { icon: '🎥', title: 'Videography',       count: '14 projects', variant: 'cyan'   },
  { icon: '📸', title: 'Photography',       count: '17 projects', variant: 'amber'  },
  { icon: '✍️', title: 'Content Writing',   count: '12 projects', variant: 'mint'   },
  { icon: '📊', title: 'Data & Analytics',  count: '19 projects', variant: 'blue'   },
]

const Home = () => {
  const [featured, setFeatured] = useState([])

  useEffect(() => {
    projectService.getAll({ per_page: 3 })
      .then(res => setFeatured(res.data.data || []))
      .catch(console.error)
  }, [])

  return (
    <div style={{ overflowX: 'hidden' }}>

      {/* ══════════════════ HERO ══════════════════ */}
      <section style={{
        backgroundImage: 'var(--gradient-hero), url(https://images.unsplash.com/photo-1522071820081-009f0129c71c?fm=jpg&q=80&w=2000&auto=format&fit=crop)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: 'var(--space-24) 0 var(--space-20)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div className="blob floaty" style={{ width: 480, height: 480, background: 'rgba(124,58,237,.16)', top: -140, right: -100 }} />
        <div className="blob floaty-slow" style={{ width: 380, height: 380, background: 'rgba(236,72,153,.14)', bottom: -120, left: -100 }} />
        <div className="blob" style={{ width: 220, height: 220, background: 'rgba(6,182,212,.12)', top: '30%', left: '46%' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 'var(--space-12)', alignItems: 'center' }}>

            {/* Left — copy */}
            <div>
              <div className="glass-pill" style={{ marginBottom: 'var(--space-6)' }}>
                👋 Welcome to SkillBridge
              </div>

              <h1 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)', lineHeight: 1.12, letterSpacing: '-.02em', marginBottom: 'var(--space-6)', color: '#fff', textShadow: '0 2px 24px rgba(0,0,0,.25)' }}>
                Build Real Projects.<br />
                <span style={{ background: 'linear-gradient(90deg,#C4B5FD,#F9A8D4)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Earn Real Skills.</span> 🚀
              </h1>

              <p style={{ fontSize: 'var(--text-lg)', color: 'rgba(255,255,255,.82)', lineHeight: 'var(--leading-relaxed)', maxWidth: 520, marginBottom: 'var(--space-8)' }}>
                Apply for curated projects across dev, design, video & more — prove your skills with quizzes, get expert feedback, and build a portfolio that actually stands out. ✨
              </p>

              <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', marginBottom: 'var(--space-10)' }}>
                <Link to={ROUTES.REGISTER} className="btn btn-lg btn-primary">
                  🚀 Get Started Free
                </Link>
                <Link to={ROUTES.PROJECTS} className="btn btn-lg glass" style={{ color: 'var(--color-primary-dark)', fontWeight: 'var(--font-semibold)' }}>
                  🔍 Browse Projects →
                </Link>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <div className="avatar-stack">
                  <span className="avatar-stack__item" style={{ background: 'var(--color-violet)' }}>H</span>
                  <span className="avatar-stack__item" style={{ background: 'var(--color-pink)' }}>D</span>
                  <span className="avatar-stack__item" style={{ background: 'var(--color-cyan)' }}>S</span>
                  <span className="avatar-stack__item" style={{ background: 'var(--color-amber)' }}>+</span>
                </div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,.75)' }}>
                  <b style={{ color: '#fff' }}>2.4k+</b> students already building 🎓
                </p>
              </div>
            </div>

            {/* Right — glass showcase visual */}
            <div style={{ position: 'relative' }}>
              <div className="glass-card floaty-slow" style={{ padding: 'var(--space-5)', transform: 'rotate(2deg)' }}>
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?fm=jpg&q=80&w=900&auto=format&fit=crop"
                  alt="Students collaborating on a project"
                  style={{ width: '100%', borderRadius: 'var(--radius-lg)', display: 'block', maxHeight: 300, objectFit: 'cover' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-4)' }}>
                  <div>
                    <div style={{ fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-sm)' }}>🎬 Brand Promo Video</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Videography · Intermediate</div>
                  </div>
                  <Badge status="open" size="sm" />
                </div>
              </div>

              <div className="glass-card floaty" style={{ position: 'absolute', top: -28, right: -24, width: 168, padding: 'var(--space-4)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.6rem' }}>🏆</div>
                <div style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-extrabold)' }} className="gradient-text">Top 1%</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Leaderboard rank</div>
              </div>

              <div className="glass-card floaty" style={{ position: 'absolute', bottom: -24, left: -30, width: 180, padding: 'var(--space-4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <span className="icon-chip icon-chip--mint" style={{ width: 34, height: 34, fontSize: '1rem' }}>✅</span>
                  <div>
                    <div style={{ fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-sm)' }}>Portfolio Piece</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Ready to showcase</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating stats glass bar */}
          <div className="glass-card" style={{ marginTop: 'var(--space-20)', padding: 'var(--space-6) var(--space-8)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 'var(--space-6)', textAlign: 'center' }}>
              {[
                { num: '120+',  label: 'Live Projects',   icon: '📁' },
                { num: '2.4k+', label: 'Active Students', icon: '🧑‍💻' },
                { num: '98%',   label: 'Completion Rate', icon: '✅' },
                { num: '50+',   label: 'Skills Covered',  icon: '⚡' },
              ].map((s, i) => (
                <div key={i}>
                  <div style={{ fontSize: '1.8rem', marginBottom: 'var(--space-1)' }}>{s.icon}</div>
                  <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-extrabold)' }} className="gradient-text">{s.num}</div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', fontWeight: 'var(--font-medium)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ CATEGORIES ══════════════════ */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <p className="glass-pill" style={{ marginBottom: 'var(--space-4)' }}>🎯 Explore by Category</p>
            <h2 style={{ marginBottom: 'var(--space-3)' }}>Find Your Craft</h2>
            <p style={{ color: 'var(--color-text-muted)', maxWidth: 480, margin: '0 auto' }}>Whatever you're into — there's a project waiting for you.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'var(--space-5)' }}>
            {CATEGORIES.map((c, i) => (
              <Link key={i} to={ROUTES.PROJECTS} className={`shed-card shed-card--${c.variant}`} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', textDecoration: 'none' }}>
                <span className={`icon-chip icon-chip--${c.variant}`}>{c.icon}</span>
                <div>
                  <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--color-text-primary)', marginBottom: 2 }}>{c.title}</h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>{c.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ HOW IT WORKS ══════════════════ */}
      <section className="section" style={{ background: 'linear-gradient(180deg, rgba(243,238,255,.5), transparent)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <p style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-bold)', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 'var(--space-3)' }}>How It Works</p>
            <h2 style={{ marginBottom: 'var(--space-4)' }}>Simple Steps to Success</h2>
            <p style={{ color: 'var(--color-text-muted)', maxWidth: 500, margin: '0 auto' }}>From applying to building your portfolio — we guide you through every step.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 'var(--space-6)' }}>
            {[
              { step: '01', icon: '🔍', title: 'Browse Projects', desc: 'Find projects that match your skill level — beginner to advanced.' },
              { step: '02', icon: '🧠', title: 'Pass the Quiz',   desc: "Take a 20-question skill quiz to prove you're ready for the project." },
              { step: '03', icon: '💻', title: 'Build & Submit',  desc: 'Work on the project and submit via GitHub when done.' },
              { step: '04', icon: '🏆', title: 'Get Reviewed',    desc: 'Admin reviews your work, gives feedback, and you earn skill points.' },
            ].map((s, i) => (
              <div key={i} className="glass-card" style={{ textAlign: 'center' }}>
                <div className="icon-chip icon-chip--violet" style={{ margin: '0 auto var(--space-4)' }}>{s.icon}</div>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-bold)', color: 'var(--color-primary)', marginBottom: 'var(--space-2)', letterSpacing: '.06em' }}>STEP {s.step}</div>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-2)' }}>{s.title}</h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 'var(--leading-relaxed)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ TRANSFORMATION ══════════════════ */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <p className="glass-pill" style={{ marginBottom: 'var(--space-4)' }}>📈 Real Growth</p>
            <h2 style={{ marginBottom: 'var(--space-3)' }}>Your Transformation Starts Here</h2>
            <p style={{ color: 'var(--color-text-muted)', maxWidth: 500, margin: '0 auto' }}>See how students go from "just learning" to "hire-ready" in a few completed projects.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'var(--space-6)' }}>
            {[
              { emoji: '🌱', from: 'Beginner', to: 'Junior Dev',   pct: 72, variant: 'violet' },
              { emoji: '🎨', from: 'Hobbyist', to: 'UI Designer',  pct: 85, variant: 'pink'   },
              { emoji: '🎥', from: 'Newbie',   to: 'Video Editor', pct: 64, variant: 'cyan'   },
            ].map((t, i) => (
              <div key={i} className={`shed-card shed-card--${t.variant}`}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                  <span className={`icon-chip icon-chip--${t.variant}`}>{t.emoji}</span>
                  <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-extrabold)' }} className="gradient-text">{t.pct}%</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-3)' }}>
                  <span style={{ color: 'var(--color-text-muted)', fontWeight: 'var(--font-normal)' }}>{t.from}</span>
                  <span>→</span>
                  <span>{t.to}</span>
                </div>
                <div style={{ height: 8, borderRadius: 'var(--radius-full)', background: 'rgba(124,58,237,.1)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${t.pct}%`, borderRadius: 'var(--radius-full)', background: 'var(--gradient-primary)' }} />
                </div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-3)' }}>Portfolio strength after 3 completed projects</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ FEATURED PROJECTS ══════════════════ */}
      {featured.length > 0 && (
        <section className="section">
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-8)' }}>
              <div>
                <p style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-bold)', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 'var(--space-2)' }}>Live Now</p>
                <h2>Featured Projects</h2>
              </div>
              <Link to={ROUTES.PROJECTS} className="btn btn-secondary">View All →</Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'var(--space-5)' }}>
              {featured.map((p) => (
                <Link key={p.id} to={`/projects/${p.id}`} style={{ textDecoration: 'none' }}>
                  <div className="glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <span className="icon-chip icon-chip--violet">{p.category?.icon || '📁'}</span>
                      <Badge status={p.status} size="sm" />
                    </div>
                    <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--color-text-primary)' }}>{p.title}</h3>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 'var(--leading-relaxed)', flex: 1 }}>
                      {p.description?.slice(0, 90)}...
                    </p>
                    <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                      <Badge level={p.level} size="sm" />
                      {p.category && <Badge label={p.category.name} variant="neutral" size="sm" />}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--color-border)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                      <span>📅 {p.deadline}</span>
                      <span style={{ color: 'var(--color-primary)', fontWeight: 'var(--font-semibold)' }}>Apply →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════ CTA ══════════════════ */}
      <section style={{ background: 'var(--gradient-cta)', padding: 'var(--space-20) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 'var(--text-4xl)', color: '#fff', marginBottom: 'var(--space-4)', letterSpacing: '-.02em' }}>
            Ready to Start Building? 🎉
          </h2>
          <p style={{ fontSize: 'var(--text-lg)', color: 'rgba(255,255,255,.85)', marginBottom: 'var(--space-8)', maxWidth: 480, margin: '0 auto var(--space-8)' }}>
            Join thousands of students building real projects and advancing their careers.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to={ROUTES.REGISTER} className="btn btn-lg" style={{ background: '#fff', color: 'var(--color-primary)', fontWeight: 'var(--font-bold)' }}>
              🚀 Create Free Account
            </Link>
            <Link to={ROUTES.PROJECTS} className="btn btn-lg" style={{ background: 'rgba(255,255,255,.12)', color: '#fff', border: '1.5px solid rgba(255,255,255,.35)' }}>
              Browse Projects →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
