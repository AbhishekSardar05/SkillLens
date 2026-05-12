// import { useState, useRef, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import API from '../api/axios'

// // ── MARKDOWN RENDERER (simple) ──
// const MD = ({ text }) => {
//   if (!text) return null
//   const lines = text.split('\n')
//   return (
//     <div style={{ lineHeight: 1.7, fontSize: '0.9rem', color: '#e2e1ff' }}>
//       {lines.map((line, i) => {
//         if (!line.trim()) return <br key={i} />
//         // Bold **text**
//         const parts = line.split(/\*\*(.*?)\*\*/g)
//         const rendered = parts.map((p, j) => j % 2 === 1 ? <strong key={j} style={{ color: '#f1f0ff', fontWeight: 700 }}>{p}</strong> : p)
//         // Bullet points
//         if (line.match(/^[•\-\*]\s/)) return <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 4 }}><span style={{ color: '#7c3aed', flexShrink: 0 }}>•</span><span>{rendered}</span></div>
//         // Numbered
//         if (line.match(/^\d+\.\s/)) return <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 4 }}><span style={{ color: '#6366f1', flexShrink: 0, fontWeight: 700 }}>{line.match(/^\d+/)[0]}.</span><span>{rendered.slice(1)}</span></div>
//         // Headers
//         if (line.startsWith('### ')) return <div key={i} style={{ fontFamily: 'Bricolage Grotesque', fontSize: '1rem', fontWeight: 700, color: '#f1f0ff', margin: '12px 0 6px' }}>{line.slice(4)}</div>
//         if (line.startsWith('## ')) return <div key={i} style={{ fontFamily: 'Bricolage Grotesque', fontSize: '1.1rem', fontWeight: 700, color: '#f1f0ff', margin: '14px 0 6px' }}>{line.slice(3)}</div>
//         if (line.startsWith('# ')) return <div key={i} style={{ fontFamily: 'Bricolage Grotesque', fontSize: '1.2rem', fontWeight: 800, color: '#f1f0ff', margin: '16px 0 8px' }}>{line.slice(2)}</div>
//         // Emoji lines (section headers)
//         if (/^[🎯📊✅❌🗺️🚀📚💡🔥⚡🧠📈🏆💼]/.test(line.trim())) return <div key={i} style={{ fontWeight: 700, color: '#f1f0ff', margin: '10px 0 4px', fontSize: '0.95rem' }}>{rendered}</div>
//         return <div key={i} style={{ marginBottom: 2 }}>{rendered}</div>
//       })}
//     </div>
//   )
// }

// const SUGGESTIONS = [
//   { icon: '🎯', text: 'Analyze my resume against this job description' },
//   { icon: '📊', text: 'What skills am I missing for this role?' },
//   { icon: '🗺️', text: 'Give me a 30-day learning roadmap' },
//   { icon: '🚀', text: 'Suggest 3 projects I should build' },
//   { icon: '❓', text: 'Generate 10 interview questions' },
//   { icon: '💡', text: 'What resources should I use to learn?' },
//   { icon: '📈', text: 'How long will it take to be job-ready?' },
//   { icon: '💼', text: 'What salary can I expect?' },
// ]

// export default function AIAnalyzer() {
//   const navigate = useNavigate()
//   const [messages, setMessages] = useState([])
//   const [input, setInput] = useState('')
//   const [resume, setResume] = useState('')
//   const [jobDesc, setJobDesc] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [showSetup, setShowSetup] = useState(true)
//   const [resumeFile, setResumeFile] = useState(null)
//   const [uploading, setUploading] = useState(false)
//   const [userSkills, setUserSkills] = useState([])
//   const bottomRef = useRef(null)
//   const textareaRef = useRef(null)

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
//   }, [messages])

//   const handleFileUpload = async (file) => {
//     if (!file || file.type !== 'application/pdf') return
//     setResumeFile(file)
//     setUploading(true)
//     try {
//       const formData = new FormData()
//       formData.append('resume', file)
//       const { data } = await API.post('/resume/upload', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       })
//       setUserSkills(data.resume.skills || [])
//       setResume(`Extracted Skills: ${data.resume.skills.join(', ')}\nResume Score: ${data.resume.resumeScore}\nATS Score: ${data.resume.atsScore}`)
//     } catch {
//       setResume('Resume uploaded (text extraction failed - please describe your skills manually)')
//     }
//     setUploading(false)
//   }

//   const startChat = () => {
//     if (!jobDesc.trim() && !resume.trim()) return
//     setShowSetup(false)
//     const welcomeMsg = {
//       role: 'ai',
//       text: `# 🎯 AI Career Assistant Ready!\n\nI've analyzed your profile:\n\n${resume ? `**Your Background:** ${resume.slice(0, 200)}${resume.length > 200 ? '...' : ''}` : ''}\n\n${jobDesc ? `**Target Role:** ${jobDesc.slice(0, 150)}${jobDesc.length > 150 ? '...' : ''}` : ''}\n\n**What I can help you with:**\n• Skill gap analysis\n• Personalized learning roadmap\n• Project recommendations\n• Interview preparation\n• Course & resource suggestions\n\nAsk me anything! 👇`
//     }
//     setMessages([welcomeMsg])
//   }

