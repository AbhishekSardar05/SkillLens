import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import API from '../api/axios'

// ── MINI COMPONENTS ──
const SkillTag = ({ skill, color = '#6366f1', bg = 'rgba(99,102,241,0.12)', border = 'rgba(99,102,241,0.25)', onRemove }) => (
  <span style={{ background: bg, border: `1px solid ${border}`, color, borderRadius: 8, padding: '5px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'DM Sans' }}>
    {skill}
    {onRemove && <span onClick={() => onRemove(skill)} style={{ cursor: 'pointer', color: '#f87171', fontWeight: 700, fontSize: '0.9rem' }}>×</span>}
  </span>
)

const CircleProgress = ({ pct, size = 120, stroke = 10 }) => {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const filled = circ - (pct / 100) * circ
  const color = pct >= 70 ? '#4ade80' : pct >= 40 ? '#fbbf24' : '#f87171'
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={filled} style={{ transition: 'stroke-dashoffset 1s ease' }} />
      <text x="50%" y="50%" textAnchor="middle" dy="0.35em" fill={color} fontSize={size * 0.22} fontWeight="800" fontFamily="Bricolage Grotesque" style={{ transform: 'rotate(90deg)', transformOrigin: 'center' }}>{pct}%</text>
    </svg>
  )
}

const PieChart = ({ matched, missing }) => {
  const total = matched + missing
  if (total === 0) return null
  const matchedPct = matched / total
  const r = 40
  const circ = 2 * Math.PI * r
  const matchedDash = matchedPct * circ
  return (
    <svg width="100" height="100" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(248,113,113,0.4)" strokeWidth="16" />
      <circle cx="50" cy="50" r={r} fill="none" stroke="#4ade80" strokeWidth="16" strokeDasharray={`${matchedDash} ${circ}`} strokeDashoffset={circ * 0.25} strokeLinecap="round" style={{ transition: 'stroke-dasharray 1s ease' }} />
      <text x="50" y="47" textAnchor="middle" fill="white" fontSize="11" fontWeight="700" fontFamily="Bricolage Grotesque">{matched}</text>
      <text x="50" y="60" textAnchor="middle" fill="#8b8aad" fontSize="7">matched</text>
    </svg>
  )
}

// ── AI CHAT COMPONENT ──
const AIChat = ({ skills, missingSkills, role, score, onClose }) => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: `Hi! I'm your AI Career Assistant 🤖\n\nI can see you're targeting **${role || 'a tech role'}** with a **${score || 0}% match**.\n\nAsk me anything:\n• "What should I learn first?"\n• "Give me a study plan"\n• "What projects should I build?"\n• "Interview tips for ${role || 'this role'}"` }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  const SUGGESTIONS = ['What should I learn first?', 'Give me a 30-day roadmap', 'Suggest 3 projects', 'Interview tips']

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const sendMessage = async (text) => {
    const msg = text || input.trim()
    if (!msg) return
    setInput('')
    setMessages(p => [...p, { role: 'user', text: msg }])
    setLoading(true)

    try {
      const { data } = await API.post('/ai/chat', {
        message: msg,
        skills: skills || [],
        missingSkills: missingSkills || [],
        role: role || '',
        score: score || 0
      })
      setMessages(p => [...p, { role: 'ai', text: data.reply }])
    } catch {
      setMessages(p => [...p, { role: 'ai', text: 'Sorry, AI is unavailable right now. Please check your API configuration.' }])
    }
    setLoading(false)
  }

  return (
    <div style={{ position: 'fixed', bottom: 90, right: 24, width: 380, height: 520, background: '#111120', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, display: 'flex', flexDirection: 'column', zIndex: 1000, boxShadow: '0 20px 60px rgba(0,0,0,0.5)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🤖</div>
          <div>
            <div style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: '0.95rem' }}>AI Career Assistant</div>
            <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} /> Online
            </div>
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', borderRadius: 8, width: 28, height: 28, cursor: 'pointer', fontSize: '1rem' }}>×</button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            {msg.role === 'ai' && <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', flexShrink: 0, marginRight: 8, marginTop: 4 }}>🤖</div>}
            <div style={{ maxWidth: '80%', background: msg.role === 'user' ? 'linear-gradient(135deg,#7c3aed,#3b82f6)' : 'rgba(255,255,255,0.06)', borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', padding: '10px 14px', fontSize: '0.82rem', lineHeight: 1.6, color: '#f1f0ff', whiteSpace: 'pre-wrap' }}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>🤖</div>
            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '16px 16px 16px 4px', padding: '10px 14px', display: 'flex', gap: 4 }}>
              {[0, 0.2, 0.4].map((d, i) => <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1', animation: `bounce 1s ${d}s infinite` }} />)}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      <div style={{ padding: '8px 14px', display: 'flex', gap: 6, flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        {SUGGESTIONS.map((s, i) => (
          <button key={i} onClick={() => sendMessage(s)} style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#818cf8', borderRadius: 99, padding: '4px 10px', fontSize: '0.7rem', cursor: 'pointer', fontFamily: 'DM Sans' }}>{s}</button>
        ))}
      </div>

      {/* Input */}
      <div style={{ padding: '10px 14px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Ask anything about your career..."
          style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '8px 12px', color: '#f1f0ff', fontSize: '0.82rem', fontFamily: 'DM Sans', outline: 'none' }}
        />
        <button onClick={() => sendMessage()} style={{ background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', border: 'none', borderRadius: 10, width: 36, height: 36, cursor: 'pointer', color: '#fff', fontSize: '1rem' }}>→</button>
      </div>
    </div>
  )
}

