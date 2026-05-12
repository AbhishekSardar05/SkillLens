// import { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import API from '../api/axios'

// const SIDEBAR_ITEMS = [
//   { id: 'dashboard', icon: '⊞', label: 'Dashboard' },
//   { id: 'users', icon: '👥', label: 'Users' },
//   { id: 'resumes', icon: '📄', label: 'Resumes' },
//   { id: 'analyses', icon: '🧠', label: 'Analyses' },
//   { id: 'analytics', icon: '📊', label: 'Analytics' },
// ]

// export default function AdminPanel() {
//   const navigate = useNavigate()
//   const [activeTab, setActiveTab] = useState('dashboard')
//   const [stats, setStats] = useState(null)
//   const [users, setUsers] = useState([])
//   const [resumes, setResumes] = useState([])
//   const [analyses, setAnalyses] = useState([])
//   const [analytics, setAnalytics] = useState(null)
//   const [search, setSearch] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [toast, setToast] = useState(null)

//   const showToast = (msg, type = 'success') => {
//     setToast({ msg, type })
//     setTimeout(() => setToast(null), 3000)
//   }

//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem('user') || '{}')
//     if (!user.isAdmin) {
//       navigate('/dashboard')
//       return
//     }
//     loadTab(activeTab)
//   }, [activeTab])

//   const loadTab = async (tab) => {
//     setLoading(true)
//     try {
//       if (tab === 'dashboard') {
//         const { data } = await API.get('/admin/stats')
//         setStats(data)
//       } else if (tab === 'users') {
//         const { data } = await API.get(`/admin/users${search ? `?search=${search}` : ''}`)
//         setUsers(data)
//       } else if (tab === 'resumes') {
//         const { data } = await API.get('/admin/resumes')
//         setResumes(data)
//       } else if (tab === 'analyses') {
//         const { data } = await API.get('/admin/analyses')
//         setAnalyses(data)
//       } else if (tab === 'analytics') {
//         const { data } = await API.get('/admin/analytics')
//         setAnalytics(data)
//       }
//     } catch (err) {
//       showToast(err.response?.data?.message || 'Failed to load data', 'error')
//     }
//     setLoading(false)
//   }

//   const deleteUser = async (id) => {
//     if (!window.confirm('Delete this user and all their data?')) return
//     try {
//       await API.delete(`/admin/users/${id}`)
//       setUsers(users.filter(u => u._id !== id))
//       showToast('User deleted successfully!')
//     } catch { showToast('Delete failed', 'error') }
//   }

//   const blockUser = async (id) => {
//     try {
//       const { data } = await API.put(`/admin/users/${id}/block`)
//       setUsers(users.map(u => u._id === id ? { ...u, isBlocked: data.isBlocked } : u))
//       showToast(data.message)
//     } catch { showToast('Action failed', 'error') }
//   }

//   const deleteResume = async (id) => {
//     if (!window.confirm('Delete this resume?')) return
//     try {
//       await API.delete(`/admin/resumes/${id}`)
//       setResumes(resumes.filter(r => r._id !== id))
//       showToast('Resume deleted!')
//     } catch { showToast('Delete failed', 'error') }
//   }

//   const getColor = (score) => score >= 70 ? '#4ade80' : score >= 50 ? '#fbbf24' : '#f87171'
//   const adminUser = JSON.parse(localStorage.getItem('user') || '{}')

//   return (
//     <div style={s.page}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
//         *{box-sizing:border-box;margin:0;padding:0;}
//         ::-webkit-scrollbar{width:5px;}
//         ::-webkit-scrollbar-track{background:transparent;}
//         ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:3px;}
//         input::placeholder{color:#555577;}
//         input:focus{outline:none;border-color:rgba(124,58,237,0.5)!important;}
//         .nav-hover:hover{background:rgba(255,255,255,0.06)!important;color:#f1f0ff!important;}
//         .row-hover:hover{background:rgba(255,255,255,0.03)!important;}
//         .tab-btn:hover{background:rgba(99,102,241,0.12)!important;}
//         @keyframes slideIn{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}
//       `}</style>

//       {/* Toast */}
//       {toast && (
//         <div style={{ position:'fixed', top:20, right:20, zIndex:9999, padding:'12px 20px', borderRadius:12, fontFamily:'DM Sans', fontSize:'0.88rem', fontWeight:500, backdropFilter:'blur(12px)', animation:'slideIn 0.3s ease', background: toast.type==='success' ? 'rgba(74,222,128,0.15)' : 'rgba(239,68,68,0.15)', border:`1px solid ${toast.type==='success' ? 'rgba(74,222,128,0.35)' : 'rgba(239,68,68,0.35)'}`, color: toast.type==='success' ? '#4ade80' : '#f87171' }}>
//           {toast.type === 'success' ? '✅' : '❌'} {toast.msg}
//         </div>
//       )}

//       {/* ── SIDEBAR ── */}
//       <aside style={s.sidebar}>
//         {/* Logo */}
//         <div style={s.sidebarLogo}>
//           <div style={s.logoIcon}>✦</div>
//           <div>
//             <div style={{ fontFamily:'Bricolage Grotesque', fontWeight:700, fontSize:'1rem', color:'#f1f0ff' }}>SkillLens</div>
//             <div style={{ fontSize:'0.62rem', color:'#7c3aed', fontWeight:600, letterSpacing:'0.05em' }}>ADMIN PANEL</div>
//           </div>
//         </div>

//         {/* Nav */}
//         <nav style={{ flex:1, display:'flex', flexDirection:'column', gap:3 }}>
//           {SIDEBAR_ITEMS.map(item => (
//             <button
//               key={item.id}
//               className="nav-hover"
//               onClick={() => setActiveTab(item.id)}
//               style={{ ...s.navItem, ...(activeTab === item.id ? s.navActive : {}) }}
//             >
//               <span style={{ fontSize:'1rem' }}>{item.icon}</span>
//               <span>{item.label}</span>
//               {activeTab === item.id && <div style={s.navIndicator} />}
//             </button>
//           ))}
//         </nav>

//         {/* Bottom */}
//         <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:12, display:'flex', flexDirection:'column', gap:3 }}>
//           {/* Admin Info */}
//           <div style={s.adminInfo}>
//             <div style={s.adminAvatar}>{adminUser.name?.[0]?.toUpperCase() || 'A'}</div>
//             <div>
//               <div style={{ fontSize:'0.8rem', fontWeight:600, color:'#f1f0ff' }}>{adminUser.name}</div>
//               <div style={{ fontSize:'0.65rem', color:'#7c3aed', fontWeight:600 }}>Administrator</div>
//             </div>
//           </div>
//           <button className="nav-hover" onClick={() => navigate('/dashboard')} style={{ ...s.navItem, color:'#8b8aad' }}>
//             <span>←</span><span>Back to App</span>
//           </button>
//           <button className="nav-hover" onClick={() => { localStorage.clear(); navigate('/login') }} style={{ ...s.navItem, color:'#f87171' }}>
//             <span>⏻</span><span>Logout</span>
//           </button>
//         </div>
//       </aside>

//       {/* ── MAIN ── */}
//       <main style={s.main}>
//         {/* Top Bar */}
//         <div style={s.topbar}>
//           <div>
//             <h1 style={s.pageTitle}>
//               {SIDEBAR_ITEMS.find(i => i.id === activeTab)?.icon}{' '}
//               {SIDEBAR_ITEMS.find(i => i.id === activeTab)?.label}
//             </h1>
//             <p style={s.pageSubtitle}>SkillLens Admin Panel · Manage everything from here</p>
//           </div>
//           <div style={s.adminBadge}>👑 Admin Mode</div>
//         </div>

//         {loading && (
//           <div style={{ color:'#8b8aad', padding:'32px 0', textAlign:'center', fontSize:'0.9rem' }}>
//             ⏳ Loading data...
//           </div>
//         )}