//   const sendMessage = async (text) => {
//     const msg = (text || input).trim()
//     if (!msg || loading) return
//     setInput('')
//     setMessages(p => [...p, { role: 'user', text: msg }])
//     setLoading(true)

//     try {
//       const contextualMsg = `
// User Context:
// - Resume/Skills: ${resume || 'Not provided'}
// - Job Description: ${jobDesc || 'Not provided'}
// - Extracted Skills: ${userSkills.join(', ') || 'None'}

// User Question: ${msg}

// Please provide detailed, actionable advice. Include:
// - Specific skill recommendations with learning resources (mention Coursera, Udemy, YouTube, official docs)
// - Time estimates for learning
// - Practical project suggestions
// - Any relevant interview tips
// Format with clear sections using emojis and bullet points.`

//       const { data } = await API.post('/ai/chat', {
//         message: contextualMsg,
//         skills: userSkills,
//         missingSkills: [],
//         role: jobDesc.slice(0, 100),
//         score: 0
//       })
//       setMessages(p => [...p, { role: 'ai', text: data.reply }])
//     } catch {
//       setMessages(p => [...p, { role: 'ai', text: '❌ AI unavailable. Please check your OpenAI API key in .env file.' }])
//     }
//     setLoading(false)
//   }

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
//   }

//   return (
//     <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#09090f', color: '#f1f0ff', fontFamily: 'DM Sans, sans-serif', overflow: 'hidden' }}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
//         *{box-sizing:border-box}
//         ::-webkit-scrollbar{width:4px}
//         ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:2px}
//         textarea::placeholder,input::placeholder{color:#555577}
//         textarea:focus,input:focus{outline:none}
//         @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
//         @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
//         @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
//         .suggest-btn:hover{background:rgba(99,102,241,0.15)!important;border-color:rgba(99,102,241,0.3)!important}
//         .send-btn:hover{opacity:0.85}
//       `}</style>

//       {/* ── TOP BAR ── */}
//       <div style={{ background: 'rgba(9,9,15,0.95)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//           <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🤖</div>
//           <div>
//             <div style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: '1rem' }}>AI Career Assistant</div>
//             <div style={{ fontSize: '0.68rem', color: '#8b8aad', display: 'flex', alignItems: 'center', gap: 4 }}>
//               <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block', animation: 'pulse 2s infinite' }} /> Powered by OpenAI GPT
//             </div>
//           </div>
//         </div>
//         <div style={{ display: 'flex', gap: 10 }}>
//           {!showSetup && (
//             <button onClick={() => { setShowSetup(true); setMessages([]) }} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#8b8aad', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: '0.78rem', fontFamily: 'DM Sans' }}>⚙ New Analysis</button>
//           )}
//           <button onClick={() => navigate('/skillgap')} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#8b8aad', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: '0.78rem', fontFamily: 'DM Sans' }}>← Skill Gap</button>
//           <button onClick={() => navigate('/dashboard')} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#8b8aad', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: '0.78rem', fontFamily: 'DM Sans' }}>Dashboard</button>
//         </div>
//       </div>

//       {showSetup ? (
//         /* ── SETUP SCREEN ── */
//         <div style={{ flex: 1, overflowY: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
//           <div style={{ width: '100%', maxWidth: 700, animation: 'fadeUp 0.4s ease' }}>
//             <div style={{ textAlign: 'center', marginBottom: 36 }}>
//               <div style={{ fontSize: '3rem', marginBottom: 12 }}>🤖</div>
//               <h1 style={{ fontFamily: 'Bricolage Grotesque', fontSize: '2rem', fontWeight: 800, marginBottom: 10 }}>
//                 AI Career <span style={{ background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Analyzer</span>
//               </h1>
//               <p style={{ color: '#8b8aad', fontSize: '0.95rem' }}>Upload your resume + paste job description → Get complete AI analysis</p>
//             </div>

//             {/* Resume Upload */}
//             <div style={{ background: '#0f0f1e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20, marginBottom: 14 }}>
//               <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 12 }}>📄 Your Resume</div>

//               {/* PDF Upload */}
//               <label style={{ display: 'block', background: resumeFile ? 'rgba(74,222,128,0.06)' : 'rgba(255,255,255,0.02)', border: `2px dashed ${resumeFile ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.1)'}`, borderRadius: 12, padding: '16px', textAlign: 'center', cursor: 'pointer', marginBottom: 12, transition: 'all 0.2s' }}>
//                 <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>{uploading ? '⏳' : resumeFile ? '✅' : '📄'}</div>
//                 <div style={{ fontSize: '0.82rem', color: resumeFile ? '#4ade80' : '#8b8aad' }}>
//                   {uploading ? 'Extracting skills from PDF...' : resumeFile ? resumeFile.name : 'Click to upload PDF resume (optional)'}
//                 </div>
//                 <input type="file" accept=".pdf" style={{ display: 'none' }} onChange={e => handleFileUpload(e.target.files[0])} />
//               </label>

