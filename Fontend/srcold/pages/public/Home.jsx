import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Badge from '../../components/common/Badge'
import projectService from '../../services/projectService'
import { ROUTES } from '../../utils/constants'

const Home = () => {
  const [featured, setFeatured] = useState([])

  useEffect(() => {
    projectService.getAll({ per_page: 3 })
      .then(res => setFeatured(res.data.data || []))
      .catch(console.error)
  }, [])

  return (
    <div>
      {/* ── Hero ── */}
      <section style={{
        backgroundImage: 'linear-gradient(135deg, rgba(30,27,75,.92) 0%, rgba(46, 45, 65, 0.88) 45%, rgba(8,145,178,.85) 100%), url(https://images.unsplash.com/photo-1754548930550-be9fa88874f4?fm=jpg&q=80&w=2000&auto=format&fit=crop)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: 'var(--space-24) 0',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Blobs */}
        <div style={{ position:'absolute', width:500, height:500, borderRadius:'50%', background:'rgba(6,182,212,.15)', filter:'blur(80px)', top:-100, right:-100, pointerEvents:'none' }} />
        <div style={{ position:'absolute', width:400, height:400, borderRadius:'50%', background:'rgba(129,140,248,.15)', filter:'blur(80px)', bottom:-80, left:-80, pointerEvents:'none' }} />

        <div className="container" style={{ position:'relative', zIndex:1, textAlign:'center' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'var(--space-2)', background:'rgba(255,255,255,.12)', border:'1px solid rgba(255,255,255,.25)', color:'#fff', fontSize:'var(--text-xs)', fontWeight:'var(--font-semibold)', padding:'6px 16px', borderRadius:'var(--radius-full)', marginBottom:'var(--space-6)', backdropFilter:'blur(8px)' }}>
            👋 Welcome to SkillBridge
          </div>

          <h1 style={{ fontSize:'clamp(2rem, 5vw, 3.5rem)', fontWeight:'var(--font-extrabold)', color:'#fff', lineHeight:1.15, letterSpacing:'-.02em', marginBottom:'var(--space-6)', maxWidth:720, margin:'0 auto var(--space-6)', textShadow:'0 2px 20px rgba(0,0,0,.25)' }}>
            Build Real Projects.<br />
            <span style={{ background:'linear-gradient(90deg,#67E8F9,#A5F3FC)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
              Earn Real Skills.
            </span>
          </h1>

          <p style={{ fontSize:'var(--text-lg)', color:'rgba(255,255,255,.85)', lineHeight:'var(--leading-relaxed)', maxWidth:560, margin:'0 auto var(--space-10)' }}>
            Apply for curated projects, prove your skills with quizzes, get admin feedback, and build a portfolio that stands out.
          </p>

          <div style={{ display:'flex', gap:'var(--space-4)', justifyContent:'center', flexWrap:'wrap' }}>
            <Link to={ROUTES.REGISTER} className="btn btn-lg" style={{ background:'#fff', color:'var(--color-primary)', fontWeight:'var(--font-bold)', boxShadow:'0 4px 20px rgba(0,0,0,.2)' }}>
              🚀 Get Started Free
            </Link>
            <Link to={ROUTES.PROJECTS} className="btn btn-lg" style={{ background:'rgba(255,255,255,.15)', color:'#fff', border:'1.5px solid rgba(255,255,255,.35)', backdropFilter:'blur(8px)' }}>
              🔍 Browse Projects →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ background:'var(--color-surface)', borderBottom:'1px solid var(--color-border)', padding:'var(--space-8) 0' }}>
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'var(--space-6)', textAlign:'center' }}>
            {[
              { num:'120+',  label:'Live Projects',    icon:'📁' },
              { num:'2.4k+', label:'Active Students',  icon:'🧑‍💻' },
              { num:'98%',   label:'Completion Rate',  icon:'✅' },
              { num:'50+',   label:'Skills Covered',   icon:'⚡' },
            ].map((s,i) => (
              <div key={i} style={{ animation:`fadeInUp .4s ease ${i*100}ms both` }}>
                <div style={{ fontSize:'2rem', marginBottom:'var(--space-2)' }}>{s.icon}</div>
                <div style={{ fontSize:'var(--text-3xl)', fontWeight:'var(--font-extrabold)', color:'var(--color-primary)', letterSpacing:'-.02em' }}>{s.num}</div>
                <div style={{ fontSize:'var(--text-sm)', color:'var(--color-text-muted)', fontWeight:'var(--font-medium)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign:'center', marginBottom:'var(--space-12)' }}>
            <p style={{ fontSize:'var(--text-xs)', fontWeight:'var(--font-bold)', color:'var(--color-primary)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'var(--space-3)' }}>How It Works</p>
            <h2 style={{ fontSize:'var(--text-3xl)', fontWeight:'var(--font-bold)', marginBottom:'var(--space-4)' }}>Simple Steps to Success</h2>
            <p style={{ color:'var(--color-text-muted)', maxWidth:500, margin:'0 auto' }}>From applying to building your portfolio — we guide you through every step.</p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'var(--space-6)' }}>
            {[
              { step:'01', icon:'🔍', title:'Browse Projects',    desc:'Find projects that match your skill level — beginner to advanced.'      },
              { step:'02', icon:'🧠', title:'Pass the Quiz',      desc:'Take a 20-question skill quiz to prove you\'re ready for the project.'   },
              { step:'03', icon:'💻', title:'Build & Submit',     desc:'Work on the project and submit via GitHub when done.'                    },
              { step:'04', icon:'🏆', title:'Get Reviewed',       desc:'Admin reviews your work, gives feedback, and you earn skill points.'     },
            ].map((s,i) => (
              <div key={i} className="card" style={{ textAlign:'center', animation:`fadeInUp .5s ease ${i*100}ms both` }}>
                <div style={{ width:48, height:48, background:'var(--color-primary-bg)', borderRadius:'var(--radius-full)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto var(--space-4)', fontSize:'1.4rem' }}>
                  {s.icon}
                </div>
                <div style={{ fontSize:'var(--text-xs)', fontWeight:'var(--font-bold)', color:'var(--color-primary)', marginBottom:'var(--space-2)', letterSpacing:'.06em' }}>STEP {s.step}</div>
                <h3 style={{ fontSize:'var(--text-base)', fontWeight:'var(--font-semibold)', marginBottom:'var(--space-2)' }}>{s.title}</h3>
                <p style={{ fontSize:'var(--text-sm)', color:'var(--color-text-muted)', lineHeight:'var(--leading-relaxed)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Projects (Real API) ── */}
      {featured.length > 0 && (
        <section className="section" style={{ background:'var(--color-surface)', borderTop:'1px solid var(--color-border)' }}>
          <div className="container">
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'var(--space-8)' }}>
              <div>
                <p style={{ fontSize:'var(--text-xs)', fontWeight:'var(--font-bold)', color:'var(--color-primary)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'var(--space-2)' }}>Live Now</p>
                <h2 style={{ fontSize:'var(--text-3xl)', fontWeight:'var(--font-bold)' }}>Featured Projects</h2>
              </div>
              <Link to={ROUTES.PROJECTS} className="btn btn-secondary">View All →</Link>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'var(--space-5)' }}>
              {featured.map((p, i) => (
                <Link key={p.id} to={`/projects/${p.id}`} style={{ textDecoration:'none' }}>
                  <div className="card" style={{ cursor:'pointer', height:'100%', display:'flex', flexDirection:'column', gap:'var(--space-3)', animation:`fadeInUp .4s ease ${i*100}ms both` }}
                    onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='var(--shadow-lg)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='' }}>
                    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
                      <div style={{ width:46, height:46, background:'var(--color-primary-bg)', borderRadius:'var(--radius-lg)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem' }}>
                        {p.category?.icon || '📁'}
                      </div>
                      <Badge status={p.status} size="sm" />
                    </div>
                    <h3 style={{ fontSize:'var(--text-base)', fontWeight:'var(--font-semibold)', color:'var(--color-text-primary)' }}>{p.title}</h3>
                    <p style={{ fontSize:'var(--text-sm)', color:'var(--color-text-muted)', lineHeight:'var(--leading-relaxed)', flex:1 }}>
                      {p.description?.slice(0,90)}...
                    </p>
                    <div style={{ display:'flex', gap:'var(--space-2)', flexWrap:'wrap' }}>
                      <Badge level={p.level} size="sm" />
                      {p.category && <Badge label={p.category.name} variant="neutral" size="sm" />}
                    </div>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:'var(--space-3)', borderTop:'1px solid var(--color-border)', fontSize:'var(--text-xs)', color:'var(--color-text-muted)' }}>
                      <span>📅 {p.deadline}</span>
                      <span style={{ color:'var(--color-primary)', fontWeight:'var(--font-semibold)' }}>Apply →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Features ── */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign:'center', marginBottom:'var(--space-12)' }}>
            <h2 style={{ fontSize:'var(--text-3xl)', fontWeight:'var(--font-bold)', marginBottom:'var(--space-4)' }}>Everything You Need</h2>
            <p style={{ color:'var(--color-text-muted)', maxWidth:480, margin:'0 auto' }}>A complete platform built for serious learners.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'var(--space-5)' }}>
            {[
              { icon:'🧠', title:'Skill Quizzes',       desc:'20-question MCQ quizzes test your knowledge before you begin a project.' },
              { icon:'📊', title:'Progress Tracking',   desc:'Monitor your growth across projects with visual progress indicators.'    },
              { icon:'🏆', title:'Live Leaderboard',    desc:'Compete with peers. Earn points and climb the ranks as you complete projects.' },
              { icon:'📁', title:'Auto Portfolio',      desc:'Your completed projects automatically build a shareable portfolio page.' },
              { icon:'💬', title:'Expert Feedback',     desc:'Admins review your work and give detailed, actionable feedback.'        },
              { icon:'🐙', title:'GitHub Integration',  desc:'Link your repos. Showcase your real code to future employers.'          },
            ].map((f,i) => (
              <div key={i} className="card" style={{ animation:`fadeInUp .4s ease ${i*80}ms both` }}>
                <div style={{ fontSize:'2rem', marginBottom:'var(--space-3)' }}>{f.icon}</div>
                <h3 style={{ fontSize:'var(--text-base)', fontWeight:'var(--font-semibold)', marginBottom:'var(--space-2)' }}>{f.title}</h3>
                <p style={{ fontSize:'var(--text-sm)', color:'var(--color-text-muted)', lineHeight:'var(--leading-relaxed)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background:'linear-gradient(135deg,#3730A3,#4F46E5)', padding:'var(--space-20) 0' }}>
        <div className="container" style={{ textAlign:'center' }}>
          <h2 style={{ fontSize:'var(--text-4xl)', fontWeight:'var(--font-extrabold)', color:'#fff', marginBottom:'var(--space-4)', letterSpacing:'-.02em' }}>
            Ready to Start Building?
          </h2>
          <p style={{ fontSize:'var(--text-lg)', color:'rgba(255,255,255,.80)', marginBottom:'var(--space-8)', maxWidth:480, margin:'0 auto var(--space-8)' }}>
            Join thousands of students building real projects and advancing their careers.
          </p>
          <div style={{ display:'flex', gap:'var(--space-4)', justifyContent:'center', flexWrap:'wrap' }}>
            <Link to={ROUTES.REGISTER} className="btn btn-lg" style={{ background:'#fff', color:'var(--color-primary)', fontWeight:'var(--font-bold)' }}>
              🚀 Create Free Account
            </Link>
            <Link to={ROUTES.PROJECTS} className="btn btn-lg" style={{ background:'rgba(255,255,255,.15)', color:'#fff', border:'1.5px solid rgba(255,255,255,.35)' }}>
              Browse Projects →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home