//         {/* ── DASHBOARD TAB ── */}
//         {activeTab === 'dashboard' && stats && !loading && (
//           <div>
//             {/* Stat Cards */}
//             <div style={s.statsGrid}>
//               {[
//                 { label:'Total Users', val:stats.totalUsers, icon:'👥', color:'#6366f1', bg:'rgba(99,102,241,0.1)' },
//                 { label:'Total Resumes', val:stats.totalResumes, icon:'📄', color:'#7c3aed', bg:'rgba(124,58,237,0.1)' },
//                 { label:'Total Analyses', val:stats.totalAnalyses, icon:'🧠', color:'#3b82f6', bg:'rgba(59,130,246,0.1)' },
//                 { label:'Avg Resume Score', val:stats.avgScore, icon:'⭐', color:'#f59e0b', bg:'rgba(245,158,11,0.1)' },
//               ].map(card => (
//                 <div key={card.label} style={s.statCard}>
//                   <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
//                     <div>
//                       <div style={s.statLabel}>{card.label}</div>
//                       <div style={{ ...s.statVal, color:card.color }}>{card.val}</div>
//                     </div>
//                     <div style={{ width:44, height:44, borderRadius:12, background:card.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem' }}>
//                       {card.icon}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginTop:20 }}>
//               {/* Users Growth Chart */}
//               <div style={s.card}>
//                 <div style={s.cardTitle}>📈 Users Growth (Last 7 Days)</div>
//                 <div style={{ display:'flex', alignItems:'flex-end', gap:6, height:110, marginTop:18, paddingBottom:8 }}>
//                   {stats.usersGrowth?.map((day, i) => {
//                     const maxVal = Math.max(...stats.usersGrowth.map(d => d.count), 1)
//                     const h = Math.max((day.count / maxVal) * 80, 4)
//                     return (
//                       <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
//                         <div style={{ color:'#f1f0ff', fontSize:'0.6rem', fontWeight:600 }}>{day.count || ''}</div>
//                         <div style={{ width:'100%', background:'linear-gradient(180deg,#7c3aed,#3b82f6)', borderRadius:'4px 4px 0 0', height:`${h}px`, minHeight:4, transition:'height 0.5s ease' }} />
//                         <div style={{ fontSize:'0.58rem', color:'#8b8aad', textAlign:'center', lineHeight:1.2 }}>{day.date}</div>
//                       </div>
//                     )
//                   })}
//                 </div>
//               </div>

//               {/* Top Roles */}
//               <div style={s.card}>
//                 <div style={s.cardTitle}>🎯 Most Targeted Job Roles</div>
//                 <div style={{ marginTop:16, display:'flex', flexDirection:'column', gap:12 }}>
//                   {stats.topRoles?.length > 0 ? stats.topRoles.map((role, i) => (
//                     <div key={i}>
//                       <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.82rem', marginBottom:5 }}>
//                         <span style={{ color:'#d1d0f0' }}>{role.role}</span>
//                         <span style={{ color:'#6366f1', fontWeight:600 }}>{role.count}</span>
//                       </div>
//                       <div style={{ height:5, background:'rgba(255,255,255,0.07)', borderRadius:3, overflow:'hidden' }}>
//                         <div style={{ height:'100%', width:`${(role.count/(stats.topRoles[0]?.count||1))*100}%`, background:'linear-gradient(135deg,#7c3aed,#3b82f6)', borderRadius:3 }} />
//                       </div>
//                     </div>
//                   )) : <div style={{ color:'#8b8aad', fontSize:'0.85rem' }}>No analyses done yet</div>}
//                 </div>
//               </div>

//               {/* Top Skills */}
//               <div style={{ ...s.card, gridColumn:'1 / -1' }}>
//                 <div style={s.cardTitle}>🧠 Top Skills in Resumes</div>
//                 <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:14 }}>
//                   {stats.topSkills?.length > 0 ? stats.topSkills.map((s2, i) => (
//                     <div key={i} style={{ background:'rgba(99,102,241,0.1)', border:'1px solid rgba(99,102,241,0.2)', borderRadius:8, padding:'6px 14px', fontSize:'0.82rem', color:'#818cf8', display:'flex', gap:8, alignItems:'center' }}>
//                       <span style={{ textTransform:'capitalize' }}>{s2.skill}</span>
//                       <span style={{ background:'rgba(99,102,241,0.2)', color:'#6366f1', borderRadius:99, padding:'1px 7px', fontSize:'0.68rem', fontWeight:700 }}>{s2.count}</span>
//                     </div>
//                   )) : <div style={{ color:'#8b8aad', fontSize:'0.85rem' }}>No skills data yet</div>}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ── USERS TAB ── */}
//         {activeTab === 'users' && !loading && (
//           <div>
//             <div style={{ display:'flex', gap:12, marginBottom:20 }}>
//               <input
//                 style={s.searchInput}
//                 placeholder="🔍 Search by name or email..."
//                 value={search}
//                 onChange={e => setSearch(e.target.value)}
//                 onKeyDown={e => e.key === 'Enter' && loadTab('users')}
//               />
//               <button onClick={() => loadTab('users')} style={s.searchBtn}>Search</button>
//             </div>

//             <div style={s.card}>
//               <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
//                 <div style={s.cardTitle}>All Users ({users.length})</div>
//               </div>
//               <div style={s.tableHead}>
//                 <span style={{ flex:2 }}>User</span>
//                 <span style={{ flex:1.5 }}>Joined</span>
//                 <span style={{ flex:0.8, textAlign:'center' }}>Resumes</span>
//                 <span style={{ flex:0.8, textAlign:'center' }}>Analyses</span>
//                 <span style={{ flex:0.8, textAlign:'center' }}>Status</span>
//                 <span style={{ flex:1.2, textAlign:'center' }}>Actions</span>
//               </div>

//               {users.length === 0 && (
//                 <div style={{ color:'#8b8aad', padding:'24px', textAlign:'center', fontSize:'0.85rem' }}>No users found</div>
//               )}

//               {users.map(user => (
//                 <div key={user._id} className="row-hover" style={s.tableRow}>
//                   <div style={{ flex:2, display:'flex', alignItems:'center', gap:10 }}>
//                     <div style={{ width:34, height:34, borderRadius:'50%', background:'linear-gradient(135deg,#7c3aed,#3b82f6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.85rem', fontWeight:700, flexShrink:0 }}>
//                       {user.name?.[0]?.toUpperCase()}
//                     </div>
//                     <div>
//                       <div style={{ fontWeight:600, fontSize:'0.85rem' }}>{user.name}</div>
//                       <div style={{ color:'#8b8aad', fontSize:'0.72rem', marginTop:1 }}>{user.email}</div>
//                     </div>
//                   </div>
//                   <div style={{ flex:1.5, color:'#8b8aad', fontSize:'0.78rem' }}>
//                     {new Date(user.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
//                   </div>
//                   <div style={{ flex:0.8, textAlign:'center', color:'#6366f1', fontWeight:600 }}>{user.resumeCount||0}</div>
//                   <div style={{ flex:0.8, textAlign:'center', color:'#7c3aed', fontWeight:600 }}>{user.analysisCount||0}</div>
//                   <div style={{ flex:0.8, textAlign:'center' }}>
//                     <span style={{ background: user.isBlocked ? 'rgba(239,68,68,0.12)' : 'rgba(74,222,128,0.12)', color: user.isBlocked ? '#f87171' : '#4ade80', borderRadius:99, padding:'3px 10px', fontSize:'0.7rem', fontWeight:600 }}>
//                       {user.isBlocked ? '🚫 Blocked' : '✅ Active'}
//                     </span>
//                   </div>
//                   <div style={{ flex:1.2, display:'flex', gap:6, justifyContent:'center' }}>
//                     <button onClick={() => blockUser(user._id)} style={{ ...s.actionBtn, background: user.isBlocked ? 'rgba(74,222,128,0.12)' : 'rgba(251,191,36,0.12)', color: user.isBlocked ? '#4ade80' : '#fbbf24', border: `1px solid ${user.isBlocked ? 'rgba(74,222,128,0.2)' : 'rgba(251,191,36,0.2)'}` }}>
//                       {user.isBlocked ? 'Unblock' : 'Block'}
//                     </button>
//                     <button onClick={() => deleteUser(user._id)} style={{ ...s.actionBtn, background:'rgba(239,68,68,0.12)', color:'#f87171', border:'1px solid rgba(239,68,68,0.2)' }}>
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* ── RESUMES TAB ── */}
//         {activeTab === 'resumes' && !loading && (
//           <div style={s.card}>
//             <div style={{ ...s.cardTitle, marginBottom:16 }}>All Resumes ({resumes.length})</div>
//             <div style={s.tableHead}>
//               <span style={{ flex:2 }}>File Name</span>
//               <span style={{ flex:1.5 }}>User</span>
//               <span style={{ flex:0.8, textAlign:'center' }}>Score</span>
//               <span style={{ flex:0.8, textAlign:'center' }}>ATS</span>
//               <span style={{ flex:0.8, textAlign:'center' }}>Skills</span>
//               <span style={{ flex:1, textAlign:'center' }}>Date</span>
//               <span style={{ flex:1.4, textAlign:'center' }}>Actions</span>
//             </div>

//             {resumes.length === 0 && <div style={{ color:'#8b8aad', padding:'24px', textAlign:'center', fontSize:'0.85rem' }}>No resumes uploaded yet</div>}