//               {userSkills.length > 0 && (
//                 <div style={{ marginBottom: 12 }}>
//                   <div style={{ fontSize: '0.72rem', color: '#8b8aad', marginBottom: 6 }}>✅ Extracted {userSkills.length} skills:</div>
//                   <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
//                     {userSkills.slice(0, 12).map((s, i) => (
//                       <span key={i} style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#818cf8', borderRadius: 6, padding: '3px 10px', fontSize: '0.75rem' }}>{s}</span>
//                     ))}
//                     {userSkills.length > 12 && <span style={{ color: '#8b8aad', fontSize: '0.75rem', padding: '3px 0' }}>+{userSkills.length - 12} more</span>}
//                   </div>
//                 </div>
//               )}

//               <textarea
//                 value={resume}
//                 onChange={e => setResume(e.target.value)}
//                 placeholder="Or manually describe your skills, experience, projects...&#10;&#10;Example:&#10;Skills: React, Node.js, Python, MongoDB&#10;Experience: 1 year internship at startup&#10;Projects: Built e-commerce app, REST API"
//                 style={{ width: '100%', height: 100, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '10px 14px', color: '#f1f0ff', fontSize: '0.85rem', fontFamily: 'DM Sans', resize: 'vertical' }}
//               />
//             </div>

//             {/* Job Description */}
//             <div style={{ background: '#0f0f1e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20, marginBottom: 20 }}>
//               <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 12 }}>💼 Job Description / Target Role</div>
//               <textarea
//                 value={jobDesc}
//                 onChange={e => setJobDesc(e.target.value)}
//                 placeholder="Paste the job description here OR just type your target role...&#10;&#10;Example:&#10;We are looking for a Full Stack Developer with 2+ years experience in React, Node.js, MongoDB. Must know REST APIs, Git, Docker. Experience with AWS is a plus..."
//                 style={{ width: '100%', height: 120, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '10px 14px', color: '#f1f0ff', fontSize: '0.85rem', fontFamily: 'DM Sans', resize: 'vertical' }}
//               />
//             </div>

//             <button
//               onClick={startChat}
//               disabled={!jobDesc.trim() && !resume.trim()}
//               style={{ width: '100%', background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', border: 'none', color: '#fff', padding: 16, borderRadius: 14, fontSize: '1.05rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans', opacity: (!jobDesc.trim() && !resume.trim()) ? 0.5 : 1 }}
//             >
//               🚀 Start AI Analysis
//             </button>

//             <p style={{ textAlign: 'center', color: '#555577', fontSize: '0.75rem', marginTop: 12 }}>
//               Fill at least one field to continue
//             </p>
//           </div>
//         </div>
//       ) : (
//         /* ── CHAT SCREEN ── */
//         <>
//           <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>

//             {/* Suggestion chips — only when no messages sent by user */}
//             {messages.length === 1 && (
//               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8, maxWidth: 700, margin: '0 auto', width: '100%' }}>
//                 {SUGGESTIONS.map((s, i) => (
//                   <button key={i} className="suggest-btn" onClick={() => sendMessage(s.text)} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '12px 16px', cursor: 'pointer', textAlign: 'left', fontFamily: 'DM Sans', fontSize: '0.82rem', color: '#d1d0f0', display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.15s' }}>
//                     <span style={{ fontSize: '1rem', flexShrink: 0 }}>{s.icon}</span>
//                     {s.text}
//                   </button>
//                 ))}
//               </div>
//             )}

//             {/* Messages */}
//             {messages.map((msg, i) => (
//               <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: 800, margin: '0 auto', width: '100%', animation: 'fadeUp 0.3s ease' }}>
//                 {msg.role === 'ai' && (
//                   <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', flexShrink: 0, marginRight: 10, marginTop: 4 }}>🤖</div>
//                 )}
//                 <div style={{ maxWidth: msg.role === 'user' ? '70%' : '85%', background: msg.role === 'user' ? 'linear-gradient(135deg,#7c3aed,#3b82f6)' : 'rgba(255,255,255,0.05)', borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px', padding: '14px 18px', border: msg.role === 'ai' ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
//                   {msg.role === 'ai' ? <MD text={msg.text} /> : <div style={{ fontSize: '0.9rem', color: '#fff', lineHeight: 1.6 }}>{msg.text}</div>}
//                 </div>
//                 {msg.role === 'user' && (
//                   <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700, flexShrink: 0, marginLeft: 10, marginTop: 4 }}>
//                     {JSON.parse(localStorage.getItem('user') || '{}').name?.[0]?.toUpperCase() || 'U'}
//                   </div>
//                 )}
//               </div>
//             ))}

//             {/* Loading */}
//             {loading && (
//               <div style={{ display: 'flex', alignItems: 'center', gap: 10, maxWidth: 800, margin: '0 auto', width: '100%' }}>
//                 <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>🤖</div>
//                 <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '18px 18px 18px 4px', padding: '14px 18px', display: 'flex', gap: 5, alignItems: 'center' }}>
//                   {[0, 0.2, 0.4].map((d, i) => <span key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: '#6366f1', animation: `bounce 1s ${d}s infinite ease-in-out`, display: 'inline-block' }} />)}
//                   <span style={{ color: '#8b8aad', fontSize: '0.78rem', marginLeft: 6 }}>AI is thinking...</span>
//                 </div>
//               </div>
//             )}
//             <div ref={bottomRef} />
//           </div>

