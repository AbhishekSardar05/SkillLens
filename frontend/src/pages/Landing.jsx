import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div style={{ background: '#09090f', color: '#f1f0ff', fontFamily: "'DM Sans', sans-serif", overflowX: 'hidden' }}>

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { overflow-x: hidden; }
        .nav-link { color: #8b8aad; text-decoration: none; font-size: 0.9rem; transition: color 0.2s; }
        .nav-link:hover { color: #f1f0ff; }
        .feat-card { background: #111120; border: 1px solid rgba(255,255,255,0.07); border-radius: 18px; padding: 28px; transition: all 0.3s; }
        .feat-card:hover { border-color: rgba(99,102,241,0.3); transform: translateY(-4px); }
        .step-card { background: #14142a; border: 1px solid rgba(255,255,255,0.07); border-radius: 20px; padding: 32px; transition: all 0.3s; }
        .step-card:hover { border-color: rgba(124,58,237,0.3); transform: translateY(-5px); }
        .sidebar-item { padding: 9px 12px; border-radius: 10px; font-size: 0.82rem; color: #8b8aad; cursor: pointer; }
        .social-btn { width: 36px; height: 36px; border-radius: 9px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.07); display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 15px; }
        .social-btn:hover { background: rgba(99,102,241,0.15); }
        .footer-link { color: #8b8aad; font-size: 0.875rem; text-decoration: none; }
        .footer-link:hover { color: #f1f0ff; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        .fade1 { animation: fadeUp 0.7s ease forwards; }
        .fade2 { animation: fadeUp 0.7s 0.15s ease forwards; opacity: 0; }
        .fade3 { animation: fadeUp 0.7s 0.3s ease forwards; opacity: 0; }
        .float1 { animation: floatY 4s ease-in-out infinite; }
        .float2 { animation: floatY 4s 1.2s ease-in-out infinite; }
      `}</style>

      {/* ─── NAV ─── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 48px', background: 'rgba(9,9,15,0.8)', backdropFilter: 'blur(18px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>✦</div>
          <span style={{ fontFamily: 'Bricolage Grotesque', fontSize: '1.15rem', fontWeight: 700 }}>Skill<span style={{ color: '#67e8f9' }}>Lens</span></span>
        </div>
        <div style={{ display: 'flex', gap: 36 }}>
          <a href="#features" className="nav-link">Features</a>
          <a href="#how" className="nav-link">How It Works</a>
          <a href="#dashboard" className="nav-link">About</a>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: '#f1f0ff', cursor: 'pointer', fontFamily: 'DM Sans', fontSize: '0.9rem', padding: '8px 18px', borderRadius: 10 }}>Login</button>
          <button onClick={() => navigate('/signup')} style={{ background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', border: 'none', color: '#fff', cursor: 'pointer', fontFamily: 'DM Sans', fontSize: '0.9rem', fontWeight: 600, padding: '9px 22px', borderRadius: 10 }}>Sign Up</button>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '120px 48px 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 55% at 70% 55%, rgba(99,102,241,0.18) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 20% 30%, rgba(124,58,237,0.15) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center', maxWidth: 1280, margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>

          {/* Left */}
          <div>
            <div className="fade1" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 99, padding: '6px 16px', fontSize: '0.8rem', color: '#8b8aad', marginBottom: 24 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              AI-powered career readiness · Now in beta
            </div>
            <h1 className="fade2" style={{ fontFamily: 'Bricolage Grotesque', fontSize: 'clamp(2.6rem,5vw,4rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: 22 }}>
              Smart AI Solutions<br />for{' '}
              <span style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1,#3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Career</span><br />
              <span style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1,#3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Growth</span>
            </h1>
            <p className="fade3" style={{ color: '#8b8aad', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: 480, marginBottom: 36 }}>
              SkillLens analyzes your real skills, uncovers hidden gaps, and maps a personalized roadmap to placement-ready confidence — powered by modern AI.
            </p>
            <div className="fade3" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 52 }}>
              <button onClick={() => navigate('/signup')} style={{ background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', border: 'none', color: '#fff', padding: '13px 28px', borderRadius: 12, fontSize: '1rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s' }}>
                Get Started →
              </button>
              <button style={{ background: 'rgba(255,255,255,0.05)', color: '#f1f0ff', border: '1px solid rgba(255,255,255,0.07)', padding: '13px 28px', borderRadius: 12, fontSize: '1rem', cursor: 'pointer' }}>
                ✦ See how it works
              </button>
            </div>
            <div style={{ display: 'flex', gap: 40 }}>
              {[['70+', 'PROJECTS ANALYZED'], ['10,000+', 'STUDENTS HELPED'], ['100+', 'INSTITUTIONS']].map(([val, label]) => (
                <div key={label}>
                  <div style={{ fontFamily: 'Bricolage Grotesque', fontSize: '1.8rem', fontWeight: 700 }}>{val}</div>
                  <div style={{ color: '#8b8aad', fontSize: '0.72rem', letterSpacing: '0.08em', marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Mockup */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: 520, background: 'rgba(20,20,42,0.8)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 20, backdropFilter: 'blur(10px)', boxShadow: '0 40px 100px rgba(0,0,0,0.5)' }}>
              <div style={{ height: 200, borderRadius: 14, background: 'linear-gradient(135deg,#1a1a40,#2a1a60,#1a2a50)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', marginBottom: 14 }}>
                <div style={{ fontSize: '5rem', opacity: 0.5 }}>🧠</div>
                {/* Float cards */}
                <div className="float1" style={{ position: 'absolute', top: 14, left: 14, background: 'rgba(14,14,26,0.95)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '12px 16px' }}>
                  <div style={{ fontSize: '0.65rem', color: '#8b8aad', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Skill Match</div>
                  <div style={{ fontFamily: 'Bricolage Grotesque', fontSize: '1.4rem', fontWeight: 700 }}>94 <span style={{ fontSize: '0.7rem', color: '#8b8aad' }}>%</span></div>
                  <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.1)', marginTop: 6 }}>
                    <div style={{ height: '100%', width: '94%', background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', borderRadius: 2 }} />
                  </div>
                </div>
                <div className="float2" style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(14,14,26,0.95)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '12px 16px' }}>
                  <div style={{ fontSize: '0.65rem', color: '#8b8aad', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Placement Readiness</div>
                  <div style={{ color: '#4ade80', fontFamily: 'Bricolage Grotesque', fontSize: '1.1rem', fontWeight: 700 }}>+23% <span style={{ fontSize: '0.72rem', color: '#8b8aad' }}>vs last month</span></div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ background: 'rgba(14,14,26,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '12px 16px', flex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>⚙</div>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: '#8b8aad', textTransform: 'uppercase', letterSpacing: '0.1em' }}>AI Engine</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Analyzing resume...</div>
                    <div style={{ fontSize: '0.72rem', color: '#8b8aad' }}>React · Python · SQL <span style={{ color: '#4ade80' }}>● Live</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" style={{ padding: '100px 48px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ fontSize: '0.72rem', letterSpacing: '0.15em', color: '#6366f1', textTransform: 'uppercase', fontWeight: 600, marginBottom: 14 }}>Features</div>
            <h2 style={{ fontFamily: 'Bricolage Grotesque', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: 16 }}>
              Everything you need to land<br />the <span style={{ background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>right role</span>
            </h2>
            <p style={{ color: '#8b8aad', fontSize: '1rem', maxWidth: 560, margin: '0 auto' }}>A complete career intelligence layer built for the modern student.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
            {[
              { icon: '🧠', grad: 'linear-gradient(135deg,#7c3aed,#6366f1)', title: 'AI Skill Analysis', desc: 'Deep-scan your resume, projects, and code to map real-world skills and proficiency depth.' },
              { icon: '📈', grad: 'linear-gradient(135deg,#3b82f6,#6366f1)', title: 'Placement Insights', desc: 'See how you stack up against hiring benchmarks at 100+ companies and target the right roles.' },
              { icon: '🛡', grad: 'linear-gradient(135deg,#6366f1,#7c3aed)', title: 'Secure Dashboard', desc: 'Your data stays yours. End-to-end encrypted storage with granular sharing controls.' },
              { icon: '👥', grad: 'linear-gradient(135deg,#0891b2,#3b82f6)', title: 'Student Community', desc: 'Connect with peers, mentors, and alumni — build, review, and grow together.' },
            ].map(f => (
              <div key={f.title} className="feat-card">
                <div style={{ width: 48, height: 48, borderRadius: 12, background: f.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 18 }}>{f.icon}</div>
                <div style={{ fontFamily: 'Bricolage Grotesque', fontSize: '1.05rem', fontWeight: 700, marginBottom: 10 }}>{f.title}</div>
                <p style={{ color: '#8b8aad', fontSize: '0.875rem', lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how" style={{ padding: '100px 48px', background: 'linear-gradient(180deg,transparent 0%,rgba(99,102,241,0.04) 50%,transparent 100%)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ fontSize: '0.72rem', letterSpacing: '0.15em', color: '#6366f1', textTransform: 'uppercase', fontWeight: 600, marginBottom: 14 }}>How It Works</div>
            <h2 style={{ fontFamily: 'Bricolage Grotesque', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: 16 }}>
              Three steps to <span style={{ background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>career clarity</span>
            </h2>
            <p style={{ color: '#8b8aad', fontSize: '1rem', maxWidth: 560, margin: '0 auto' }}>From raw profile to interview-ready in a focused, guided journey.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {[
              { icon: '👤', num: 'STEP 01', title: 'Create Profile', desc: 'Set up your SkillLens profile in minutes. Import resume, GitHub, and past projects in one click.' },
              { icon: '🔍', num: 'STEP 02', title: 'AI Skill Assessment', desc: 'Our AI evaluates code quality, project depth, and soft skills — mapping gaps with surgical precision.' },
              { icon: '🗺', num: 'STEP 03', title: 'Get Personalized Roadmap', desc: 'Receive a focused, week-by-week plan with curated resources, mock interviews, and job matches.' },
            ].map(s => (
              <div key={s.num} className="step-card">
                <div style={{ width: 56, height: 56, borderRadius: 14, background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 22 }}>{s.icon}</div>
                <div style={{ fontSize: '0.7rem', color: '#8b8aad', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 99, padding: '3px 12px', display: 'inline-block', marginBottom: 14, letterSpacing: '0.1em' }}>{s.num}</div>
                <div style={{ fontFamily: 'Bricolage Grotesque', fontSize: '1.25rem', fontWeight: 700, marginBottom: 12 }}>{s.title}</div>
                <p style={{ color: '#8b8aad', fontSize: '0.875rem', lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DASHBOARD PREVIEW ─── */}
      <section id="dashboard" style={{ padding: '100px 48px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: '0.72rem', letterSpacing: '0.15em', color: '#6366f1', textTransform: 'uppercase', fontWeight: 600, marginBottom: 14 }}>Dashboard Preview</div>
            <h2 style={{ fontFamily: 'Bricolage Grotesque', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: 16 }}>
              Built like a product you'll <span style={{ background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>actually use</span>
            </h2>
            <p style={{ color: '#8b8aad', fontSize: '1rem', maxWidth: 560, margin: '0 auto' }}>A focused, polished workspace that turns your skills into action.</p>
          </div>
          {/* Mockup */}
          <div style={{ background: '#111120', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, overflow: 'hidden', boxShadow: '0 50px 120px rgba(0,0,0,0.5)' }}>
            <div style={{ background: 'rgba(14,14,26,0.95)', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {['#ef4444','#f59e0b','#22c55e'].map(c => <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />)}
              </div>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <span style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 99, padding: '4px 16px', fontSize: '0.75rem', color: '#8b8aad' }}>● app.skilllens.ai/dashboard</span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr' }}>
              <div style={{ background: 'rgba(9,9,15,0.7)', borderRight: '1px solid rgba(255,255,255,0.07)', padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, fontFamily: 'Bricolage Grotesque', fontSize: '0.9rem', fontWeight: 700 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>✦</div>
                  SkillLens
                </div>
                {[['⊞', 'Overview', true], ['📄', 'Resume', false], ['💼', 'Placements', false], ['💬', 'Mentors', false], ['⚙', 'Settings', false]].map(([icon, label, active]) => (
                  <div key={label} className="sidebar-item" style={{ background: active ? 'rgba(99,102,241,0.15)' : 'none', color: active ? '#f1f0ff' : '#8b8aad', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    {icon} {label}
                  </div>
                ))}
              </div>
              <div style={{ padding: 24 }}>
                <div style={{ fontSize: '0.7rem', color: '#8b8aad', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Welcome Back</div>
                <div style={{ fontFamily: 'Bricolage Grotesque', fontSize: '1.4rem', fontWeight: 700, marginBottom: 20 }}>Hi, Aarav 👋</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div style={{ background: 'rgba(14,14,26,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 20 }}>
                    <div style={{ fontSize: '0.75rem', color: '#8b8aad', marginBottom: 8 }}>Resume Score</div>
                    <div style={{ fontFamily: 'Bricolage Grotesque', fontSize: '2rem', fontWeight: 700 }}>85</div>
                    <div style={{ fontSize: '0.75rem', color: '#8b8aad' }}>Ranked <span style={{ color: '#4ade80' }}>Top 8%</span> of CS students</div>
                  </div>
                  <div style={{ background: 'rgba(14,14,26,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 20 }}>
                    <div style={{ fontSize: '0.75rem', color: '#8b8aad', marginBottom: 8 }}>Placement Readiness</div>
                    <div style={{ fontFamily: 'Bricolage Grotesque', fontSize: '2rem', fontWeight: 700 }}>78%</div>
                    <div style={{ fontSize: '0.75rem', color: '#4ade80' }}>↑ +18% this month</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div style={{ background: 'rgba(14,14,26,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 20 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: 14 }}>Top Skills</div>
                    {[['React', 92], ['Python', 84], ['Data Analysis', 71], ['System Design', 58]].map(([name, val]) => (
                      <div key={name} style={{ marginBottom: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: 5 }}><span>{name}</span><span style={{ color: '#8b8aad' }}>{val}%</span></div>
                        <div style={{ height: 5, background: 'rgba(255,255,255,0.07)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${val}%`, background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', borderRadius: 3 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: 'rgba(14,14,26,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', fontWeight: 600, marginBottom: 14 }}>
                      <span>AI Recommendations</span>
                      <span style={{ background: 'rgba(99,102,241,0.2)', color: '#6366f1', borderRadius: 99, padding: '2px 8px', fontSize: '0.65rem' }}>4 new</span>
                    </div>
                    {[['🏅', 'Complete AWS Certification', 'Unlocks 14 new roles'], ['⚡', 'Add GraphQL to your resume', 'High demand at 62 companies'], ['✦', 'Book a mock system design interview', 'Sharpen your weakest area']].map(([icon, title, sub]) => (
                      <div key={title} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>{icon}</div>
                        <div>
                          <div style={{ fontSize: '0.78rem', fontWeight: 500 }}>{title}</div>
                          <div style={{ fontSize: '0.7rem', color: '#8b8aad' }}>{sub}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section style={{ padding: '60px 48px 100px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ borderRadius: 24, padding: '80px 48px', textAlign: 'center', background: 'linear-gradient(135deg,rgba(124,58,237,0.25),rgba(99,102,241,0.15),rgba(59,130,246,0.2))', border: '1px solid rgba(99,102,241,0.2)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 99, padding: '5px 14px', fontSize: '0.75rem', color: '#8b8aad', marginBottom: 22 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', display: 'inline-block', animation: 'pulse 2s infinite' }} /> Join 10,000+ students this month
            </div>
            <h2 style={{ fontFamily: 'Bricolage Grotesque', fontSize: 'clamp(2rem,4vw,3.2rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>
              Start Your{' '}
              <span style={{ background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>AI Career Journey</span>
              {' '}Today
            </h2>
            <p style={{ color: '#8b8aad', maxWidth: 480, margin: '0 auto 36px' }}>Get a free skill analysis and a personalized roadmap in under 2 minutes.</p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 18 }}>
              <button onClick={() => navigate('/signup')} style={{ background: '#fff', color: '#09090f', border: 'none', padding: '14px 32px', borderRadius: 12, fontFamily: 'DM Sans', fontSize: '1rem', fontWeight: 700, cursor: 'pointer' }}>
                Join Now — It's Free →
              </button>
              <button style={{ background: 'rgba(255,255,255,0.06)', color: '#f1f0ff', border: '1px solid rgba(255,255,255,0.07)', padding: '14px 32px', borderRadius: 12, fontFamily: 'DM Sans', fontSize: '1rem', cursor: 'pointer' }}>
                Learn more
              </button>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#8b8aad' }}>
              No credit card required · 2-minute setup · Cancel anytime
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '60px 48px 36px', background: '#0e0e1a' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>✦</div>
                <span style={{ fontFamily: 'Bricolage Grotesque', fontSize: '1.15rem', fontWeight: 700 }}>Skill<span style={{ color: '#67e8f9' }}>Lens</span></span>
              </div>
              <p style={{ color: '#8b8aad', fontSize: '0.875rem', lineHeight: 1.65, maxWidth: 260, marginBottom: 20 }}>
                The AI career intelligence platform built for students. Analyze skills, close gaps, land interviews — confidently.
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                {['🐙', '🐦', '💼', '📸'].map(icon => (
                  <div key={icon} className="social-btn">{icon}</div>
                ))}
              </div>
            </div>
            {[
              ['PRODUCT', ['Features', 'How it works', 'Dashboard', 'Pricing']],
              ['COMPANY', ['About', 'Careers', 'Press', 'Contact']],
              ['RESOURCES', ['Blog', 'Guides', 'Changelog', 'Support']],
            ].map(([heading, links]) => (
              <div key={heading}>
                <h4 style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#8b8aad', marginBottom: 16, fontWeight: 600 }}>{heading}</h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {links.map(l => <li key={l}><a href="#" className="footer-link">{l}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 28 }}>
            <p style={{ color: '#8b8aad', fontSize: '0.8rem' }}>© 2026 SkillLens. All rights reserved.</p>
            <div style={{ display: 'flex', gap: 20 }}>
              {['Privacy', 'Terms', 'Security'].map(l => <a key={l} href="#" className="footer-link" style={{ fontSize: '0.8rem' }}>{l}</a>)}
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}