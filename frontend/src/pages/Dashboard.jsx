// import { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import API from '../api/axios'

// export default function Dashboard() {
//   const navigate = useNavigate()
//   const [user, setUser] = useState(null)
//   const [resumes, setResumes] = useState([])
//   const [analyses, setAnalyses] = useState([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const u = localStorage.getItem('user')
//     if (!u) { navigate('/login'); return }
//     setUser(JSON.parse(u))
//     fetchData()
//     fetchFreshProfile()
//   }, [])

//   const fetchFreshProfile = async () => {
//     try {
//       const { data } = await API.get('/auth/profile')
//       setUser(data)
//       localStorage.setItem('user', JSON.stringify(data))
//     } catch {}
//   }

//   const fetchData = async () => {
//     try {
//       const [resumeRes, analysisRes] = await Promise.all([
//         API.get('/resume/my'),
//         API.get('/skillgap/my')
//       ])
//       setResumes(resumeRes.data)
//       setAnalyses(analysisRes.data)
//     } catch (err) {
//       console.log('Fetch error:', err.message)
//     }
//     setLoading(false)
//   }

//   const logout = () => { localStorage.clear(); navigate('/login') }

//   const latestResume = resumes[0]
//   const latestAnalysis = analyses[0]

//   const getColor = (score) => score >= 70 ? '#4ade80' : score >= 50 ? '#fbbf24' : '#f87171'

//   if (!user) return null

//   return (
//     <div style={styles.page}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
//         .nav-item:hover { background: rgba(255,255,255,0.06) !important; color: #f1f0ff !important; }
//         .card-hover:hover { border-color: rgba(99,102,241,0.3) !important; transform: translateY(-2px); }
//         * { box-sizing: border-box; }
//       `}</style>

//       {/* Sidebar */}
//       <div style={styles.sidebar}>
//         <div style={styles.sidebarLogo}>
//           <div style={styles.logoIcon}>✦</div>
//           <span style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: '1rem' }}>SkillLens</span>
//         </div>

//         <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
//           {[
//             { icon: '⊞', label: 'Overview', path: '/dashboard', active: true },
//             { icon: '📄', label: 'Resume', path: '/upload' },
//             { icon: '🎯', label: 'Skill Gap', path: '/skillgap' },
//             { icon: '👤', label: 'Profile', path: '/profile' },
//           ].map(item => (
//             <div key={item.label} className="nav-item" onClick={() => navigate(item.path)} style={{ ...styles.navItem, ...(item.active ? styles.navActive : {}) }}>
//               <span>{item.icon}</span>
//               <span>{item.label}</span>
//             </div>
//           ))}
//           {user.isAdmin && (
//             <div className="nav-item" onClick={() => navigate('/admin')} style={{ ...styles.navItem, color: '#7c3aed' }}>
//               <span>👑</span>
//               <span>Admin Panel</span>
//             </div>
//           )}
//         </nav>

//         <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 12 }}>
//           <div className="nav-item" onClick={logout} style={{ ...styles.navItem, color: '#f87171' }}>
//             <span>⏻</span>
//             <span>Logout</span>
//           </div>
//         </div>
//       </div>

//       {/* Main */}
//       <div style={styles.main}>
//         {/* Header */}
//         <div style={styles.header}>
//           <div>
//             <div style={styles.welcomeText}>WELCOME BACK</div>
//             <div style={styles.userName}>Hi, {user.name} 👋</div>
//           </div>
//           <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
//             {user?.profilePhoto && user.profilePhoto !== '' ? (
//               <img
//                 src={user.profilePhoto.startsWith('http') ? user.profilePhoto : `http://localhost:5000${user.profilePhoto}`}
//                 alt="Profile"
//                 onClick={() => navigate('/profile')}
//                 onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
//                 style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(124,58,237,0.4)', cursor: 'pointer' }}
//               />
//             ) : null}
//             <div
//               onClick={() => navigate('/profile')}
//               style={{ ...styles.avatar, display: (user?.profilePhoto && user.profilePhoto !== '') ? 'none' : 'flex' }}
//             >
//               {user?.name?.[0]?.toUpperCase()}
//             </div>
//           </div>
//         </div>