//           {/* ── INPUT BAR ── */}
//           <div style={{ background: 'rgba(9,9,15,0.95)', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '12px 20px', flexShrink: 0 }}>
//             <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', gap: 10, alignItems: 'flex-end' }}>
//               <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '10px 16px', display: 'flex', alignItems: 'flex-end', gap: 10 }}>
//                 <textarea
//                   ref={textareaRef}
//                   value={input}
//                   onChange={e => { setInput(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px' }}
//                   onKeyDown={handleKeyDown}
//                   placeholder="Ask about skills, roadmap, projects, interviews... (Enter to send, Shift+Enter for new line)"
//                   style={{ flex: 1, background: 'transparent', border: 'none', color: '#f1f0ff', fontSize: '0.9rem', fontFamily: 'DM Sans', resize: 'none', height: 24, maxHeight: 120, lineHeight: 1.6 }}
//                   rows={1}
//                 />
//               </div>
//               <button
//                 className="send-btn"
//                 onClick={() => sendMessage()}
//                 disabled={!input.trim() || loading}
//                 style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', border: 'none', color: '#fff', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, opacity: (!input.trim() || loading) ? 0.5 : 1, transition: 'opacity 0.2s' }}
//               >
//                 →
//               </button>
//             </div>
//             <div style={{ textAlign: 'center', color: '#555577', fontSize: '0.7rem', marginTop: 8 }}>
//               AI can make mistakes. Verify important information.
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   )
// }



import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'

// ── CLICKABLE LINKS RENDERER ──
const renderWithLinks = (text) => {
  // URL pattern
  const urlPattern = /(https?:\/\/[^\s]+)/g
  const parts = text.split(urlPattern)
  return parts.map((part, i) => {
    if (urlPattern.test(part)) {
      return <a key={i} href={part} target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa', textDecoration: 'underline', cursor: 'pointer' }}>{part}</a>
    }
    return part
  })
}

// ── MARKDOWN + LINKS RENDERER ──
const MD = ({ text }) => {
  if (!text) return null
  const lines = text.split('\n')
  return (
    <div style={{ lineHeight: 1.75, fontSize: '0.92rem', color: '#e2e1ff' }}>
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} style={{ height: 8 }} />

        // Bold **text**
        const boldSplit = line.split(/\*\*(.*?)\*\*/g)
        const withBold = boldSplit.map((p, j) =>
          j % 2 === 1
            ? <strong key={j} style={{ color: '#f1f0ff', fontWeight: 700 }}>{p}</strong>
            : <span key={j}>{renderWithLinks(p)}</span>
        )

        if (line.startsWith('# ')) return <h2 key={i} style={{ fontFamily: 'Bricolage Grotesque', fontSize: '1.2rem', fontWeight: 800, color: '#f1f0ff', margin: '18px 0 8px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 8 }}>{line.slice(2)}</h2>
        if (line.startsWith('## ')) return <h3 key={i} style={{ fontFamily: 'Bricolage Grotesque', fontSize: '1.05rem', fontWeight: 700, color: '#f1f0ff', margin: '14px 0 6px' }}>{line.slice(3)}</h3>
        if (line.startsWith('### ')) return <h4 key={i} style={{ fontSize: '0.95rem', fontWeight: 700, color: '#818cf8', margin: '10px 0 4px' }}>{line.slice(4)}</h4>

        // Course links — make them clickable cards
        if (line.includes('coursera.org') || line.includes('udemy.com') || line.includes('youtube.com') || line.includes('freecodecamp') || line.includes('theodinproject') || line.includes('w3schools') || line.includes('developer.mozilla') || line.includes('leetcode') || line.includes('kaggle') || line.includes('github.com')) {
          const urlMatch = line.match(/(https?:\/\/[^\s]+)/)
          const url = urlMatch ? urlMatch[0] : null
          const label = line.replace(/(https?:\/\/[^\s]+)/g, '').replace(/^[•\-\*]\s*/, '').trim()
          if (url) {
            return (
              <a key={i} href={url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.2)', borderRadius: 10, padding: '10px 14px', marginBottom: 6, textDecoration: 'none', color: '#60a5fa', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(96,165,250,0.15)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(96,165,250,0.08)'}
              >
                <span style={{ fontSize: '1rem' }}>{url.includes('youtube') ? '▶️' : url.includes('coursera') ? '🎓' : url.includes('udemy') ? '📚' : url.includes('freecodecamp') ? '💻' : url.includes('mozilla') || url.includes('docs') ? '📘' : url.includes('github') ? '🐙' : url.includes('kaggle') ? '📊' : '🔗'}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{label || url}</div>
                  <div style={{ fontSize: '0.72rem', color: '#8b8aad' }}>{url}</div>
                </div>
                <span style={{ marginLeft: 'auto', fontSize: '0.8rem' }}>↗</span>
              </a>
            )
          }
        }

        if (line.match(/^[•\-\*]\s/)) return (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 5, paddingLeft: 4 }}>
            <span style={{ color: '#7c3aed', flexShrink: 0, marginTop: 2 }}>•</span>
            <span style={{ color: '#d1d0f0' }}>{withBold}</span>
          </div>
        )

        if (line.match(/^\d+\.\s/)) {
          const num = line.match(/^(\d+)\./)[1]
          return (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, paddingLeft: 4 }}>
              <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, flexShrink: 0, marginTop: 2 }}>{num}</span>
              <span style={{ color: '#d1d0f0' }}>{withBold}</span>
            </div>
          )
        }

        if (/^[🎯📊✅❌🗺️🚀📚💡🔥⚡🧠📈🏆💼🎓▶️📘🔗💻📱🌐]/.test(line.trim())) {
          return <div key={i} style={{ fontWeight: 600, color: '#f1f0ff', margin: '12px 0 5px', fontSize: '0.95rem' }}>{withBold}</div>
        }

        return <div key={i} style={{ marginBottom: 3, color: '#d1d0f0' }}>{withBold}</div>
      })}
    </div>
  )
}