// ── MAIN COMPONENT ──
export default function SkillGap() {
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedRole, setSelectedRole] = useState('')
  const [experience, setExperience] = useState('intermediate')
  const [skills, setSkills] = useState([])
  const [skillInput, setSkillInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const [showChat, setShowChat] = useState(false)
  const [showAllInterviews, setShowAllInterviews] = useState(false)

  const JOB_ROLES = ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Data Scientist', 'DevOps Engineer', 'Data Analyst', 'Mobile Developer', 'UI/UX Designer']

  const ROLE_ICONS = { 'Frontend Developer': '🎨', 'Backend Developer': '⚙️', 'Full Stack Developer': '🔥', 'Data Scientist': '🧠', 'DevOps Engineer': '🚀', 'Data Analyst': '📊', 'Mobile Developer': '📱', 'UI/UX Designer': '✏️' }

  useEffect(() => {
    if (location.state?.skills?.length > 0) setSkills(location.state.skills)
  }, [])

  const addSkill = () => {
    const s = skillInput.trim().toLowerCase()
    if (s && !skills.includes(s)) { setSkills(p => [...p, s]); setSkillInput('') }
  }

  const removeSkill = (s) => setSkills(p => p.filter(x => x !== s))

  const analyze = async () => {
    if (!selectedRole) return setError('Please select a job role')
    if (skills.length === 0) return setError('Please add at least one skill')
    setLoading(true); setError('')
    try {
      const { data } = await API.post('/skillgap/analyze', { jobRole: selectedRole, userSkills: skills, experience })
      setResult(data); setActiveTab('overview')
    } catch (err) {
      setError(err.response?.data?.message || 'Analysis failed')
    }
    setLoading(false)
  }

  const getStatusLabel = (pct) => pct >= 70 ? { label: 'Job Ready 🎯', color: '#4ade80', bg: 'rgba(74,222,128,0.12)' } : pct >= 40 ? { label: 'Intermediate ⚡', color: '#fbbf24', bg: 'rgba(251,191,36,0.12)' } : { label: 'Beginner 🌱', color: '#f87171', bg: 'rgba(248,113,113,0.12)' }
  const gc = (pct) => pct >= 70 ? '#4ade80' : pct >= 40 ? '#fbbf24' : '#f87171'
  const TABS = ['overview', 'skills', 'roadmap', 'projects', 'interview']

  return (
    <div style={{ minHeight: '100vh', background: '#09090f', color: '#f1f0ff', fontFamily: 'DM Sans, sans-serif', padding: '0' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        *{box-sizing:border-box}
        input::placeholder{color:#555577}
        input:focus,select:focus{outline:none;border-color:rgba(124,58,237,0.5)!important}
        @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
        .role-card:hover{border-color:rgba(124,58,237,0.4)!important;background:rgba(124,58,237,0.08)!important}
        .tab-btn:hover{background:rgba(255,255,255,0.05)!important}
        .skill-suggest:hover{background:rgba(99,102,241,0.15)!important}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:2px}
      `}</style>

      {/* Navbar */}
      <nav style={{ background: 'rgba(9,9,15,0.9)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>✦</div>
          <span style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: '1.1rem' }}>Skill<span style={{ color: '#67e8f9' }}>Lens</span></span>
        </div>
        <button onClick={() => navigate('/dashboard')} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#8b8aad', borderRadius: 10, padding: '8px 16px', cursor: 'pointer', fontFamily: 'DM Sans', fontSize: '0.85rem' }}>← Dashboard</button>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>

        {!result ? (
          /* ── INPUT SECTION ── */
          <div style={{ animation: 'fadeUp 0.5s ease' }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 99, padding: '5px 14px', fontSize: '0.75rem', color: '#818cf8', marginBottom: 16 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', animation: 'pulse 2s infinite' }} /> AI-Powered Analysis
              </div>
              <h1 style={{ fontFamily: 'Bricolage Grotesque', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, marginBottom: 12 }}>
                Skill Gap <span style={{ background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Analyzer</span>
              </h1>
              <p style={{ color: '#8b8aad', fontSize: '1rem', maxWidth: 500, margin: '0 auto' }}>
                Find exactly what skills you need, get a personalized roadmap, and track your progress to your dream job.
              </p>
            </div>

            {/* Role Selection */}
            <div style={{ background: '#0f0f1e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 24, marginBottom: 20 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 16, color: '#f1f0ff' }}>🎯 Select Target Role</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
                {JOB_ROLES.map(role => (
                  <div key={role} className="role-card" onClick={() => setSelectedRole(role)} style={{ background: selectedRole === role ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.02)', border: `1px solid ${selectedRole === role ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 12, padding: '14px 10px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
                    <div style={{ fontSize: '1.6rem', marginBottom: 6 }}>{ROLE_ICONS[role]}</div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 500, color: selectedRole === role ? '#f1f0ff' : '#d1d0f0', lineHeight: 1.3 }}>{role}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience Level */}
            <div style={{ background: '#0f0f1e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 24, marginBottom: 20 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 14, color: '#f1f0ff' }}>📊 Experience Level</div>
              <div style={{ display: 'flex', gap: 12 }}>
                {[['beginner', '🌱 Beginner', '0-1 years'], ['intermediate', '⚡ Intermediate', '1-3 years'], ['advanced', '🔥 Advanced', '3+ years']].map(([val, label, sub]) => (
                  <div key={val} onClick={() => setExperience(val)} style={{ flex: 1, background: experience === val ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.02)', border: `1px solid ${experience === val ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 12, padding: 14, cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: 4, color: experience === val ? '#f1f0ff' : '#d1d0f0' }}>{label}</div>
                    <div style={{ fontSize: '0.72rem', color: '#8b8aad' }}>{sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Input */}
            <div style={{ background: '#0f0f1e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 24, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f1f0ff' }}>🧠 Your Skills</div>
                {location.state?.skills?.length > 0 && <span style={{ background: 'rgba(74,222,128,0.12)', color: '#4ade80', borderRadius: 99, padding: '3px 10px', fontSize: '0.7rem' }}>✓ Auto-filled from resume</span>}
              </div>
              <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                <input
                  style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 14px', color: '#f1f0ff', fontSize: '0.9rem', fontFamily: 'DM Sans' }}
                  placeholder="Type a skill and press Enter..."
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addSkill()}
                />
                <button onClick={addSkill} style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8', borderRadius: 10, padding: '10px 18px', cursor: 'pointer', fontFamily: 'DM Sans', fontWeight: 600 }}>+ Add</button>
              </div>

              {/* Quick Add Chips */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: '0.72rem', color: '#8b8aad', marginBottom: 8 }}>Quick add:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {['javascript', 'python', 'react', 'nodejs', 'sql', 'git', 'docker', 'aws', 'figma', 'typescript'].filter(s => !skills.includes(s)).slice(0, 8).map(s => (
                    <button key={s} className="skill-suggest" onClick={() => setSkills(p => [...p, s])} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: '#8b8aad', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'DM Sans', transition: 'all 0.15s' }}>+ {s}</button>
                  ))}
                </div>
              </div>

              {skills.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {skills.map(s => <SkillTag key={s} skill={s} onRemove={removeSkill} />)}
                </div>
              ) : (
                <div style={{ color: '#555577', fontSize: '0.85rem', textAlign: 'center', padding: '12px 0' }}>No skills added yet</div>
              )}
            </div>

            {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', borderRadius: 12, padding: '12px 16px', marginBottom: 16, fontSize: '0.88rem' }}>{error}</div>}

            <button onClick={analyze} disabled={loading} style={{ width: '100%', background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', border: 'none', color: '#fff', padding: 16, borderRadius: 14, fontSize: '1.05rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              {loading ? <><span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⚙</span> Analyzing with AI...</> : '🔍 Analyze Skill Gap'}
            </button>
          </div>
        ) : (
          /* ── RESULT SECTION ── */
          <div style={{ animation: 'fadeUp 0.5s ease' }}>
            {/* Hero Card */}
            <div style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.15),rgba(59,130,246,0.15))', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 24, padding: '32px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <CircleProgress pct={result.matchPercentage} size={130} stroke={12} />
                <span style={{ ...getStatusLabel(result.matchPercentage), borderRadius: 99, padding: '5px 16px', fontSize: '0.82rem', fontWeight: 600, background: getStatusLabel(result.matchPercentage).bg }}>
                  {getStatusLabel(result.matchPercentage).label}
                </span>
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontSize: '0.72rem', color: '#8b8aad', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Target Role</div>
                <h2 style={{ fontFamily: 'Bricolage Grotesque', fontSize: '1.6rem', fontWeight: 800, marginBottom: 16 }}>{ROLE_ICONS[result.jobRole]} {result.jobRole}</h2>
                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 16 }}>
                  {[
                    { label: 'Matched', val: result.matchedSkills.length, color: '#4ade80' },
                    { label: 'Missing', val: result.missingSkills.length, color: '#f87171' },
                    { label: 'Required', val: result.totalRequired, color: '#818cf8' },
                  ].map(stat => (
                    <div key={stat.label} style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: 'Bricolage Grotesque', fontSize: '1.6rem', fontWeight: 800, color: stat.color }}>{stat.val}</div>
                      <div style={{ fontSize: '0.72rem', color: '#8b8aad' }}>{stat.label}</div>
                    </div>
                  ))}
                </div>
                {/* Progress Bar */}
                <div style={{ height: 8, background: 'rgba(255,255,255,0.07)', borderRadius: 4, overflow: 'hidden', marginBottom: 8 }}>
                  <div style={{ height: '100%', width: `${result.matchPercentage}%`, background: `linear-gradient(135deg,${gc(result.matchPercentage)},${gc(result.matchPercentage)}88)`, borderRadius: 4, transition: 'width 1s ease' }} />
                </div>
                <div style={{ fontSize: '0.78rem', color: '#8b8aad' }}>
                  🕐 Job-ready in approximately <strong style={{ color: '#f1f0ff' }}>{result.jobReadyDays.min}–{result.jobReadyDays.max} days</strong> of focused practice
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <PieChart matched={result.matchedSkills.length} missing={result.missingSkills.length} />
                <div style={{ display: 'flex', gap: 10, fontSize: '0.68rem' }}>
                  <span style={{ color: '#4ade80' }}>● Matched</span>
                  <span style={{ color: '#f87171' }}>● Missing</span>
                </div>
              </div>
            </div>

            {/* AI Feedback */}
            <div style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 16, padding: 20, marginBottom: 20 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 12, color: '#818cf8' }}>🤖 AI Analysis</div>
              {result.feedback.map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '6px 0', fontSize: '0.85rem', color: '#d1d0f0', lineHeight: 1.6, borderBottom: i < result.feedback.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <span style={{ color: '#7c3aed', flexShrink: 0, marginTop: 2 }}>→</span>{f}
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
              {TABS.map(tab => (
                <button key={tab} className="tab-btn" onClick={() => setActiveTab(tab)} style={{ background: activeTab === tab ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${activeTab === tab ? 'rgba(99,102,241,0.35)' : 'rgba(255,255,255,0.07)'}`, color: activeTab === tab ? '#f1f0ff' : '#8b8aad', borderRadius: 10, padding: '8px 16px', cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'DM Sans', fontWeight: activeTab === tab ? 600 : 400, transition: 'all 0.15s', textTransform: 'capitalize' }}>
                  {tab === 'overview' ? '📋 Overview' : tab === 'skills' ? `🧠 Skills (${result.totalRequired})` : tab === 'roadmap' ? '🗺️ Roadmap' : tab === 'projects' ? '🚀 Projects' : '❓ Interview'}
                </button>
              ))}
            </div>

            {/* Tab: Overview */}
            {activeTab === 'overview' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, animation: 'fadeUp 0.3s ease' }}>
                <div style={ts.card}>
                  <div style={ts.cardTitle}>✅ Skills You Have ({result.matchedSkills.length})</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
                    {result.matchedSkills.length > 0 ? result.matchedSkills.map((s, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ color: '#4ade80', fontSize: '0.9rem' }}>✓</span>
                          <span style={{ fontSize: '0.84rem', textTransform: 'capitalize' }}>{s.skill}</span>
                        </div>
                        <span style={{ background: 'rgba(74,222,128,0.1)', color: '#4ade80', borderRadius: 99, padding: '2px 8px', fontSize: '0.68rem', fontWeight: 600 }}>{s.level}</span>
                      </div>
                    )) : <div style={ts.empty}>No matching skills found</div>}
                  </div>
                </div>
                <div style={ts.card}>
                  <div style={ts.cardTitle}>❌ Skills You Need ({result.missingSkills.length})</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
                    {result.missingSkills.length > 0 ? result.missingSkills.map((s, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ color: '#f87171', fontSize: '0.9rem' }}>✗</span>
                          <span style={{ fontSize: '0.84rem', textTransform: 'capitalize' }}>{s.skill}</span>
                        </div>
                        <span style={{ background: s.priority === 'High' ? 'rgba(239,68,68,0.1)' : s.priority === 'Medium' ? 'rgba(251,191,36,0.1)' : 'rgba(99,102,241,0.1)', color: s.priority === 'High' ? '#f87171' : s.priority === 'Medium' ? '#fbbf24' : '#818cf8', borderRadius: 99, padding: '2px 8px', fontSize: '0.68rem', fontWeight: 600 }}>{s.priority}</span>
                      </div>
                    )) : <div style={{ color: '#4ade80', fontSize: '0.85rem', textAlign: 'center', padding: '12px' }}>🎉 You have all required skills!</div>}
                  </div>
                </div>
                {result.extraSkills?.length > 0 && (
                  <div style={{ ...ts.card, gridColumn: '1 / -1' }}>
                    <div style={ts.cardTitle}>⭐ Bonus Skills You Have</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                      {result.extraSkills.map((s, i) => <SkillTag key={i} skill={s} color="#fbbf24" bg="rgba(251,191,36,0.1)" border="rgba(251,191,36,0.2)" />)}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Skills (bar chart) */}
            {activeTab === 'skills' && (
              <div style={{ animation: 'fadeUp 0.3s ease' }}>
                <div style={ts.card}>
                  <div style={ts.cardTitle}>📊 Skill Match Overview</div>
                  <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[...result.matchedSkills, ...result.missingSkills].map((s, i) => {
                      const isMatched = result.matchedSkills.some(m => m.skill === s.skill)
                      const barWidth = isMatched ? (s.level === 'Advanced' ? 90 : s.level === 'Intermediate' ? 65 : 40) : 0
                      return (
                        <div key={i}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 6 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ color: isMatched ? '#4ade80' : '#f87171' }}>{isMatched ? '✓' : '✗'}</span>
                              <span style={{ textTransform: 'capitalize' }}>{s.skill}</span>
                            </div>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                              <span style={{ background: s.priority === 'High' ? 'rgba(239,68,68,0.1)' : s.priority === 'Medium' ? 'rgba(251,191,36,0.1)' : 'rgba(99,102,241,0.1)', color: s.priority === 'High' ? '#f87171' : s.priority === 'Medium' ? '#fbbf24' : '#818cf8', borderRadius: 99, padding: '1px 7px', fontSize: '0.65rem' }}>{s.priority}</span>
                              <span style={{ color: isMatched ? '#4ade80' : '#f87171', fontSize: '0.72rem' }}>{isMatched ? `${barWidth}%` : '0%'}</span>
                            </div>
                          </div>
                          <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${barWidth}%`, background: isMatched ? 'linear-gradient(135deg,#4ade80,#22c55e)' : 'rgba(248,113,113,0.3)', borderRadius: 3, transition: 'width 0.8s ease' }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Roadmap */}
            {activeTab === 'roadmap' && (
              <div style={{ animation: 'fadeUp 0.3s ease' }}>
                <div style={ts.card}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <div style={ts.cardTitle}>🗺️ Your Learning Roadmap</div>
                    <span style={{ background: 'rgba(74,222,128,0.1)', color: '#4ade80', borderRadius: 99, padding: '4px 12px', fontSize: '0.75rem', fontWeight: 600 }}>
                      ~{result.jobReadyDays.min}–{result.jobReadyDays.max} days
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {result.roadmap.map((step, i) => {
                      const typeColors = { foundation: '#6366f1', core: '#7c3aed', frontend: '#3b82f6', backend: '#059669', database: '#d97706', security: '#dc2626', devops: '#7c3aed', advanced: '#7c3aed', projects: '#10b981', job_prep: '#4ade80', framework: '#3b82f6', integration: '#06b6d4', ml: '#8b5cf6', data: '#f59e0b', visualization: '#ec4899', tools: '#f97316', programming: '#6366f1', research: '#14b8a6', coding: '#3b82f6', containers: '#2563eb', orchestration: '#7c3aed', automation: '#059669', cloud: '#0ea5e9', iac: '#6366f1' }
                      const color = typeColors[step.type] || '#6366f1'
                      return (
                        <div key={i} style={{ display: 'flex', gap: 16, position: 'relative' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ width: 36, height: 36, borderRadius: '50%', background: color + '20', border: `2px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Bricolage Grotesque', fontSize: '0.8rem', fontWeight: 700, color, flexShrink: 0, zIndex: 1 }}>{i + 1}</div>
                            {i < result.roadmap.length - 1 && <div style={{ width: 2, flex: 1, background: `linear-gradient(${color}, rgba(255,255,255,0.06))`, margin: '4px 0' }} />}
                          </div>
                          <div style={{ flex: 1, paddingBottom: 20 }}>
                            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 4 }}>
                              <span style={{ background: color + '15', color, borderRadius: 99, padding: '2px 10px', fontSize: '0.7rem', fontWeight: 600 }}>Week {step.week}</span>
                            </div>
                            <div style={{ fontSize: '0.88rem', color: '#d1d0f0', lineHeight: 1.5 }}>{step.task}</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Projects */}
            {activeTab === 'projects' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, animation: 'fadeUp 0.3s ease' }}>
                {result.projects.map((proj, i) => (
                  <div key={i} style={{ ...ts.card, borderLeft: `3px solid ${i === 0 ? '#7c3aed' : i === 1 ? '#3b82f6' : '#10b981'}` }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: [' rgba(124,58,237,0.15)', 'rgba(59,130,246,0.15)', 'rgba(16,185,129,0.15)'][i], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                        {['🏗️', '⚡', '🎯'][i]}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: '1rem', marginBottom: 6 }}>{proj.name}</div>
                        <div style={{ color: '#8b8aad', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: 10 }}>{proj.desc}</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {proj.skills.map((s, j) => <SkillTag key={j} skill={s} color="#818cf8" bg="rgba(99,102,241,0.1)" border="rgba(99,102,241,0.2)" />)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab: Interview */}
            {activeTab === 'interview' && (
              <div style={ts.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div style={ts.cardTitle}>❓ Interview Questions for {result.jobRole}</div>
                  <span style={{ background: 'rgba(99,102,241,0.1)', color: '#818cf8', borderRadius: 99, padding: '3px 10px', fontSize: '0.72rem' }}>{result.interviews.length} questions</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {(showAllInterviews ? result.interviews : result.interviews.slice(0, 5)).map((q, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)', animation: 'fadeUp 0.3s ease' }}>
                      <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
                      <span style={{ fontSize: '0.85rem', color: '#d1d0f0', lineHeight: 1.6 }}>{q}</span>
                    </div>
                  ))}
                </div>
                {!showAllInterviews && result.interviews.length > 5 && (
                  <button onClick={() => setShowAllInterviews(true)} style={{ width: '100%', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', color: '#818cf8', borderRadius: 10, padding: 12, cursor: 'pointer', fontFamily: 'DM Sans', fontWeight: 600, fontSize: '0.85rem', marginTop: 12 }}>
                    Show All {result.interviews.length} Questions →
                  </button>
                )}
              </div>
            )}

            {/* Reset */}
            <button onClick={() => { setResult(null); setActiveTab('overview') }} style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#8b8aad', borderRadius: 12, padding: 13, cursor: 'pointer', fontFamily: 'DM Sans', fontSize: '0.9rem', marginTop: 16 }}>
              🔄 Analyze Again
            </button>
          </div>
        )}
      </div>

      {/* Floating AI Chat Button */}
      {result && (
        <>
          <button onClick={() => setShowChat(!showChat)} style={{ position: 'fixed', bottom: 24, right: 24, width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', border: 'none', color: '#fff', fontSize: '1.4rem', cursor: 'pointer', zIndex: 999, boxShadow: '0 8px 24px rgba(124,58,237,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {showChat ? '✕' : '💬'}
          </button>
          {showChat && (
            <AIChat
              skills={result.matchedSkills.map(s => s.skill)}
              missingSkills={result.missingSkills.map(s => s.skill)}
              role={result.jobRole}
              score={result.matchPercentage}
              onClose={() => setShowChat(false)}
            />
          )}
        </>
      )}

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

const ts = {
  card: { background: '#0f0f1e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 22 },
  cardTitle: { fontSize: '0.9rem', fontWeight: 600, color: '#f1f0ff' },
  empty: { color: '#8b8aad', fontSize: '0.85rem', textAlign: 'center', padding: '12px 0' }
}