//             {resumes.map(resume => (
//               <div key={resume._id} className="row-hover" style={s.tableRow}>
//                 <div style={{ flex:2, fontSize:'0.84rem', fontWeight:500 }}>📄 {resume.fileName}</div>
//                 <div style={{ flex:1.5 }}>
//                   <div style={{ fontSize:'0.84rem', fontWeight:600 }}>{resume.user?.name || 'N/A'}</div>
//                   <div style={{ fontSize:'0.7rem', color:'#8b8aad' }}>{resume.user?.email}</div>
//                 </div>
//                 <div style={{ flex:0.8, textAlign:'center' }}>
//                   <span style={{ color:getColor(resume.score||0), fontWeight:700, fontSize:'0.9rem' }}>{resume.score||0}</span>
//                 </div>
//                 <div style={{ flex:0.8, textAlign:'center' }}>
//                   <span style={{ color:getColor(resume.atsScore||0), fontWeight:700, fontSize:'0.9rem' }}>{resume.atsScore||0}</span>
//                 </div>
//                 <div style={{ flex:0.8, textAlign:'center', color:'#6366f1', fontWeight:600 }}>{resume.skills?.length||0}</div>
//                 <div style={{ flex:1, textAlign:'center', color:'#8b8aad', fontSize:'0.75rem' }}>
//                   {new Date(resume.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
//                 </div>
//                 <div style={{ flex:1.4, textAlign:'center', display:'flex', gap:6, justifyContent:'center' }}>
//                   <button
//                     onClick={async () => {
//                       try {
//                         const token = localStorage.getItem('token')
//                         const res = await fetch(`http://localhost:5000/api/resume/report/${resume._id}`, {
//                           headers: { Authorization: `Bearer ${token}` }
//                         })
//                         const blob = await res.blob()
//                         const url = window.URL.createObjectURL(blob)
//                         const a = document.createElement('a')
//                         a.href = url
//                         a.download = `Report_${resume.user?.name || 'user'}.pdf`
//                         a.click()
//                         window.URL.revokeObjectURL(url)
//                         showToast('Report downloaded! 📥')
//                       } catch { showToast('Download failed', 'error') }
//                     }}
//                     style={{ ...s.actionBtn, background:'rgba(99,102,241,0.12)', color:'#818cf8', border:'1px solid rgba(99,102,241,0.2)' }}
//                   >
//                     📥 Report
//                   </button>
//                   <button onClick={() => deleteResume(resume._id)} style={{ ...s.actionBtn, background:'rgba(239,68,68,0.12)', color:'#f87171', border:'1px solid rgba(239,68,68,0.2)' }}>
//                     🗑 Delete
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* ── ANALYSES TAB ── */}
//         {activeTab === 'analyses' && !loading && (
//           <div style={s.card}>
//             <div style={{ ...s.cardTitle, marginBottom:16 }}>All Skill Gap Analyses ({analyses.length})</div>
//             <div style={s.tableHead}>
//               <span style={{ flex:1.5 }}>User</span>
//               <span style={{ flex:1.5 }}>Job Role</span>
//               <span style={{ flex:1, textAlign:'center' }}>Match %</span>
//               <span style={{ flex:0.8, textAlign:'center' }}>Skills</span>
//               <span style={{ flex:0.8, textAlign:'center' }}>Missing</span>
//               <span style={{ flex:1, textAlign:'center' }}>Date</span>
//             </div>

//             {analyses.length === 0 && <div style={{ color:'#8b8aad', padding:'24px', textAlign:'center', fontSize:'0.85rem' }}>No analyses done yet</div>}

//             {analyses.map(a => (
//               <div key={a._id} className="row-hover" style={s.tableRow}>
//                 <div style={{ flex:1.5 }}>
//                   <div style={{ fontSize:'0.84rem', fontWeight:600 }}>{a.user?.name||'N/A'}</div>
//                   <div style={{ fontSize:'0.7rem', color:'#8b8aad' }}>{a.user?.email}</div>
//                 </div>
//                 <div style={{ flex:1.5 }}>
//                   <span style={{ background:'rgba(99,102,241,0.1)', color:'#818cf8', borderRadius:6, padding:'3px 10px', fontSize:'0.78rem' }}>{a.jobRole}</span>
//                 </div>
//                 <div style={{ flex:1, textAlign:'center' }}>
//                   <span style={{ color:getColor(a.matchPercentage||0), fontWeight:700, fontSize:'1rem' }}>{a.matchPercentage||0}%</span>
//                 </div>
//                 <div style={{ flex:0.8, textAlign:'center', color:'#4ade80', fontWeight:600 }}>{a.userSkills?.length||0}</div>
//                 <div style={{ flex:0.8, textAlign:'center', color:'#f87171', fontWeight:600 }}>{a.missingSkills?.length||0}</div>
//                 <div style={{ flex:1, textAlign:'center', color:'#8b8aad', fontSize:'0.75rem' }}>
//                   {new Date(a.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* ── ANALYTICS TAB ── */}
//         {activeTab === 'analytics' && analytics && !loading && (
//           <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
//             <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
//               {/* Common Skills */}
//               <div style={s.card}>
//                 <div style={s.cardTitle}>🧠 Most Common Skills</div>
//                 <div style={{ marginTop:16, display:'flex', flexDirection:'column', gap:10 }}>
//                   {analytics.commonSkills?.length > 0 ? analytics.commonSkills.map((sk, i) => (
//                     <div key={i}>
//                       <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.82rem', marginBottom:4 }}>
//                         <span style={{ color:'#d1d0f0', textTransform:'capitalize' }}>{sk.skill}</span>
//                         <span style={{ color:'#4ade80', fontWeight:600 }}>{sk.count}</span>
//                       </div>
//                       <div style={{ height:4, background:'rgba(255,255,255,0.07)', borderRadius:2, overflow:'hidden' }}>
//                         <div style={{ height:'100%', width:`${(sk.count/(analytics.commonSkills[0]?.count||1))*100}%`, background:'linear-gradient(135deg,#4ade80,#22c55e)', borderRadius:2 }} />
//                       </div>
//                     </div>
//                   )) : <div style={{ color:'#8b8aad', fontSize:'0.85rem' }}>No data yet</div>}
//                 </div>
//               </div>

//               {/* Missing Skills */}
//               <div style={s.card}>
//                 <div style={s.cardTitle}>❌ Most Missing Skills</div>
//                 <div style={{ marginTop:16, display:'flex', flexDirection:'column', gap:10 }}>
//                   {analytics.missingSkills?.length > 0 ? analytics.missingSkills.map((sk, i) => (
//                     <div key={i}>
//                       <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.82rem', marginBottom:4 }}>
//                         <span style={{ color:'#d1d0f0', textTransform:'capitalize' }}>{sk.skill}</span>
//                         <span style={{ color:'#f87171', fontWeight:600 }}>{sk.count}</span>
//                       </div>
//                       <div style={{ height:4, background:'rgba(255,255,255,0.07)', borderRadius:2, overflow:'hidden' }}>
//                         <div style={{ height:'100%', width:`${(sk.count/(analytics.missingSkills[0]?.count||1))*100}%`, background:'linear-gradient(135deg,#f87171,#ef4444)', borderRadius:2 }} />
//                       </div>
//                     </div>
//                   )) : <div style={{ color:'#8b8aad', fontSize:'0.85rem' }}>No data yet</div>}
//                 </div>
//               </div>
//             </div>

//             {/* Roles Analytics */}
//             <div style={s.card}>
//               <div style={s.cardTitle}>🎯 Job Roles Performance</div>
//               <div style={s.tableHead}>
//                 <span style={{ flex:2 }}>Job Role</span>
//                 <span style={{ flex:1, textAlign:'center' }}>Total</span>
//                 <span style={{ flex:1, textAlign:'center' }}>Avg Match</span>
//                 <span style={{ flex:2 }}>Popularity</span>
//               </div>
//               {analytics.topRoles?.length > 0 ? analytics.topRoles.map((role, i) => (
//                 <div key={i} className="row-hover" style={s.tableRow}>
//                   <div style={{ flex:2, fontWeight:500, fontSize:'0.85rem' }}>{role.role}</div>
//                   <div style={{ flex:1, textAlign:'center', color:'#6366f1', fontWeight:600 }}>{role.count}</div>
//                   <div style={{ flex:1, textAlign:'center' }}>
//                     <span style={{ color:getColor(role.avgMatch||0), fontWeight:600 }}>{role.avgMatch||0}%</span>
//                   </div>
//                   <div style={{ flex:2, paddingRight:16 }}>
//                     <div style={{ height:6, background:'rgba(255,255,255,0.06)', borderRadius:3, overflow:'hidden' }}>
//                       <div style={{ height:'100%', width:`${(role.count/(analytics.topRoles[0]?.count||1))*100}%`, background:'linear-gradient(135deg,#7c3aed,#3b82f6)', borderRadius:3 }} />
//                     </div>
//                   </div>
//                 </div>
//               )) : <div style={{ color:'#8b8aad', padding:'16px', textAlign:'center', fontSize:'0.85rem' }}>No data yet</div>}
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   )
// }