const SUGGESTIONS = [
  { icon: '🎯', text: 'Analyze my resume against this job description and tell me exactly what I am missing' },
  { icon: '📊', text: 'What skills am I missing for this role? List them with priority and learning time' },
  { icon: '📚', text: 'Give me a 30-day detailed learning roadmap with free course links' },
  { icon: '🚀', text: 'Suggest 3 specific projects I should build with step by step guide' },
  { icon: '❓', text: 'Generate 10 interview questions for this role with detailed answers' },
  { icon: '💡', text: 'What free resources and courses should I use? Give clickable links' },
  { icon: '📈', text: 'How long will it take to be job-ready? Give realistic timeline' },
  { icon: '💼', text: 'What salary can I expect for this role in India?' },
]

export default function AIAnalyzer() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [resumeText, setResumeText] = useState('')
  const [jobDescText, setJobDescText] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSetup, setShowSetup] = useState(true)
  const [resumeFile, setResumeFile] = useState(null)
  const [jdFile, setJdFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [userSkills, setUserSkills] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [chatHistory, setChatHistory] = useState([])
  const [currentChatId, setCurrentChatId] = useState(Date.now())
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)
  const fileInputRef = useRef(null)
  const jdFileInputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Handle Resume PDF Upload
  const handleResumeUpload = async (file) => {
    if (!file) return
    if (file.type !== 'application/pdf') { alert('Please upload a PDF file'); return }
    setResumeFile(file)
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('resume', file)
      const { data } = await API.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      const skills = data.resume.skills || []
      setUserSkills(skills)
      setResumeText(`Resume File: ${file.name}
Extracted Skills: ${skills.join(', ')}
Resume Score: ${data.resume.resumeScore || 0}
ATS Score: ${data.resume.atsScore || 0}
Placement Readiness: ${data.resume.placementReadiness || 0}%`)
    } catch {
      setResumeText(`Resume File: ${file.name}\n(Please describe your skills manually below)`)
    }
    setUploading(false)
  }

  // Handle JD PDF Upload — extract text
  const handleJDUpload = async (file) => {
    if (!file) return
    setJdFile(file)
    if (file.type === 'application/pdf') {
      try {
        const formData = new FormData()
        formData.append('resume', file)
        await API.post('/resume/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        setJobDescText(`Job Description from: ${file.name}\n(PDF uploaded — AI will analyze against your resume)`)
      } catch {
        setJobDescText(`Job Description from: ${file.name}`)
      }
    } else if (file.type.startsWith('image/')) {
      setJobDescText(`Job Description Image: ${file.name}\n(Please also type key requirements manually for better analysis)`)
    } else {
      const text = await file.text()
      setJobDescText(text)
    }
  }

  const startChat = () => {
    if (!jobDescText.trim() && !resumeText.trim()) return
    setShowSetup(false)
    const chatId = Date.now()
    setCurrentChatId(chatId)
    const welcomeMsg = {
      role: 'ai',
      text: `# 🤖 AI Career Assistant Ready!

I've analyzed your profile:

${resumeText ? `**Your Background:** ${resumeText.slice(0, 300)}${resumeText.length > 300 ? '...' : ''}` : ''}

${jobDescText ? `**Target Role/JD:** ${jobDescText.slice(0, 200)}${jobDescText.length > 200 ? '...' : ''}` : ''}

**What I can help you with:**
• Detailed skill gap analysis with priorities
• Personalized learning roadmap with free course links
• Project recommendations with step-by-step guide
• Interview preparation with Q&A
• Salary insights and career advice
• Free resources with clickable links

Ask me anything! 👇`
    }
    setMessages([welcomeMsg])
    setChatHistory(p => [...p, { id: chatId, title: jobDescText.slice(0, 30) || 'New Analysis', messages: [welcomeMsg] }])
  }

  const sendMessage = async (text) => {
    const msg = (text || input).trim()
    if (!msg || loading) return
    setInput('')
    if (textareaRef.current) { textareaRef.current.style.height = '24px' }

    const newMessages = [...messages, { role: 'user', text: msg }]
    setMessages(newMessages)
    setLoading(true)

    const systemContext = `You are an expert AI Career Assistant. Be VERY specific and detailed.

User's Resume/Skills: ${resumeText || 'Not provided'}
Job Description: ${jobDescText || 'Not provided'}
Extracted Skills: ${userSkills.join(', ') || 'None'}

IMPORTANT RULES:
1. For roadmap questions: Give week-by-week plan with SPECIFIC free course links like:
   - https://www.youtube.com/results?search_query=react+full+course+free
   - https://www.freecodecamp.org/
   - https://www.theodinproject.com/
   - https://developer.mozilla.org/
   - https://roadmap.sh/
   - https://www.coursera.org/
   - https://www.udemy.com/

2. For skill gap: Compare resume skills vs JD requirements specifically

3. For projects: Give specific project ideas with tech stack matching their role

4. For interview questions: Give actual questions WITH detailed answers

5. For resources: Always include clickable URLs

6. Be specific to THEIR skills and target role — no generic answers

7. Format with ## headers, bullet points, numbered lists

User Question: ${msg}`

    try {
      const { data } = await API.post('/ai/chat', {
        message: systemContext,
        skills: userSkills,
        missingSkills: [],
        role: jobDescText.slice(0, 100),
        score: 0
      })
      const updatedMessages = [...newMessages, { role: 'ai', text: data.reply }]
      setMessages(updatedMessages)
      setChatHistory(p => p.map(c => c.id === currentChatId ? { ...c, messages: updatedMessages } : c))
    } catch {
      const fallback = getFallbackResponse(msg, userSkills, jobDescText)
      const updatedMessages = [...newMessages, { role: 'ai', text: fallback }]
      setMessages(updatedMessages)
    }
    setLoading(false)
  }

  const getFallbackResponse = (msg, skills, jd) => {
    const m = msg.toLowerCase()
    if (m.includes('roadmap') || m.includes('learn') || m.includes('plan')) {
      return `## 🗺️ 30-Day Learning Roadmap

**Week 1-2: Foundation**
• Master core concepts of your target role
• Practice 2 hours daily

**Week 3-4: Build Projects**
• Build 2 real projects
• Push to GitHub

**Free Course Links:**
• https://www.freecodecamp.org/
• https://www.theodinproject.com/
• https://roadmap.sh/
• https://developer.mozilla.org/
• https://www.youtube.com/c/TraversyMedia

**Timeline:** 2-3 hours daily = job-ready in 60-90 days`
    }
    if (m.includes('project')) {
      return `## 🚀 Project Suggestions

**Project 1: Portfolio Website**
• Tech: HTML, CSS, JavaScript, React
• Time: 1-2 weeks
• Deploy: https://vercel.com/

**Project 2: Full Stack App**
• Tech: React + Node.js + MongoDB
• Time: 2-3 weeks
• Tutorial: https://www.youtube.com/results?search_query=mern+stack+project

**Project 3: API Project**
• Tech: Node.js + Express + MongoDB
• Time: 1 week
• Guide: https://www.freecodecamp.org/news/tag/rest-api/`
    }
    if (m.includes('interview')) {
      return `## ❓ Interview Questions

**Technical Questions:**
1. Explain your most complex project
2. How do you handle async operations?
3. What is the difference between REST and GraphQL?
4. How do you optimize app performance?
5. Explain your debugging process

**Preparation Resources:**
• https://leetcode.com/
• https://www.interviewbit.com/
• https://glassdoor.com/
• https://pramp.com/ (Free mock interviews)`
    }
    return `## 🤖 AI Assistant

I'm here to help! Try asking:
• "Give me a detailed roadmap with course links"
• "What skills am I missing?"
• "Generate interview questions with answers"
• "Suggest projects with tutorials"`
  }

  const newChat = () => {
    setShowSetup(true)
    setMessages([])
    setResumeText('')
    setJobDescText('')
    setResumeFile(null)
    setJdFile(null)
    setUserSkills([])
    setCurrentChatId(Date.now())
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  return (
    <div style={{ height: '100vh', display: 'flex', background: '#09090f', color: '#f1f0ff', fontFamily: 'DM Sans, sans-serif', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:2px}
        textarea::placeholder,input::placeholder{color:#555577}
        textarea:focus,input:focus{outline:none}
        @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        .suggest:hover{background:rgba(255,255,255,0.06)!important}
        .hist-item:hover{background:rgba(255,255,255,0.06)!important}
        .send-btn:hover{opacity:0.85}
        .link-card:hover{background:rgba(96,165,250,0.15)!important}
      `}</style>

      {/* ── LEFT SIDEBAR (ChatGPT style) ── */}
      {sidebarOpen && (
        <div style={{ width: 260, background: '#0a0a14', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          {/* Header */}
          <div style={{ padding: '16px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>🤖</div>
              <span style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: '0.95rem' }}>AI Career</span>
            </div>
            <button onClick={newChat} style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#f1f0ff', borderRadius: 10, padding: '9px 14px', cursor: 'pointer', fontFamily: 'DM Sans', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>✏</span> New Analysis
            </button>
          </div>

          {/* Chat History */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '10px 8px' }}>
            {chatHistory.length > 0 && (
              <>
                <div style={{ fontSize: '0.65rem', color: '#555577', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '8px 8px 4px' }}>Recent</div>
                {chatHistory.map((chat) => (
                  <div key={chat.id} className="hist-item" onClick={() => { setMessages(chat.messages); setCurrentChatId(chat.id); setShowSetup(false) }} style={{ padding: '8px 10px', borderRadius: 8, cursor: 'pointer', fontSize: '0.8rem', color: chat.id === currentChatId ? '#f1f0ff' : '#8b8aad', background: chat.id === currentChatId ? 'rgba(99,102,241,0.12)' : 'transparent', marginBottom: 2, transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ flexShrink: 0 }}>💬</span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{chat.title}</span>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Bottom Nav */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '10px 8px' }}>
            <div className="hist-item" onClick={() => navigate('/dashboard')} style={{ padding: '8px 10px', borderRadius: 8, cursor: 'pointer', fontSize: '0.8rem', color: '#8b8aad', display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.15s' }}>
              ← Dashboard
            </div>
            <div className="hist-item" onClick={() => navigate('/skillgap')} style={{ padding: '8px 10px', borderRadius: 8, cursor: 'pointer', fontSize: '0.8rem', color: '#8b8aad', display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.15s' }}>
              🎯 Skill Gap Analyzer
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN AREA ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Top Bar */}
        <div style={{ background: 'rgba(9,9,15,0.9)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', color: '#8b8aad', cursor: 'pointer', fontSize: '1.1rem', padding: 4 }}>☰</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: '0.95rem' }}>AI Career Assistant</span>
            <span style={{ background: 'rgba(74,222,128,0.12)', color: '#4ade80', borderRadius: 99, padding: '2px 8px', fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#4ade80', display: 'inline-block', animation: 'pulse 2s infinite' }} /> Online
            </span>
          </div>
          {!showSetup && (
            <button onClick={newChat} style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#8b8aad', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: '0.78rem', fontFamily: 'DM Sans' }}>⚙ New Analysis</button>
          )}
        </div>

        {showSetup ? (
          /* ── SETUP SCREEN ── */
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '32px 24px' }}>
            <div style={{ width: '100%', maxWidth: 680, animation: 'fadeUp 0.4s ease' }}>
              <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>🤖</div>
                <h1 style={{ fontFamily: 'Bricolage Grotesque', fontSize: '1.9rem', fontWeight: 800, marginBottom: 8 }}>
                  AI Career <span style={{ background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Analyzer</span>
                </h1>
                <p style={{ color: '#8b8aad', fontSize: '0.9rem' }}>Upload resume + job description → Get complete AI analysis with clickable resources</p>
              </div>

              {/* Resume Section */}
              <div style={{ background: '#0f0f1e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20, marginBottom: 14 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  📄 Your Resume
                  <span style={{ color: '#8b8aad', fontSize: '0.72rem', fontWeight: 400 }}>PDF, Image, or text</span>
                </div>

                {/* Upload buttons row */}
                <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                  <label style={{ flex: 1, background: resumeFile ? 'rgba(74,222,128,0.08)' : 'rgba(255,255,255,0.03)', border: `1px dashed ${resumeFile ? 'rgba(74,222,128,0.4)' : 'rgba(255,255,255,0.15)'}`, borderRadius: 10, padding: '12px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
                    <div style={{ fontSize: '1.2rem', marginBottom: 4 }}>{uploading ? '⏳' : resumeFile ? '✅' : '📄'}</div>
                    <div style={{ fontSize: '0.75rem', color: resumeFile ? '#4ade80' : '#8b8aad' }}>
                      {uploading ? 'Extracting...' : resumeFile ? resumeFile.name.slice(0, 20) + '...' : 'Upload PDF Resume'}
                    </div>
                    <input ref={fileInputRef} type="file" accept=".pdf,image/*" style={{ display: 'none' }} onChange={e => handleResumeUpload(e.target.files[0])} />
                  </label>
                </div>

                {userSkills.length > 0 && (
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: '0.72rem', color: '#4ade80', marginBottom: 6 }}>✅ Extracted {userSkills.length} skills:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                      {userSkills.slice(0, 15).map((s, i) => (
                        <span key={i} style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#818cf8', borderRadius: 6, padding: '2px 8px', fontSize: '0.72rem' }}>{s}</span>
                      ))}
                      {userSkills.length > 15 && <span style={{ color: '#8b8aad', fontSize: '0.72rem', alignSelf: 'center' }}>+{userSkills.length - 15} more</span>}
                    </div>
                  </div>
                )}

                <textarea
                  value={resumeText}
                  onChange={e => setResumeText(e.target.value)}
                  placeholder="Or manually describe your skills & experience...&#10;&#10;Example:&#10;Skills: React, Node.js, Python, MongoDB, AWS&#10;Experience: 1 year internship at XYZ startup&#10;Projects: E-commerce app, REST API service"
                  style={{ width: '100%', height: 90, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '10px 14px', color: '#f1f0ff', fontSize: '0.85rem', fontFamily: 'DM Sans', resize: 'vertical' }}
                />
              </div>

              {/* Job Description Section */}
              <div style={{ background: '#0f0f1e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20, marginBottom: 20 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  💼 Job Description
                  <span style={{ color: '#8b8aad', fontSize: '0.72rem', fontWeight: 400 }}>PDF, Image, or paste text</span>
                </div>

                <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                  <label style={{ flex: 1, background: jdFile ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.03)', border: `1px dashed ${jdFile ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.15)'}`, borderRadius: 10, padding: '12px', textAlign: 'center', cursor: 'pointer' }}>
                    <div style={{ fontSize: '1.2rem', marginBottom: 4 }}>{jdFile ? '✅' : '📋'}</div>
                    <div style={{ fontSize: '0.75rem', color: jdFile ? '#818cf8' : '#8b8aad' }}>{jdFile ? jdFile.name.slice(0, 20) + '...' : 'Upload JD (PDF/Image)'}</div>
                    <input ref={jdFileInputRef} type="file" accept=".pdf,.txt,image/*" style={{ display: 'none' }} onChange={e => handleJDUpload(e.target.files[0])} />
                  </label>
                </div>

                <textarea
                  value={jobDescText}
                  onChange={e => setJobDescText(e.target.value)}
                  placeholder="OR paste job description / target role here...&#10;&#10;Example:&#10;We need a Full Stack Developer with:&#10;- 2+ years React & Node.js&#10;- MongoDB, REST APIs&#10;- Docker, AWS preferred&#10;&#10;OR just type: 'MERN Stack Developer'"
                  style={{ width: '100%', height: 120, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '10px 14px', color: '#f1f0ff', fontSize: '0.85rem', fontFamily: 'DM Sans', resize: 'vertical' }}
                />
              </div>

              <button
                onClick={startChat}
                disabled={!jobDescText.trim() && !resumeText.trim()}
                style={{ width: '100%', background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', border: 'none', color: '#fff', padding: 16, borderRadius: 14, fontSize: '1rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans', opacity: (!jobDescText.trim() && !resumeText.trim()) ? 0.5 : 1 }}
              >
                🚀 Start AI Analysis
              </button>
              <p style={{ textAlign: 'center', color: '#555577', fontSize: '0.72rem', marginTop: 10 }}>Fill at least one field to start</p>
            </div>
          </div>
        ) : (
          /* ── CHAT SCREEN ── */
          <>
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px' }}>
              <div style={{ maxWidth: 780, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>

                {/* Suggestion Grid — show after first AI message only */}
                {messages.length === 1 && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {SUGGESTIONS.map((s, i) => (
                      <button key={i} className="suggest" onClick={() => sendMessage(s.text)} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '12px 14px', cursor: 'pointer', textAlign: 'left', fontFamily: 'DM Sans', fontSize: '0.8rem', color: '#d1d0f0', display: 'flex', alignItems: 'flex-start', gap: 8, transition: 'all 0.15s', lineHeight: 1.4 }}>
                        <span style={{ fontSize: '1rem', flexShrink: 0 }}>{s.icon}</span>
                        {s.text}
                      </button>
                    ))}
                  </div>
                )}

                {/* Messages */}
                {messages.map((msg, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', animation: 'fadeUp 0.25s ease' }}>
                    {msg.role === 'ai' && (
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', flexShrink: 0, marginTop: 4 }}>🤖</div>
                    )}
                    <div style={{ maxWidth: msg.role === 'user' ? '65%' : '88%', background: msg.role === 'user' ? 'linear-gradient(135deg,#7c3aed,#6366f1)' : 'rgba(255,255,255,0.04)', borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '4px 18px 18px 18px', padding: '14px 18px', border: msg.role === 'ai' ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
                      {msg.role === 'ai' ? <MD text={msg.text} /> : <div style={{ fontSize: '0.9rem', color: '#fff', lineHeight: 1.6 }}>{msg.text}</div>}
                    </div>
                    {msg.role === 'user' && (
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700, flexShrink: 0, marginTop: 4 }}>
                        {JSON.parse(localStorage.getItem('user') || '{}').name?.[0]?.toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>
                ))}

                {/* Loading */}
                {loading && (
                  <div style={{ display: 'flex', gap: 12, animation: 'fadeUp 0.2s ease' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', flexShrink: 0 }}>🤖</div>
                    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px 18px 18px 18px', padding: '14px 18px', display: 'flex', gap: 5, alignItems: 'center' }}>
                      {[0, 0.2, 0.4].map((d, i) => <span key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: '#6366f1', animation: `bounce 1.2s ${d}s infinite ease-in-out`, display: 'inline-block' }} />)}
                      <span style={{ color: '#8b8aad', fontSize: '0.78rem', marginLeft: 8 }}>AI is analyzing...</span>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
            </div>

            {/* ── INPUT BAR ── */}
            <div style={{ background: 'rgba(9,9,15,0.95)', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '12px 16px', flexShrink: 0 }}>
              <div style={{ maxWidth: 780, margin: '0 auto' }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '12px 16px', display: 'flex', alignItems: 'flex-end', gap: 10 }}>
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={e => {
                      setInput(e.target.value)
                      e.target.style.height = 'auto'
                      e.target.style.height = Math.min(e.target.scrollHeight, 130) + 'px'
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about skills, roadmap, projects, interviews, salary... (Enter to send)"
                    style={{ flex: 1, background: 'transparent', border: 'none', color: '#f1f0ff', fontSize: '0.92rem', fontFamily: 'DM Sans', resize: 'none', height: 24, maxHeight: 130, lineHeight: 1.6 }}
                    rows={1}
                  />
                  <button
                    className="send-btn"
                    onClick={() => sendMessage()}
                    disabled={!input.trim() || loading}
                    style={{ width: 38, height: 38, borderRadius: 10, background: input.trim() && !loading ? 'linear-gradient(135deg,#7c3aed,#3b82f6)' : 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}
                  >
                    {loading ? <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⚙</span> : '↑'}
                  </button>
                </div>
                <div style={{ textAlign: 'center', color: '#444466', fontSize: '0.68rem', marginTop: 6 }}>
                  AI may make mistakes. Verify important info. • Enter to send • Shift+Enter for new line
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}