//         {loading ? (
//           <div style={{ color: '#8b8aad', padding: '40px 0', textAlign: 'center' }}>⏳ Loading your data...</div>
//         ) : (
//           <>
//             {/* Stats Cards */}
//             <div style={styles.statsRow}>
//               <div className="card-hover" style={styles.statCard}>
//                 <div style={styles.statLabel}>Resume Score</div>
//                 <div style={{ ...styles.statVal, color: getColor(latestResume?.score || 0) }}>
//                   {latestResume?.score || '--'}
//                 </div>
//                 <div style={styles.statSub}>{latestResume ? 'Latest upload' : 'No resume yet'}</div>
//               </div>
//               <div className="card-hover" style={styles.statCard}>
//                 <div style={styles.statLabel}>ATS Score</div>
//                 <div style={{ ...styles.statVal, color: getColor(latestResume?.atsScore || 0) }}>
//                   {latestResume?.atsScore || '--'}
//                 </div>
//                 <div style={styles.statSub}>Applicant Tracking</div>
//               </div>
//               <div className="card-hover" style={styles.statCard}>
//                 <div style={styles.statLabel}>Placement Readiness</div>
//                 <div style={{ ...styles.statVal, color: '#818cf8' }}>
//                   {latestResume?.placementReadiness || '--'}{latestResume ? '%' : ''}
//                 </div>
//                 <div style={styles.statSub}>Job Ready Score</div>
//               </div>
//               <div className="card-hover" style={styles.statCard}>
//                 <div style={styles.statLabel}>Skill Match</div>
//                 <div style={{ ...styles.statVal, color: getColor(latestAnalysis?.matchPercentage || 0) }}>
//                   {latestAnalysis?.matchPercentage || '--'}{latestAnalysis ? '%' : ''}
//                 </div>
//                 <div style={styles.statSub}>{latestAnalysis?.jobRole || 'No analysis yet'}</div>
//               </div>
//             </div>

//             <div style={styles.bottomGrid}>
//               {/* Skills Card */}
//               <div style={styles.card}>
//                 <div style={styles.cardHeader}>
//                   <span style={styles.cardTitle}>🧠 Top Skills</span>
//                   <span style={styles.cardMeta}>From latest resume</span>
//                 </div>
//                 {latestResume?.skills?.length > 0 ? (
//                   <div>
//                     {latestResume.skills.slice(0, 6).map(skill => (
//                       <div key={skill} style={{ marginBottom: 10 }}>
//                         <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 5 }}>
//                           <span style={{ textTransform: 'capitalize' }}>{skill}</span>
//                           <span style={{ color: '#8b8aad' }}>Detected</span>
//                         </div>
//                         <div style={styles.barBg}>
//                           <div style={{ ...styles.barFill, width: `${60 + Math.random() * 35}%` }} />
//                         </div>
//                       </div>
//                     ))}
//                     <button onClick={() => navigate('/upload')} style={styles.viewAllBtn}>View All Skills →</button>
//                   </div>
//                 ) : (
//                   <div style={styles.emptyState}>
//                     <div style={{ fontSize: '2rem', marginBottom: 10 }}>📄</div>
//                     <div style={{ color: '#8b8aad', fontSize: '0.85rem', marginBottom: 14 }}>Upload your resume to see skills</div>
//                     <button onClick={() => navigate('/upload')} style={styles.ctaBtn}>Upload Resume →</button>
//                   </div>
//                 )}
//               </div>