// const s = {
//   page: { display:'flex', minHeight:'100vh', background:'#09090f', color:'#f1f0ff', fontFamily:'DM Sans, sans-serif' },
//   sidebar: { width:230, background:'rgba(9,9,15,0.98)', borderRight:'1px solid rgba(255,255,255,0.06)', padding:'22px 14px', display:'flex', flexDirection:'column', gap:4, position:'fixed', top:0, bottom:0, left:0, overflowY:'auto', zIndex:50 },
//   sidebarLogo: { display:'flex', alignItems:'center', gap:10, marginBottom:24, paddingLeft:6 },
//   logoIcon: { width:34, height:34, borderRadius:9, background:'linear-gradient(135deg,#7c3aed,#3b82f6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 },
//   navItem: { display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:10, fontSize:'0.84rem', color:'#8b8aad', cursor:'pointer', border:'none', background:'transparent', width:'100%', textAlign:'left', fontFamily:'DM Sans', transition:'all 0.2s', position:'relative' },
//   navActive: { background:'rgba(99,102,241,0.15)', color:'#f1f0ff', fontWeight:600 },
//   navIndicator: { position:'absolute', right:10, width:6, height:6, borderRadius:'50%', background:'#6366f1' },
//   adminInfo: { display:'flex', alignItems:'center', gap:10, padding:'10px 12px', marginBottom:4 },
//   adminAvatar: { width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#7c3aed,#3b82f6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.85rem', fontWeight:700, flexShrink:0 },
//   main: { flex:1, marginLeft:230, padding:'28px 32px', overflowY:'auto', minHeight:'100vh' },
//   topbar: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:28, paddingBottom:20, borderBottom:'1px solid rgba(255,255,255,0.06)' },
//   pageTitle: { fontFamily:'Bricolage Grotesque, sans-serif', fontSize:'1.6rem', fontWeight:700, marginBottom:4 },
//   pageSubtitle: { color:'#8b8aad', fontSize:'0.8rem' },
//   adminBadge: { background:'linear-gradient(135deg,rgba(124,58,237,0.18),rgba(99,102,241,0.18))', border:'1px solid rgba(99,102,241,0.25)', borderRadius:99, padding:'7px 16px', fontSize:'0.82rem', fontWeight:600, color:'#818cf8' },
//   statsGrid: { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 },
//   statCard: { background:'#111120', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, padding:'20px' },
//   statLabel: { fontSize:'0.7rem', color:'#8b8aad', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:10 },
//   statVal: { fontFamily:'Bricolage Grotesque, sans-serif', fontSize:'2.2rem', fontWeight:800 },
//   card: { background:'#111120', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, padding:'22px' },
//   cardTitle: { fontSize:'0.9rem', fontWeight:600, color:'#f1f0ff' },
//   searchInput: { flex:1, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, padding:'10px 16px', color:'#f1f0ff', fontSize:'0.9rem', fontFamily:'DM Sans' },
//   searchBtn: { background:'linear-gradient(135deg,#7c3aed,#3b82f6)', border:'none', color:'#fff', padding:'10px 22px', borderRadius:10, cursor:'pointer', fontFamily:'DM Sans', fontWeight:600, fontSize:'0.88rem' },
//   tableHead: { display:'flex', padding:'10px 14px', borderBottom:'1px solid rgba(255,255,255,0.06)', fontSize:'0.7rem', color:'#8b8aad', textTransform:'uppercase', letterSpacing:'0.08em', marginTop:12, marginBottom:4 },
//   tableRow: { display:'flex', alignItems:'center', padding:'12px 14px', borderBottom:'1px solid rgba(255,255,255,0.04)', borderRadius:8, transition:'background 0.15s' },
//   actionBtn: { border:'none', padding:'5px 11px', borderRadius:7, cursor:'pointer', fontFamily:'DM Sans', fontSize:'0.73rem', fontWeight:600 },
// }


import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'

// ── MINI COMPONENTS ──

const Toast = ({ toasts }) => (
  <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
    {toasts.map(t => (
      <div key={t.id} style={{ padding: '12px 18px', borderRadius: 10, fontSize: '0.85rem', fontWeight: 500, fontFamily: 'DM Sans, sans-serif', backdropFilter: 'blur(12px)', animation: 'slideIn 0.3s ease', display: 'flex', alignItems: 'center', gap: 8, background: t.type === 'success' ? 'rgba(74,222,128,0.15)' : t.type === 'error' ? 'rgba(239,68,68,0.15)' : 'rgba(99,102,241,0.15)', border: `1px solid ${t.type === 'success' ? 'rgba(74,222,128,0.3)' : t.type === 'error' ? 'rgba(239,68,68,0.3)' : 'rgba(99,102,241,0.3)'}`, color: t.type === 'success' ? '#4ade80' : t.type === 'error' ? '#f87171' : '#818cf8' }}>
        {t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : 'ℹ️'} {t.msg}
      </div>
    ))}
  </div>
)

const Skeleton = ({ w = '100%', h = 16, r = 8 }) => (
  <div style={{ width: w, height: h, borderRadius: r, background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 100%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
)

const ConfirmModal = ({ show, title, message, onConfirm, onCancel, inputLabel, inputValue, onInputChange }) => {
  if (!show) return null
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
      <div style={{ background: '#111120', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 32, maxWidth: 420, width: '90%', animation: 'popIn 0.2s ease' }}>
        <div style={{ fontSize: '1.5rem', marginBottom: 12 }}>⚠️</div>
        <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>{title}</div>
        <div style={{ color: '#8b8aad', fontSize: '0.88rem', marginBottom: 20, lineHeight: 1.6 }}>{message}</div>
        {inputLabel && (
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: '0.78rem', color: '#8b8aad', display: 'block', marginBottom: 6 }}>{inputLabel}</label>
            <input value={inputValue} onChange={e => onInputChange(e.target.value)} placeholder="Optional reason..." style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '9px 12px', color: '#f1f0ff', fontSize: '0.88rem', fontFamily: 'DM Sans, sans-serif', outline: 'none' }} />
          </div>
        )}
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onConfirm} style={{ flex: 1, background: 'linear-gradient(135deg,#ef4444,#dc2626)', border: 'none', color: '#fff', padding: '10px', borderRadius: 10, cursor: 'pointer', fontFamily: 'DM Sans', fontWeight: 600, fontSize: '0.88rem' }}>Confirm</button>
          <button onClick={onCancel} style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: '#8b8aad', padding: '10px', borderRadius: 10, cursor: 'pointer', fontFamily: 'DM Sans', fontSize: '0.88rem' }}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

const UserModal = ({ user, onClose }) => {
  if (!user) return null
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
      <div style={{ background: '#111120', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 32, maxWidth: 480, width: '90%', animation: 'popIn 0.2s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 700, overflow: 'hidden' }}>
            {user.profilePhoto ? <img src={user.profilePhoto.startsWith('http') ? user.profilePhoto : `http://localhost:5000${user.profilePhoto}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : user.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: '1.1rem', fontWeight: 700 }}>{user.name}</div>
            <div style={{ color: '#8b8aad', fontSize: '0.8rem' }}>{user.email}</div>
          </div>
          <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#8b8aad', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
        </div>
        {[
          ['Status', user.isBlocked ? '🚫 Blocked' : '✅ Active'],
          ['Role', user.isAdmin ? '👑 Admin' : '👤 User'],
          ['Verified', user.isVerified ? '✅ Yes' : '❌ No'],
          ['Phone', user.phone || 'Not provided'],
          ['Bio', user.bio || 'No bio'],
          ['Resumes', user.resumeCount || 0],
          ['Analyses', user.analysisCount || 0],
          ['Joined', new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })],
        ].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem' }}>
            <span style={{ color: '#8b8aad' }}>{k}</span>
            <span style={{ fontWeight: 500 }}>{v}</span>
          </div>
        ))}
        {user.blockReason && <div style={{ marginTop: 12, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 8, padding: '10px 14px', fontSize: '0.82rem', color: '#f87171' }}>Block reason: {user.blockReason}</div>}
      </div>
    </div>
  )
}

// ── MINI BAR CHART ──
const BarChart = ({ data, valueKey, labelKey, color = '#6366f1', height = 120 }) => {
  const max = Math.max(...data.map(d => d[valueKey]), 1)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height, paddingBottom: 20, position: 'relative' }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
          <div style={{ fontSize: '0.6rem', color: '#8b8aad', fontWeight: 600 }}>{d[valueKey] || ''}</div>
          <div style={{ width: '100%', background: `linear-gradient(180deg, ${color}, ${color}88)`, borderRadius: '3px 3px 0 0', height: `${Math.max((d[valueKey] / max) * (height - 30), 3)}px`, transition: 'height 0.5s ease', minHeight: 3 }} />
          <div style={{ fontSize: '0.55rem', color: '#8b8aad', textAlign: 'center', position: 'absolute', bottom: 0, left: `${(i / data.length) * 100}%`, width: `${100 / data.length}%` }}>{d[labelKey]}</div>
        </div>
      ))}
    </div>
  )
}

// ── HORIZONTAL BAR ──
const HBar = ({ label, value, max, color }) => (
  <div style={{ marginBottom: 10 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 5 }}>
      <span style={{ color: '#d1d0f0', textTransform: 'capitalize' }}>{label}</span>
      <span style={{ color, fontWeight: 600 }}>{value}</span>
    </div>
    <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${(value / max) * 100}%`, background: color, borderRadius: 3, transition: 'width 0.6s ease' }} />
    </div>
  </div>
)

// ── PAGINATION ──
const Pagination = ({ page, pages, onChange }) => {
  if (pages <= 1) return null
  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 20 }}>
      {[...Array(pages)].map((_, i) => (
        <button key={i} onClick={() => onChange(i + 1)} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'DM Sans', fontSize: '0.82rem', fontWeight: 600, background: page === i + 1 ? 'linear-gradient(135deg,#7c3aed,#3b82f6)' : 'rgba(255,255,255,0.05)', color: page === i + 1 ? '#fff' : '#8b8aad' }}>
          {i + 1}
        </button>
      ))}
    </div>
  )
}