//               {/* Right Column */}
//               <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
//                 {/* AI Recommendations */}
//                 <div style={styles.card}>
//                   <div style={styles.cardHeader}>
//                     <span style={styles.cardTitle}>✨ AI Recommendations</span>
//                     <span style={{ background: 'rgba(99,102,241,0.2)', color: '#6366f1', borderRadius: 99, padding: '2px 8px', fontSize: '0.65rem' }}>Live</span>
//                   </div>
//                   {[
//                     { icon: '🏅', title: 'Complete AWS Certification', sub: 'Unlocks 14 new roles', color: '#fbbf24' },
//                     { icon: '⚡', title: 'Add GraphQL to resume', sub: 'High demand at 62 companies', color: '#818cf8' },
//                     { icon: '🎯', title: 'Book a mock interview', sub: 'Sharpen your weakest area', color: '#4ade80' },
//                   ].map((rec, i) => (
//                     <div key={i} style={styles.recItem}>
//                       <div style={{ ...styles.recIcon, background: rec.color + '20' }}>{rec.icon}</div>
//                       <div style={{ flex: 1 }}>
//                         <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{rec.title}</div>
//                         <div style={{ fontSize: '0.72rem', color: '#8b8aad', marginTop: 2 }}>{rec.sub}</div>
//                       </div>
//                       <span style={{ color: rec.color, fontSize: '0.8rem' }}>↗</span>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Quick Actions */}
//                 <div style={styles.card}>
//                   <div style={{ ...styles.cardTitle, marginBottom: 14 }}>🚀 Quick Actions</div>
//                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
//                     {[
//                       { icon: '📄', label: 'Upload Resume', path: '/upload', color: '#7c3aed' },
//                       { icon: '🎯', label: 'Skill Gap', path: '/skillgap', color: '#6366f1' },
//                       { icon: '👤', label: 'Profile', path: '/profile', color: '#3b82f6' },
//                       { icon: '🔑', label: 'Change Password', path: '/forgot-password', color: '#f59e0b' },
//                     ].map(action => (
//                       <button key={action.label} onClick={() => navigate(action.path)} style={{ ...styles.quickAction, borderColor: action.color + '30' }}>
//                         <span style={{ fontSize: '1.2rem' }}>{action.icon}</span>
//                         <span style={{ fontSize: '0.78rem', color: '#d1d0f0' }}>{action.label}</span>
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Resume History */}
//             {resumes.length > 0 && (
//               <div style={{ ...styles.card, marginTop: 16 }}>
//                 <div style={styles.cardHeader}>
//                   <span style={styles.cardTitle}>📋 Resume History</span>
//                   <span style={styles.cardMeta}>{resumes.length} uploads</span>
//                 </div>
//                 <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
//                   {resumes.slice(0, 3).map(resume => (
//                     <div key={resume._id} style={styles.resumeRow}>
//                       <div>
//                         <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>📄 {resume.fileName}</div>
//                         <div style={{ fontSize: '0.72rem', color: '#8b8aad', marginTop: 2 }}>
//                           {new Date(resume.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {resume.skills?.length || 0} skills
//                         </div>
//                       </div>
//                       <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
//                         <div style={{ textAlign: 'center' }}>
//                           <div style={{ color: getColor(resume.score), fontWeight: 700, fontSize: '0.9rem' }}>{resume.score}</div>
//                           <div style={{ color: '#8b8aad', fontSize: '0.65rem' }}>Score</div>
//                         </div>
//                         <div style={{ textAlign: 'center' }}>
//                           <div style={{ color: getColor(resume.atsScore), fontWeight: 700, fontSize: '0.9rem' }}>{resume.atsScore}</div>
//                           <div style={{ color: '#8b8aad', fontSize: '0.65rem' }}>ATS</div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Skill Gap History */}
//             {analyses.length > 0 && (
//               <div style={{ ...styles.card, marginTop: 16 }}>
//                 <div style={styles.cardHeader}>
//                   <span style={styles.cardTitle}>🎯 Skill Gap History</span>
//                   <span style={styles.cardMeta}>{analyses.length} analyses</span>
//                 </div>
//                 <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
//                   {analyses.slice(0, 3).map(a => (
//                     <div key={a._id} style={styles.resumeRow}>
//                       <div>
//                         <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>🎯 {a.jobRole}</div>
//                         <div style={{ fontSize: '0.72rem', color: '#8b8aad', marginTop: 2 }}>
//                           {new Date(a.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {a.missingSkills?.length || 0} missing skills
//                         </div>
//                       </div>
//                       <div style={{ color: getColor(a.matchPercentage), fontWeight: 700, fontSize: '1.1rem' }}>
//                         {a.matchPercentage}%
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Empty State */}
//             {resumes.length === 0 && analyses.length === 0 && (
//               <div style={styles.bigEmpty}>
//                 <div style={{ fontSize: '3rem', marginBottom: 16 }}>🚀</div>
//                 <h2 style={{ fontFamily: 'Bricolage Grotesque', fontSize: '1.5rem', fontWeight: 700, marginBottom: 10 }}>
//                   Start Your Career Journey!
//                 </h2>
//                 <p style={{ color: '#8b8aad', marginBottom: 24, maxWidth: 400, textAlign: 'center' }}>
//                   Upload your resume to get AI-powered analysis, skill insights, and a personalized roadmap.
//                 </p>
//                 <div style={{ display: 'flex', gap: 12 }}>
//                   <button onClick={() => navigate('/upload')} style={styles.ctaBtn}>📄 Upload Resume →</button>
//                   <button onClick={() => navigate('/skillgap')} style={styles.ctaBtnOutline}>🎯 Check Skill Gap</button>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   )
// }

// const styles = {
//   page: { display: 'flex', minHeight: '100vh', background: '#09090f', color: '#f1f0ff', fontFamily: 'DM Sans, sans-serif' },
//   sidebar: { width: 220, background: 'rgba(9,9,15,0.98)', borderRight: '1px solid rgba(255,255,255,0.07)', padding: '24px 16px', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, bottom: 0, left: 0 },
//   sidebarLogo: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32, paddingLeft: 8 },
//   logoIcon: { width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 },
//   navItem: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, fontSize: '0.85rem', color: '#8b8aad', cursor: 'pointer', transition: 'all 0.2s' },
//   navActive: { background: 'rgba(99,102,241,0.15)', color: '#f1f0ff' },
//   main: { flex: 1, marginLeft: 220, padding: '32px 36px', overflowY: 'auto' },
//   header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
//   welcomeText: { fontSize: '0.7rem', color: '#8b8aad', letterSpacing: '0.1em', marginBottom: 4 },
//   userName: { fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: '1.6rem', fontWeight: 700 },
//   uploadBtn: { background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', border: 'none', color: '#fff', padding: '9px 18px', borderRadius: 10, cursor: 'pointer', fontFamily: 'DM Sans', fontSize: '0.85rem', fontWeight: 600 },
//   avatar: { width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 700, cursor: 'pointer' },
//   statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 },
//   statCard: { background: '#111120', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '20px', transition: 'all 0.2s' },
//   statLabel: { fontSize: '0.72rem', color: '#8b8aad', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 },
//   statVal: { fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: '2rem', fontWeight: 800, marginBottom: 4 },
//   statSub: { fontSize: '0.72rem', color: '#8b8aad' },
//   bottomGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
//   card: { background: '#111120', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '20px' },
//   cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
//   cardTitle: { fontSize: '0.88rem', fontWeight: 600 },
//   cardMeta: { fontSize: '0.72rem', color: '#8b8aad' },
//   barBg: { height: 5, background: 'rgba(255,255,255,0.07)', borderRadius: 3, overflow: 'hidden' },
//   barFill: { height: '100%', background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', borderRadius: 3 },
//   viewAllBtn: { background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', fontFamily: 'DM Sans', fontSize: '0.82rem', padding: '8px 0 0', fontWeight: 600 },
//   emptyState: { textAlign: 'center', padding: '20px 0' },
//   ctaBtn: { background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: 10, cursor: 'pointer', fontFamily: 'DM Sans', fontWeight: 600, fontSize: '0.88rem' },
//   ctaBtnOutline: { background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: '#f1f0ff', padding: '10px 20px', borderRadius: 10, cursor: 'pointer', fontFamily: 'DM Sans', fontSize: '0.88rem' },
//   recItem: { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' },
//   recIcon: { width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 },
//   quickAction: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '12px 8px', cursor: 'pointer', fontFamily: 'DM Sans', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, transition: 'all 0.2s' },
//   resumeRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' },
//   bigEmpty: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0' },
// }