export default function AdminPanel() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('dashboard')
  const [toasts, setToasts] = useState([])
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [usersMeta, setUsersMeta] = useState({ total: 0, pages: 1, page: 1 })
  const [resumes, setResumes] = useState([])
  const [resumesMeta, setResumesMeta] = useState({ total: 0, pages: 1, page: 1 })
  const [analyses, setAnalyses] = useState([])
  const [analysesMeta, setAnalysesMeta] = useState({ total: 0, pages: 1, page: 1 })
  const [analytics, setAnalytics] = useState(null)
  const [logs, setLogs] = useState([])
  const [feedback, setFeedback] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [userFilter, setUserFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [confirm, setConfirm] = useState(null)
  const [blockReason, setBlockReason] = useState('')
  const [viewUser, setViewUser] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const adminUser = JSON.parse(localStorage.getItem('user') || '{}')

  const toast = (msg, type = 'success') => {
    const id = Date.now()
    setToasts(p => [...p, { id, msg, type }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500)
  }

  useEffect(() => {
    if (!adminUser.isAdmin) { navigate('/dashboard'); return }
    loadTab(tab, 1)
  }, [tab])

  const loadTab = async (t, page = currentPage) => {
    setLoading(true)
    try {
      if (t === 'dashboard') {
        const { data } = await API.get('/admin/stats')
        setStats(data)
      } else if (t === 'users') {
        const { data } = await API.get(`/admin/users?page=${page}&limit=8${search ? `&search=${search}` : ''}${userFilter ? `&filter=${userFilter}` : ''}`)
        setUsers(data.users)
        setUsersMeta({ total: data.total, pages: data.pages, page: data.page })
      } else if (t === 'resumes') {
        const { data } = await API.get(`/admin/resumes?page=${page}&limit=8&sortBy=${sortBy}`)
        setResumes(data.resumes)
        setResumesMeta({ total: data.total, pages: data.pages, page: data.page })
      } else if (t === 'analyses') {
        const { data } = await API.get(`/admin/analyses?page=${page}&limit=8${roleFilter ? `&role=${roleFilter}` : ''}`)
        setAnalyses(data.analyses)
        setAnalysesMeta({ total: data.total, pages: data.pages, page: data.page })
      } else if (t === 'analytics') {
        const { data } = await API.get('/admin/analytics')
        setAnalytics(data)
      } else if (t === 'logs') {
        const { data } = await API.get('/admin/logs')
        setLogs(data)
      } else if (t === 'feedback') {
        const { data } = await API.get('/admin/feedback')
        setFeedback(data)
      }
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to load', 'error')
    }
    setLoading(false)
  }

  const handlePageChange = (p) => { setCurrentPage(p); loadTab(tab, p) }

  const doConfirm = (config) => { setConfirm(config); setBlockReason('') }

  const execConfirm = async () => {
    if (!confirm) return
    try {
      await confirm.action()
      toast(confirm.successMsg)
      loadTab(tab, currentPage)
    } catch (err) {
      toast(err.response?.data?.message || 'Action failed', 'error')
    }
    setConfirm(null)
    setBlockReason('')
  }

  const gc = (score) => score >= 70 ? '#4ade80' : score >= 50 ? '#fbbf24' : '#f87171'

  const SIDEBAR = [
    { id: 'dashboard', icon: '⊞', label: 'Dashboard' },
    { id: 'users', icon: '👥', label: 'Users' },
    { id: 'resumes', icon: '📄', label: 'Resumes' },
    { id: 'analyses', icon: '🧠', label: 'Analyses' },
    { id: 'analytics', icon: '📊', label: 'Analytics' },
    { id: 'logs', icon: '📋', label: 'Activity' },
    { id: 'feedback', icon: '💬', label: 'Feedback' },
  ]

  return (
    <div style={s.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:2px}
        input::placeholder{color:#555577}
        input:focus,select:focus{outline:none;border-color:rgba(124,58,237,0.5)!important}
        @keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
        @keyframes popIn{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}
        @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        .nav-btn:hover{background:rgba(255,255,255,0.07)!important;color:#f1f0ff!important}
        .row-h:hover{background:rgba(255,255,255,0.025)!important}
        .action:hover{opacity:0.75}
        .tab-active{background:rgba(99,102,241,0.15)!important;color:#f1f0ff!important;border-right:2px solid #6366f1}
      `}</style>

      <Toast toasts={toasts} />
      <ConfirmModal show={!!confirm} title={confirm?.title} message={confirm?.message} onConfirm={execConfirm} onCancel={() => setConfirm(null)} inputLabel={confirm?.inputLabel} inputValue={blockReason} onInputChange={setBlockReason} />
      <UserModal user={viewUser} onClose={() => setViewUser(null)} />

      {/* ── SIDEBAR ── */}
      <aside style={s.sidebar}>
        <div style={s.sidebarLogo}>
          <div style={s.logoIcon}>✦</div>
          <div>
            <div style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: '0.95rem' }}>SkillLens</div>
            <div style={{ fontSize: '0.6rem', color: '#7c3aed', fontWeight: 600, letterSpacing: '0.06em' }}>ADMIN</div>
          </div>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {SIDEBAR.map(item => (
            <button key={item.id} className={`nav-btn${tab === item.id ? ' tab-active' : ''}`} onClick={() => { setTab(item.id); setCurrentPage(1) }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, border: 'none', background: 'transparent', color: tab === item.id ? '#f1f0ff' : '#8b8aad', cursor: 'pointer', fontFamily: 'DM Sans', fontSize: '0.84rem', width: '100%', textAlign: 'left', transition: 'all 0.15s' }}>
              <span style={{ fontSize: '1rem' }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px' }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.82rem', fontWeight: 700, flexShrink: 0 }}>{adminUser.name?.[0]?.toUpperCase()}</div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#f1f0ff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{adminUser.name}</div>
              <div style={{ fontSize: '0.62rem', color: '#7c3aed', fontWeight: 600 }}>Administrator</div>
            </div>
          </div>
          <button className="nav-btn" onClick={() => navigate('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', borderRadius: 10, border: 'none', background: 'transparent', color: '#8b8aad', cursor: 'pointer', fontFamily: 'DM Sans', fontSize: '0.82rem', textAlign: 'left' }}>
            ← Back to App
          </button>
          <button className="nav-btn" onClick={() => { localStorage.clear(); navigate('/login') }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', borderRadius: 10, border: 'none', background: 'transparent', color: '#f87171', cursor: 'pointer', fontFamily: 'DM Sans', fontSize: '0.82rem', textAlign: 'left' }}>
            ⏻ Logout
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main style={s.main}>
        {/* Header */}
        <div style={s.topbar}>
          <div>
            <h1 style={s.pageTitle}>{SIDEBAR.find(i => i.id === tab)?.icon} {SIDEBAR.find(i => i.id === tab)?.label}</h1>
            <p style={s.pageSub}>SkillLens Admin · Production Dashboard</p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 99, padding: '6px 14px', fontSize: '0.78rem', color: '#818cf8', fontWeight: 600 }}>👑 Admin Mode</div>
            <button onClick={() => loadTab(tab, currentPage)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '6px 12px', color: '#8b8aad', cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'DM Sans' }}>↺ Refresh</button>
          </div>
        </div>

        {/* ── DASHBOARD ── */}
        {tab === 'dashboard' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
              {loading ? [...Array(4)].map((_, i) => <div key={i} style={s.card}><Skeleton h={80} /></div>) :
                stats && [
                  { label: 'Total Users', val: stats.totalUsers, sub: `${stats.activeUsers} active`, icon: '👥', color: '#6366f1' },
                  { label: 'Blocked', val: stats.blockedUsers, sub: 'accounts', icon: '🚫', color: '#f87171' },
                  { label: 'Total Resumes', val: stats.totalResumes, sub: 'uploaded', icon: '📄', color: '#7c3aed' },
                  { label: 'Avg ATS Score', val: stats.avgATS, sub: 'out of 100', icon: '⭐', color: '#f59e0b' },
                ].map(card => (
                  <div key={card.label} style={s.card}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontSize: '0.68rem', color: '#8b8aad', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{card.label}</div>
                        <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: '2rem', fontWeight: 800, color: card.color }}>{card.val}</div>
                        <div style={{ fontSize: '0.72rem', color: '#8b8aad', marginTop: 4 }}>{card.sub}</div>
                      </div>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: card.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>{card.icon}</div>
                    </div>
                  </div>
                ))
              }
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
              {/* Users Chart */}
              <div style={s.card}>
                <div style={s.cardTitle}>📈 User Growth (7 Days)</div>
                {loading ? <Skeleton h={120} r={8} /> : stats?.last7Days && <BarChart data={stats.last7Days} valueKey="count" labelKey="date" color="#6366f1" height={130} />}
              </div>

              {/* ATS Trend */}
              <div style={s.card}>
                <div style={s.cardTitle}>📊 Avg ATS Trend (7 Days)</div>
                {loading ? <Skeleton h={120} r={8} /> : stats?.atsTrend && <BarChart data={stats.atsTrend} valueKey="avg" labelKey="date" color="#f59e0b" height={130} />}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 }}>
              {/* Top Roles */}
              <div style={s.card}>
                <div style={s.cardTitle}>🎯 Top Job Roles</div>
                {loading ? <Skeleton h={100} /> : stats?.topRoles?.length > 0 ? stats.topRoles.map((r, i) => (
                  <HBar key={i} label={r.role} value={r.count} max={stats.topRoles[0].count} color="#7c3aed" />
                )) : <div style={s.empty}>No analyses yet</div>}
              </div>

              {/* Top Skills */}
              <div style={s.card}>
                <div style={s.cardTitle}>🧠 Top Skills</div>
                {loading ? <Skeleton h={100} /> : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                    {stats?.topSkills?.slice(0, 8).map((sk, i) => (
                      <span key={i} style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#818cf8', borderRadius: 6, padding: '3px 10px', fontSize: '0.75rem', display: 'flex', gap: 6, alignItems: 'center' }}>
                        {sk.skill} <span style={{ background: 'rgba(99,102,241,0.2)', borderRadius: 99, padding: '0 5px', fontSize: '0.65rem', fontWeight: 700 }}>{sk.count}</span>
                      </span>
                    ))}
                    {(!stats?.topSkills?.length) && <div style={s.empty}>No data yet</div>}
                  </div>
                )}
              </div>

              {/* AI Insights */}
              <div style={{ ...s.card, background: 'linear-gradient(135deg,rgba(124,58,237,0.12),rgba(59,130,246,0.08))', border: '1px solid rgba(99,102,241,0.2)' }}>
                <div style={s.cardTitle}>🤖 AI Insights</div>
                {loading ? <Skeleton h={100} /> : stats?.insights?.map((insight, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '0.8rem', color: '#d1d0f0', lineHeight: 1.5 }}>
                    <span style={{ color: '#7c3aed', flexShrink: 0 }}>→</span>
                    {insight}
                  </div>
                ))}
              </div>
            </div>

            {/* Extra Stats Row */}
            {stats && !loading && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
                {[
                  { label: 'Total Analyses', val: stats.totalAnalyses, color: '#3b82f6', icon: '🧠' },
                  { label: 'Avg Resume Score', val: stats.avgScore, color: '#10b981', icon: '📝' },
                  { label: 'Admin Users', val: stats.adminUsers, color: '#f59e0b', icon: '👑' },
                ].map(c => (
                  <div key={c.label} style={{ ...s.card, display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: c.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>{c.icon}</div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#8b8aad', marginBottom: 4 }}>{c.label}</div>
                      <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: '1.6rem', fontWeight: 800, color: c.color }}>{c.val}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── USERS ── */}
        {tab === 'users' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
              <input style={s.searchInput} placeholder="🔍 Search name or email..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && loadTab('users', 1)} />
              <select style={s.select} value={userFilter} onChange={e => { setUserFilter(e.target.value); loadTab('users', 1) }}>
                <option value="">All Users</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
                <option value="admin">Admin</option>
              </select>
              <button onClick={() => loadTab('users', 1)} style={s.searchBtn}>Search</button>
            </div>

            <div style={s.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14, alignItems: 'center' }}>
                <div style={s.cardTitle}>All Users ({usersMeta.total})</div>
              </div>
              <div style={s.tableHead}>
                <span style={{ flex: 2 }}>User</span>
                <span style={{ flex: 1.2 }}>Joined</span>
                <span style={{ flex: 0.7, textAlign: 'center' }}>📄</span>
                <span style={{ flex: 0.7, textAlign: 'center' }}>🧠</span>
                <span style={{ flex: 0.9, textAlign: 'center' }}>Status</span>
                <span style={{ flex: 1.8, textAlign: 'center' }}>Actions</span>
              </div>

              {loading ? [...Array(5)].map((_, i) => <div key={i} style={{ padding: '12px 14px', marginBottom: 4 }}><Skeleton h={36} r={8} /></div>) :
                users.length === 0 ? <div style={s.empty}>No users found</div> :
                users.map(u => (
                  <div key={u._id} className="row-h" style={s.tableRow}>
                    <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700, flexShrink: 0, overflow: 'hidden' }}>
                        {u.profilePhoto ? <img src={u.profilePhoto.startsWith('http') ? u.profilePhoto : `http://localhost:5000${u.profilePhoto}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} /> : u.name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.84rem' }}>{u.name} {u.isAdmin && <span style={{ color: '#f59e0b', fontSize: '0.65rem' }}>👑</span>}</div>
                        <div style={{ color: '#8b8aad', fontSize: '0.7rem', marginTop: 1 }}>{u.email}</div>
                      </div>
                    </div>
                    <div style={{ flex: 1.2, color: '#8b8aad', fontSize: '0.76rem' }}>{new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                    <div style={{ flex: 0.7, textAlign: 'center', color: '#6366f1', fontWeight: 600, fontSize: '0.9rem' }}>{u.resumeCount || 0}</div>
                    <div style={{ flex: 0.7, textAlign: 'center', color: '#7c3aed', fontWeight: 600, fontSize: '0.9rem' }}>{u.analysisCount || 0}</div>
                    <div style={{ flex: 0.9, textAlign: 'center' }}>
                      <span style={{ background: u.isBlocked ? 'rgba(239,68,68,0.1)' : 'rgba(74,222,128,0.1)', color: u.isBlocked ? '#f87171' : '#4ade80', borderRadius: 99, padding: '3px 9px', fontSize: '0.68rem', fontWeight: 600 }}>
                        {u.isBlocked ? '🚫 Blocked' : '✅ Active'}
                      </span>
                    </div>
                    <div style={{ flex: 1.8, display: 'flex', gap: 5, justifyContent: 'center', flexWrap: 'wrap' }}>
                      <button className="action" onClick={() => setViewUser(u)} style={{ ...s.btn, background: 'rgba(99,102,241,0.12)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)' }}>👁 View</button>
                      <button className="action" onClick={() => doConfirm({ title: u.isBlocked ? 'Unblock User?' : 'Block User?', message: `${u.isBlocked ? 'Unblock' : 'Block'} "${u.name}"?`, inputLabel: !u.isBlocked ? 'Block reason (optional)' : null, successMsg: u.isBlocked ? 'User unblocked!' : 'User blocked!', action: async () => await API.put(`/admin/users/${u._id}/block`, { reason: blockReason }) })} style={{ ...s.btn, background: u.isBlocked ? 'rgba(74,222,128,0.1)' : 'rgba(251,191,36,0.1)', color: u.isBlocked ? '#4ade80' : '#fbbf24', border: `1px solid ${u.isBlocked ? 'rgba(74,222,128,0.2)' : 'rgba(251,191,36,0.2)'}` }}>{u.isBlocked ? 'Unblock' : 'Block'}</button>
                      <button className="action" onClick={() => doConfirm({ title: u.isAdmin ? 'Remove Admin?' : 'Make Admin?', message: `${u.isAdmin ? 'Remove admin from' : 'Make'} "${u.name}" ${u.isAdmin ? '' : 'an admin'}?`, successMsg: 'Role updated!', action: async () => await API.put(`/admin/users/${u._id}/toggle-admin`) })} style={{ ...s.btn, background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)' }}>{u.isAdmin ? '⬇ Un-Admin' : '👑 Admin'}</button>
                      <button className="action" onClick={() => doConfirm({ title: 'Delete User?', message: `Permanently delete "${u.name}" and all their data?`, successMsg: 'User deleted!', action: async () => await API.delete(`/admin/users/${u._id}`) })} style={{ ...s.btn, background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>🗑</button>
                    </div>
                  </div>
                ))
              }
              <Pagination page={usersMeta.page} pages={usersMeta.pages} onChange={handlePageChange} />
            </div>
          </div>
        )}

        {/* ── RESUMES ── */}
        {tab === 'resumes' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              <select style={s.select} value={sortBy} onChange={e => { setSortBy(e.target.value); loadTab('resumes', 1) }}>
                <option value="createdAt">Newest First</option>
                <option value="score">By Score</option>
                <option value="atsScore">By ATS Score</option>
              </select>
            </div>
            <div style={s.card}>
              <div style={{ ...s.cardTitle, marginBottom: 14 }}>All Resumes ({resumesMeta.total})</div>
              <div style={s.tableHead}>
                <span style={{ flex: 2 }}>File</span>
                <span style={{ flex: 1.5 }}>User</span>
                <span style={{ flex: 0.8, textAlign: 'center' }}>Score</span>
                <span style={{ flex: 0.8, textAlign: 'center' }}>ATS</span>
                <span style={{ flex: 0.8, textAlign: 'center' }}>Skills</span>
                <span style={{ flex: 1, textAlign: 'center' }}>Date</span>
                <span style={{ flex: 1.4, textAlign: 'center' }}>Actions</span>
              </div>

              {loading ? [...Array(5)].map((_, i) => <div key={i} style={{ padding: '12px 14px', marginBottom: 4 }}><Skeleton h={40} r={8} /></div>) :
                resumes.length === 0 ? <div style={s.empty}>No resumes found</div> :
                resumes.map(r => (
                  <div key={r._id} className="row-h" style={s.tableRow}>
                    <div style={{ flex: 2, fontSize: '0.83rem', fontWeight: 500 }}>📄 {r.fileName}</div>
                    <div style={{ flex: 1.5 }}>
                      <div style={{ fontSize: '0.83rem', fontWeight: 600 }}>{r.user?.name || 'N/A'}</div>
                      <div style={{ fontSize: '0.7rem', color: '#8b8aad' }}>{r.user?.email}</div>
                    </div>
                    <div style={{ flex: 0.8, textAlign: 'center' }}><span style={{ color: gc(r.score || 0), fontWeight: 700 }}>{r.score || 0}</span></div>
                    <div style={{ flex: 0.8, textAlign: 'center' }}><span style={{ color: gc(r.atsScore || 0), fontWeight: 700 }}>{r.atsScore || 0}</span></div>
                    <div style={{ flex: 0.8, textAlign: 'center', color: '#6366f1', fontWeight: 600 }}>{r.skills?.length || 0}</div>
                    <div style={{ flex: 1, textAlign: 'center', color: '#8b8aad', fontSize: '0.73rem' }}>{new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                    <div style={{ flex: 1.4, display: 'flex', gap: 5, justifyContent: 'center' }}>
                      <button className="action" onClick={async () => {
                        try {
                          const token = localStorage.getItem('token')
                          const res = await fetch(`http://localhost:5000/api/resume/report/${r._id}`, { headers: { Authorization: `Bearer ${token}` } })
                          const blob = await res.blob()
                          const url = window.URL.createObjectURL(blob)
                          const a = document.createElement('a')
                          a.href = url; a.download = `Report_${r.user?.name || 'user'}.pdf`; a.click()
                          window.URL.revokeObjectURL(url)
                          toast('Report downloaded! 📥')
                        } catch { toast('Download failed', 'error') }
                      }} style={{ ...s.btn, background: 'rgba(99,102,241,0.12)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)' }}>📥 Report</button>
                      <button className="action" onClick={() => doConfirm({ title: 'Delete Resume?', message: `Delete "${r.fileName}"?`, successMsg: 'Resume deleted!', action: async () => await API.delete(`/admin/resumes/${r._id}`) })} style={{ ...s.btn, background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>🗑</button>
                    </div>
                  </div>
                ))
              }
              <Pagination page={resumesMeta.page} pages={resumesMeta.pages} onChange={handlePageChange} />
            </div>
          </div>
        )}

        {/* ── ANALYSES ── */}
        {tab === 'analyses' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              <select style={s.select} value={roleFilter} onChange={e => { setRoleFilter(e.target.value); loadTab('analyses', 1) }}>
                <option value="">All Roles</option>
                {['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Data Scientist', 'DevOps Engineer', 'Mobile Developer', 'UI/UX Designer', 'Data Analyst'].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div style={s.card}>
              <div style={{ ...s.cardTitle, marginBottom: 14 }}>All Analyses ({analysesMeta.total})</div>
              <div style={s.tableHead}>
                <span style={{ flex: 1.5 }}>User</span>
                <span style={{ flex: 1.5 }}>Job Role</span>
                <span style={{ flex: 1, textAlign: 'center' }}>Match %</span>
                <span style={{ flex: 0.8, textAlign: 'center' }}>Skills</span>
                <span style={{ flex: 0.8, textAlign: 'center' }}>Missing</span>
                <span style={{ flex: 1, textAlign: 'center' }}>Date</span>
              </div>
              {loading ? [...Array(5)].map((_, i) => <div key={i} style={{ padding: '12px', marginBottom: 4 }}><Skeleton h={38} r={8} /></div>) :
                analyses.length === 0 ? <div style={s.empty}>No analyses found</div> :
                analyses.map(a => (
                  <div key={a._id} className="row-h" style={s.tableRow}>
                    <div style={{ flex: 1.5 }}>
                      <div style={{ fontSize: '0.83rem', fontWeight: 600 }}>{a.user?.name || 'N/A'}</div>
                      <div style={{ fontSize: '0.7rem', color: '#8b8aad' }}>{a.user?.email}</div>
                    </div>
                    <div style={{ flex: 1.5 }}><span style={{ background: 'rgba(99,102,241,0.1)', color: '#818cf8', borderRadius: 6, padding: '3px 10px', fontSize: '0.76rem' }}>{a.jobRole}</span></div>
                    <div style={{ flex: 1, textAlign: 'center' }}><span style={{ color: gc(a.matchPercentage || 0), fontWeight: 700, fontSize: '1rem' }}>{a.matchPercentage || 0}%</span></div>
                    <div style={{ flex: 0.8, textAlign: 'center', color: '#4ade80', fontWeight: 600 }}>{a.userSkills?.length || 0}</div>
                    <div style={{ flex: 0.8, textAlign: 'center', color: '#f87171', fontWeight: 600 }}>{a.missingSkills?.length || 0}</div>
                    <div style={{ flex: 1, textAlign: 'center', color: '#8b8aad', fontSize: '0.73rem' }}>{new Date(a.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                  </div>
                ))
              }
              <Pagination page={analysesMeta.page} pages={analysesMeta.pages} onChange={handlePageChange} />
            </div>
          </div>
        )}

        {/* ── ANALYTICS ── */}
        {tab === 'analytics' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            {loading ? <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>{[...Array(4)].map((_, i) => <div key={i} style={s.card}><Skeleton h={150} /></div>)}</div> :
            analytics && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Monthly Growth */}
                <div style={s.card}>
                  <div style={s.cardTitle}>📈 Monthly User Growth</div>
                  {analytics.monthlyGrowth && <BarChart data={analytics.monthlyGrowth} valueKey="count" labelKey="month" color="#6366f1" height={140} />}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  {/* Common Skills */}
                  <div style={s.card}>
                    <div style={s.cardTitle}>🧠 Most Common Skills</div>
                    <div style={{ marginTop: 14 }}>
                      {analytics.commonSkills?.length > 0 ? analytics.commonSkills.slice(0, 8).map((sk, i) => (
                        <HBar key={i} label={sk.skill} value={sk.count} max={analytics.commonSkills[0].count} color="#4ade80" />
                      )) : <div style={s.empty}>No data</div>}
                    </div>
                  </div>

                  {/* Missing Skills */}
                  <div style={s.card}>
                    <div style={s.cardTitle}>❌ Most Missing Skills</div>
                    <div style={{ marginTop: 14 }}>
                      {analytics.missingSkills?.length > 0 ? analytics.missingSkills.map((sk, i) => (
                        <HBar key={i} label={sk.skill} value={sk.count} max={analytics.missingSkills[0].count} color="#f87171" />
                      )) : <div style={s.empty}>No data yet</div>}
                    </div>
                  </div>
                </div>

                {/* Job Roles Table */}
                <div style={s.card}>
                  <div style={s.cardTitle}>🎯 Job Role Performance</div>
                  <div style={s.tableHead}>
                    <span style={{ flex: 2 }}>Role</span>
                    <span style={{ flex: 1, textAlign: 'center' }}>Total</span>
                    <span style={{ flex: 1, textAlign: 'center' }}>Avg Match</span>
                    <span style={{ flex: 3 }}>Popularity</span>
                  </div>
                  {analytics.topRoles?.length > 0 ? analytics.topRoles.map((r, i) => (
                    <div key={i} className="row-h" style={s.tableRow}>
                      <div style={{ flex: 2, fontSize: '0.84rem', fontWeight: 500 }}>{r.role}</div>
                      <div style={{ flex: 1, textAlign: 'center', color: '#6366f1', fontWeight: 600 }}>{r.count}</div>
                      <div style={{ flex: 1, textAlign: 'center' }}><span style={{ color: gc(r.avgMatch), fontWeight: 600 }}>{r.avgMatch}%</span></div>
                      <div style={{ flex: 3, paddingRight: 16 }}>
                        <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3 }}>
                          <div style={{ height: '100%', width: `${(r.count / (analytics.topRoles[0]?.count || 1)) * 100}%`, background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', borderRadius: 3 }} />
                        </div>
                      </div>
                    </div>
                  )) : <div style={s.empty}>No data yet</div>}
                </div>

                {/* Score Distribution */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div style={s.card}>
                    <div style={s.cardTitle}>📊 Resume Score Distribution</div>
                    {analytics.scoreDistribution?.length > 0 ? (
                      <div style={{ marginTop: 14 }}>
                        {analytics.scoreDistribution.map((d, i) => (
                          <HBar key={i} label={`${d._id === '100+' ? '80+' : d._id}`} value={d.count} max={Math.max(...analytics.scoreDistribution.map(x => x.count), 1)} color="#7c3aed" />
                        ))}
                      </div>
                    ) : <div style={s.empty}>No data yet</div>}
                  </div>
                  <div style={s.card}>
                    <div style={s.cardTitle}>🎯 Match % Distribution</div>
                    {analytics.matchDistribution?.length > 0 ? (
                      <div style={{ marginTop: 14 }}>
                        {analytics.matchDistribution.map((d, i) => (
                          <HBar key={i} label={`${d._id === '100+' ? '80+' : d._id}%`} value={d.count} max={Math.max(...analytics.matchDistribution.map(x => x.count), 1)} color="#3b82f6" />
                        ))}
                      </div>
                    ) : <div style={s.empty}>No data yet</div>}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── ACTIVITY LOGS ── */}
        {tab === 'logs' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={s.card}>
              <div style={{ ...s.cardTitle, marginBottom: 14 }}>Activity Logs (Last 50)</div>
              {loading ? [...Array(5)].map((_, i) => <div key={i} style={{ marginBottom: 8 }}><Skeleton h={44} /></div>) :
                logs.length === 0 ? <div style={s.empty}>No activity logs yet</div> :
                logs.map((log, i) => {
                  const actionColors = { USER_DELETED: '#f87171', USER_BLOCKED: '#f59e0b', USER_UNBLOCKED: '#4ade80', MADE_ADMIN: '#818cf8', REMOVED_ADMIN: '#fbbf24', RESUME_DELETED: '#f87171' }
                  const actionIcons = { USER_DELETED: '🗑', USER_BLOCKED: '🚫', USER_UNBLOCKED: '✅', MADE_ADMIN: '👑', REMOVED_ADMIN: '⬇', RESUME_DELETED: '📄' }
                  return (
                    <div key={i} className="row-h" style={{ ...s.tableRow, alignItems: 'center' }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: (actionColors[log.action] || '#818cf8') + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0, marginRight: 12 }}>
                        {actionIcons[log.action] || '📋'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.83rem', fontWeight: 600, color: actionColors[log.action] || '#818cf8' }}>{log.action.replace(/_/g, ' ')}</div>
                        <div style={{ fontSize: '0.72rem', color: '#8b8aad', marginTop: 2 }}>
                          By: {log.performedBy?.name || 'Admin'} {log.details && `· ${log.details}`}
                        </div>
                      </div>
                      <div style={{ color: '#8b8aad', fontSize: '0.72rem', flexShrink: 0 }}>
                        {new Date(log.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>
        )}

        {/* ── FEEDBACK ── */}
        {tab === 'feedback' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={s.card}>
              <div style={{ ...s.cardTitle, marginBottom: 14 }}>User Feedback ({feedback.length})</div>
              {loading ? [...Array(4)].map((_, i) => <div key={i} style={{ marginBottom: 8 }}><Skeleton h={80} /></div>) :
                feedback.length === 0 ? <div style={s.empty}>No feedback submitted yet</div> :
                feedback.map((fb, i) => (
                  <div key={i} style={{ ...s.tableRow, flexDirection: 'column', alignItems: 'flex-start', gap: 8, marginBottom: 8, borderRadius: 12 }} className="row-h">
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>{fb.user?.name?.[0]?.toUpperCase()}</div>
                        <div>
                          <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{fb.user?.name}</div>
                          <div style={{ fontSize: '0.68rem', color: '#8b8aad' }}>{fb.user?.email}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span style={{ background: fb.type === 'bug' ? 'rgba(239,68,68,0.1)' : fb.type === 'feature' ? 'rgba(99,102,241,0.1)' : 'rgba(74,222,128,0.1)', color: fb.type === 'bug' ? '#f87171' : fb.type === 'feature' ? '#818cf8' : '#4ade80', borderRadius: 99, padding: '2px 8px', fontSize: '0.68rem', fontWeight: 600 }}>{fb.type}</span>
                        <span style={{ color: '#f59e0b', fontSize: '0.8rem' }}>{'⭐'.repeat(fb.rating || 0)}</span>
                        <span style={{ color: '#8b8aad', fontSize: '0.7rem' }}>{new Date(fb.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.84rem', color: '#d1d0f0', lineHeight: 1.6, paddingLeft: 38 }}>{fb.message}</div>
                  </div>
                ))
              }
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

const s = {
  page: { display: 'flex', minHeight: '100vh', background: '#09090f', color: '#f1f0ff', fontFamily: 'DM Sans, sans-serif' },
  sidebar: { width: 224, background: 'rgba(8,8,14,0.98)', borderRight: '1px solid rgba(255,255,255,0.055)', padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: 3, position: 'fixed', top: 0, bottom: 0, left: 0, overflowY: 'auto', zIndex: 50 },
  sidebarLogo: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22, paddingLeft: 6, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.06)' },
  logoIcon: { width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 },
  main: { flex: 1, marginLeft: 224, padding: '26px 28px', overflowY: 'auto', minHeight: '100vh' },
  topbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, paddingBottom: 18, borderBottom: '1px solid rgba(255,255,255,0.055)' },
  pageTitle: { fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: '1.5rem', fontWeight: 700, marginBottom: 3 },
  pageSub: { color: '#8b8aad', fontSize: '0.78rem' },
  card: { background: '#0f0f1e', border: '1px solid rgba(255,255,255,0.065)', borderRadius: 14, padding: '20px' },
  cardTitle: { fontSize: '0.88rem', fontWeight: 600, marginBottom: 10, color: '#f1f0ff' },
  searchInput: { flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '9px 14px', color: '#f1f0ff', fontSize: '0.88rem', fontFamily: 'DM Sans', minWidth: 200 },
  select: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '9px 14px', color: '#f1f0ff', fontSize: '0.85rem', fontFamily: 'DM Sans', cursor: 'pointer' },
  searchBtn: { background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', border: 'none', color: '#fff', padding: '9px 18px', borderRadius: 10, cursor: 'pointer', fontFamily: 'DM Sans', fontWeight: 600, fontSize: '0.85rem' },
  tableHead: { display: 'flex', padding: '9px 14px', borderBottom: '1px solid rgba(255,255,255,0.055)', fontSize: '0.68rem', color: '#8b8aad', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3, position: 'sticky', top: 0, background: '#0f0f1e', zIndex: 2 },
  tableRow: { display: 'flex', alignItems: 'center', padding: '11px 14px', borderBottom: '1px solid rgba(255,255,255,0.035)', borderRadius: 8, transition: 'background 0.15s', cursor: 'default' },
  btn: { border: 'none', padding: '5px 10px', borderRadius: 7, cursor: 'pointer', fontFamily: 'DM Sans', fontSize: '0.72rem', fontWeight: 600, transition: 'opacity 0.2s', whiteSpace: 'nowrap' },
  empty: { textAlign: 'center', color: '#8b8aad', padding: '24px', fontSize: '0.85rem' },
}