import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [resumes, setResumes] = useState([])
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const u = localStorage.getItem('user')
    if (!u) { navigate('/login'); return }
    setUser(JSON.parse(u))
    fetchData()
    fetchFreshProfile()
  }, [])

  const fetchFreshProfile = async () => {
    try {
      const { data } = await API.get('/auth/profile')
      setUser(data)
      localStorage.setItem('user', JSON.stringify(data))
    } catch {}
  }

  const fetchData = async () => {
    try {
      const [resumeRes, analysisRes] = await Promise.all([
        API.get('/resume/my'),
        API.get('/skillgap/my')
      ])
      setResumes(resumeRes.data)
      setAnalyses(analysisRes.data)
    } catch (err) {
      console.log('Fetch error:', err.message)
    }
    setLoading(false)
  }

  const logout = () => { localStorage.clear(); navigate('/login') }
  const latestResume = resumes[0]
  const latestAnalysis = analyses[0]
  const getColor = (score) => score >= 70 ? '#4ade80' : score >= 50 ? '#fbbf24' : '#f87171'

  if (!user) return null

  const NAV_ITEMS = [
    { icon: '⊞', label: 'Overview', path: '/dashboard' },
    { icon: '📄', label: 'Resume', path: '/upload' },
    { icon: '🎯', label: 'Skill Gap', path: '/skillgap' },
    { icon: '🤖', label: 'AI Analyzer', path: '/ai' },
    { icon: '👤', label: 'Profile', path: '/profile' },
  ]

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        .nav-item:hover { background: rgba(255,255,255,0.06) !important; color: #f1f0ff !important; }
        .card-hover:hover { border-color: rgba(99,102,241,0.3) !important; transform: translateY(-2px); }
        .quick-action:hover { background: rgba(99,102,241,0.08) !important; border-color: rgba(99,102,241,0.2) !important; }
        * { box-sizing: border-box; }
      `}</style>

      {/* ── SIDEBAR ── */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarLogo}>
          <div style={styles.logoIcon}>✦</div>
          <span style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: '1rem' }}>SkillLens</span>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {NAV_ITEMS.map(item => (
            <div
              key={item.label}
              className="nav-item"
              onClick={() => navigate(item.path)}
              style={{
                ...styles.navItem,
                ...(window.location.pathname === item.path ? styles.navActive : {}),
                ...(item.label === 'AI Analyzer' ? { color: '#818cf8' } : {})
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
              {item.label === 'AI Analyzer' && (
                <span style={{ background: 'rgba(99,102,241,0.2)', color: '#818cf8', borderRadius: 99, padding: '1px 6px', fontSize: '0.6rem', fontWeight: 700, marginLeft: 'auto' }}>NEW</span>
              )}
            </div>
          ))}

          {user.isAdmin && (
            <div className="nav-item" onClick={() => navigate('/admin')} style={{ ...styles.navItem, color: '#f59e0b' }}>
              <span>👑</span>
              <span>Admin Panel</span>
            </div>
          )}
        </nav>

        {/* User Info + Logout */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', marginBottom: 4 }}>
            {user.profilePhoto ? (
              <img src={user.profilePhoto.startsWith('http') ? user.profilePhoto : `http://localhost:5000${user.profilePhoto}`} style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
            ) : (
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.82rem', fontWeight: 700, flexShrink: 0 }}>{user.name?.[0]?.toUpperCase()}</div>
            )}
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#f1f0ff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
              <div style={{ fontSize: '0.62rem', color: '#8b8aad' }}>{user.email?.slice(0, 20)}...</div>
            </div>
          </div>
          <div className="nav-item" onClick={logout} style={{ ...styles.navItem, color: '#f87171', cursor: 'pointer' }}>
            <span>⏻</span>
            <span>Logout</span>
          </div>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={styles.main}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <div style={styles.welcomeText}>WELCOME BACK</div>
            <div style={styles.userName}>Hi, {user.name} 👋</div>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {/* AI Analyzer Button in Header */}
            <button
              onClick={() => navigate('/ai')}
              style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.2),rgba(59,130,246,0.2))', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8', borderRadius: 10, padding: '8px 16px', cursor: 'pointer', fontFamily: 'DM Sans', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}
            >
              🤖 AI Analyzer
            </button>
            {user?.profilePhoto && user.profilePhoto !== '' ? (
              <img
                src={user.profilePhoto.startsWith('http') ? user.profilePhoto : `http://localhost:5000${user.profilePhoto}`}
                alt="Profile"
                onClick={() => navigate('/profile')}
                onError={(e) => { e.target.style.display = 'none' }}
                style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(124,58,237,0.4)', cursor: 'pointer' }}
              />
            ) : (
              <div onClick={() => navigate('/profile')} style={styles.avatar}>
                {user?.name?.[0]?.toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div style={{ color: '#8b8aad', padding: '40px 0', textAlign: 'center' }}>⏳ Loading your data...</div>
        ) : (
          <>
            {/* Stats Cards */}
            <div style={styles.statsRow}>
              <div className="card-hover" style={styles.statCard}>
                <div style={styles.statLabel}>Resume Score</div>
                <div style={{ ...styles.statVal, color: getColor(latestResume?.score || 0) }}>{latestResume?.score || '--'}</div>
                <div style={styles.statSub}>{latestResume ? 'Latest upload' : 'No resume yet'}</div>
              </div>
              <div className="card-hover" style={styles.statCard}>
                <div style={styles.statLabel}>ATS Score</div>
                <div style={{ ...styles.statVal, color: getColor(latestResume?.atsScore || 0) }}>{latestResume?.atsScore || '--'}</div>
                <div style={styles.statSub}>Applicant Tracking</div>
              </div>
              <div className="card-hover" style={styles.statCard}>
                <div style={styles.statLabel}>Placement Readiness</div>
                <div style={{ ...styles.statVal, color: '#818cf8' }}>{latestResume?.placementReadiness || '--'}{latestResume ? '%' : ''}</div>
                <div style={styles.statSub}>Job Ready Score</div>
              </div>
              <div className="card-hover" style={styles.statCard}>
                <div style={styles.statLabel}>Skill Match</div>
                <div style={{ ...styles.statVal, color: getColor(latestAnalysis?.matchPercentage || 0) }}>{latestAnalysis?.matchPercentage || '--'}{latestAnalysis ? '%' : ''}</div>
                <div style={styles.statSub}>{latestAnalysis?.jobRole || 'No analysis yet'}</div>
              </div>
            </div>

            {/* AI Analyzer Banner */}
            <div onClick={() => navigate('/ai')} style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.15),rgba(59,130,246,0.15))', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 14, padding: '16px 20px', marginBottom: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, transition: 'all 0.2s' }}>
              <div style={{ fontSize: '2rem' }}>🤖</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: '1rem', marginBottom: 3 }}>Try AI Career Analyzer</div>
                <div style={{ color: '#8b8aad', fontSize: '0.82rem' }}>Upload your resume + paste job description → Get complete AI analysis, roadmap & interview questions</div>
              </div>
              <div style={{ background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', color: '#fff', borderRadius: 10, padding: '8px 16px', fontSize: '0.82rem', fontWeight: 600, flexShrink: 0 }}>Try Now →</div>
            </div>

            <div style={styles.bottomGrid}>
              {/* Skills Card */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <span style={styles.cardTitle}>🧠 Top Skills</span>
                  <span style={styles.cardMeta}>From latest resume</span>
                </div>
                {latestResume?.skills?.length > 0 ? (
                  <div>
                    {latestResume.skills.slice(0, 6).map((skill, i) => (
                      <div key={skill} style={{ marginBottom: 10 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 5 }}>
                          <span style={{ textTransform: 'capitalize' }}>{skill}</span>
                          <span style={{ color: '#8b8aad' }}>Detected</span>
                        </div>
                        <div style={styles.barBg}>
                          <div style={{ ...styles.barFill, width: `${[92, 84, 76, 68, 60, 55][i] || 60}%` }} />
                        </div>
                      </div>
                    ))}
                    <button onClick={() => navigate('/upload')} style={styles.viewAllBtn}>View Full Analysis →</button>
                  </div>
                ) : (
                  <div style={styles.emptyState}>
                    <div style={{ fontSize: '2rem', marginBottom: 10 }}>📄</div>
                    <div style={{ color: '#8b8aad', fontSize: '0.85rem', marginBottom: 14 }}>Upload your resume to see skills</div>
                    <button onClick={() => navigate('/upload')} style={styles.ctaBtn}>Upload Resume →</button>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Quick Actions */}
                <div style={styles.card}>
                  <div style={{ ...styles.cardTitle, marginBottom: 14 }}>🚀 Quick Actions</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {[
                      { icon: '📄', label: 'Upload Resume', path: '/upload', color: '#7c3aed' },
                      { icon: '🎯', label: 'Skill Gap', path: '/skillgap', color: '#6366f1' },
                      { icon: '🤖', label: 'AI Analyzer', path: '/ai', color: '#3b82f6' },
                      { icon: '👤', label: 'Profile', path: '/profile', color: '#10b981' },
                    ].map(action => (
                      <button key={action.label} className="quick-action" onClick={() => navigate(action.path)} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '14px 8px', cursor: 'pointer', fontFamily: 'DM Sans', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, transition: 'all 0.2s' }}>
                        <span style={{ fontSize: '1.3rem' }}>{action.icon}</span>
                        <span style={{ fontSize: '0.75rem', color: '#d1d0f0' }}>{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* AI Recommendations */}
                <div style={styles.card}>
                  <div style={styles.cardHeader}>
                    <span style={styles.cardTitle}>✨ Recommendations</span>
                    <span style={{ background: 'rgba(99,102,241,0.2)', color: '#6366f1', borderRadius: 99, padding: '2px 8px', fontSize: '0.65rem' }}>AI</span>
                  </div>
                  {[
                    { icon: '🤖', title: 'Try AI Career Analyzer', sub: 'Get personalized roadmap', color: '#818cf8', path: '/ai' },
                    { icon: '🎯', title: 'Check Skill Gap', sub: 'See what skills you need', color: '#4ade80', path: '/skillgap' },
                    { icon: '📄', title: 'Upload Resume', sub: 'Get ATS & score analysis', color: '#fbbf24', path: '/upload' },
                  ].map((rec, i) => (
                    <div key={i} onClick={() => navigate(rec.path)} style={{ ...styles.recItem, cursor: 'pointer' }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: rec.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>{rec.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{rec.title}</div>
                        <div style={{ fontSize: '0.72rem', color: '#8b8aad', marginTop: 2 }}>{rec.sub}</div>
                      </div>
                      <span style={{ color: rec.color, fontSize: '0.8rem' }}>↗</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Resume History */}
            {resumes.length > 0 && (
              <div style={{ ...styles.card, marginTop: 16 }}>
                <div style={styles.cardHeader}>
                  <span style={styles.cardTitle}>📋 Resume History</span>
                  <span style={styles.cardMeta}>{resumes.length} uploads</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
                  {resumes.slice(0, 3).map(resume => (
                    <div key={resume._id} style={styles.resumeRow}>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>📄 {resume.fileName}</div>
                        <div style={{ fontSize: '0.72rem', color: '#8b8aad', marginTop: 2 }}>
                          {new Date(resume.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {resume.skills?.length || 0} skills
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ color: getColor(resume.score), fontWeight: 700, fontSize: '0.9rem' }}>{resume.score}</div>
                          <div style={{ color: '#8b8aad', fontSize: '0.65rem' }}>Score</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ color: getColor(resume.atsScore), fontWeight: 700, fontSize: '0.9rem' }}>{resume.atsScore}</div>
                          <div style={{ color: '#8b8aad', fontSize: '0.65rem' }}>ATS</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skill Gap History */}
            {analyses.length > 0 && (
              <div style={{ ...styles.card, marginTop: 16 }}>
                <div style={styles.cardHeader}>
                  <span style={styles.cardTitle}>🎯 Skill Gap History</span>
                  <span style={styles.cardMeta}>{analyses.length} analyses</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
                  {analyses.slice(0, 3).map(a => (
                    <div key={a._id} style={styles.resumeRow}>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>🎯 {a.jobRole}</div>
                        <div style={{ fontSize: '0.72rem', color: '#8b8aad', marginTop: 2 }}>
                          {new Date(a.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {a.missingSkills?.length || 0} missing
                        </div>
                      </div>
                      <div style={{ color: getColor(a.matchPercentage), fontWeight: 700, fontSize: '1.1rem' }}>{a.matchPercentage}%</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {resumes.length === 0 && analyses.length === 0 && (
              <div style={styles.bigEmpty}>
                <div style={{ fontSize: '3rem', marginBottom: 16 }}>🚀</div>
                <h2 style={{ fontFamily: 'Bricolage Grotesque', fontSize: '1.5rem', fontWeight: 700, marginBottom: 10 }}>Start Your Career Journey!</h2>
                <p style={{ color: '#8b8aad', marginBottom: 24, maxWidth: 400, textAlign: 'center' }}>
                  Upload your resume or try the AI Analyzer to get started.
                </p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
                  <button onClick={() => navigate('/upload')} style={styles.ctaBtn}>📄 Upload Resume →</button>
                  <button onClick={() => navigate('/ai')} style={{ ...styles.ctaBtn, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>🤖 AI Analyzer →</button>
                  <button onClick={() => navigate('/skillgap')} style={styles.ctaBtnOutline}>🎯 Skill Gap</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

const styles = {
  page: { display: 'flex', minHeight: '100vh', background: '#09090f', color: '#f1f0ff', fontFamily: 'DM Sans, sans-serif' },
  sidebar: { width: 220, background: 'rgba(9,9,15,0.98)', borderRight: '1px solid rgba(255,255,255,0.07)', padding: '24px 16px', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, bottom: 0, left: 0, overflowY: 'auto' },
  sidebarLogo: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28, paddingLeft: 8 },
  logoIcon: { width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 },
  navItem: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, fontSize: '0.85rem', color: '#8b8aad', cursor: 'pointer', transition: 'all 0.2s' },
  navActive: { background: 'rgba(99,102,241,0.15)', color: '#f1f0ff' },
  main: { flex: 1, marginLeft: 220, padding: '32px 36px', overflowY: 'auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  welcomeText: { fontSize: '0.7rem', color: '#8b8aad', letterSpacing: '0.1em', marginBottom: 4 },
  userName: { fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: '1.6rem', fontWeight: 700 },
  avatar: { width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 700, cursor: 'pointer' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 },
  statCard: { background: '#111120', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '20px', transition: 'all 0.2s' },
  statLabel: { fontSize: '0.72rem', color: '#8b8aad', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 },
  statVal: { fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: '2rem', fontWeight: 800, marginBottom: 4 },
  statSub: { fontSize: '0.72rem', color: '#8b8aad' },
  bottomGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  card: { background: '#111120', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '20px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  cardTitle: { fontSize: '0.88rem', fontWeight: 600 },
  cardMeta: { fontSize: '0.72rem', color: '#8b8aad' },
  barBg: { height: 5, background: 'rgba(255,255,255,0.07)', borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', borderRadius: 3 },
  viewAllBtn: { background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', fontFamily: 'DM Sans', fontSize: '0.82rem', padding: '8px 0 0', fontWeight: 600 },
  emptyState: { textAlign: 'center', padding: '20px 0' },
  ctaBtn: { background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: 10, cursor: 'pointer', fontFamily: 'DM Sans', fontWeight: 600, fontSize: '0.88rem' },
  ctaBtnOutline: { background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: '#f1f0ff', padding: '10px 20px', borderRadius: 10, cursor: 'pointer', fontFamily: 'DM Sans', fontSize: '0.88rem' },
  recItem: { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' },
  resumeRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' },
  bigEmpty: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0' },
}