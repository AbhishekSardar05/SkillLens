// import { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import API from '../api/axios'

// export default function ResumeUpload() {
//   const navigate = useNavigate()
//   const [file, setFile] = useState(null)
//   const [dragging, setDragging] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const [result, setResult] = useState(null)
//   const [error, setError] = useState('')
//   const [downloading, setDownloading] = useState(false)

//   const handleFile = (f) => {
//     if (f && f.type === 'application/pdf') { setFile(f); setError('') }
//     else setError('Only PDF files are allowed!')
//   }

//   const handleDrop = (e) => {
//     e.preventDefault(); setDragging(false)
//     handleFile(e.dataTransfer.files[0])
//   }

//   const handleUpload = async () => {
//     if (!file) return
//     setLoading(true); setError('')
//     try {
//       const formData = new FormData()
//       formData.append('resume', file)
//       const { data } = await API.post('/resume/upload', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       })
//       setResult(data.resume)
//     } catch (err) {
//       setError(err.response?.data?.message || 'Upload failed')
//     }
//     setLoading(false)
//   }

//   const handleDownloadReport = async () => {
//     setDownloading(true)
//     try {
//       const token = localStorage.getItem('token')
//       const response = await fetch(`http://localhost:5000/api/resume/report/${result.id}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       })
//       const blob = await response.blob()
//       const url = window.URL.createObjectURL(blob)
//       const a = document.createElement('a')
//       a.href = url
//       a.download = `SkillLens_Report.pdf`
//       a.click()
//       window.URL.revokeObjectURL(url)
//     } catch (err) {
//       setError('Report download failed')
//     }
//     setDownloading(false)
//   }

//   const getColor = (score) => score >= 70 ? '#4ade80' : score >= 50 ? '#fbbf24' : '#f87171'
//   const getLabel = (score) => score >= 80 ? 'Excellent 🔥' : score >= 65 ? 'Good 👍' : score >= 50 ? 'Average ⚡' : 'Needs Work 💪'

//   return (
//     <div style={styles.page}>
//       <div style={styles.container}>

//         <button onClick={() => navigate('/dashboard')} style={styles.back}>← Dashboard</button>
//         <h1 style={styles.title}>Resume Analyzer</h1>
//         <p style={styles.sub}>Upload your PDF resume — AI will extract skills and generate scores instantly</p>

//         {!result ? (
//           <>
//             {/* Drop Zone */}
//             <div
//               onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
//               onDragLeave={() => setDragging(false)}
//               onDrop={handleDrop}
//               style={{ ...styles.dropzone, ...(dragging ? styles.dropzoneDrag : {}), ...(file ? styles.dropzoneSuccess : {}) }}
//             >
//               <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>📄</div>
//               {file ? (
//                 <>
//                   <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#4ade80', marginBottom: 6 }}>✓ {file.name}</div>
//                   <div style={{ color: '#8b8aad', fontSize: '0.85rem', marginBottom: 14 }}>{(file.size / 1024).toFixed(1)} KB · PDF</div>
//                 </>
//               ) : (
//                 <>
//                   <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 8 }}>Drag & Drop your Resume here</div>
//                   <div style={{ color: '#8b8aad', fontSize: '0.85rem', marginBottom: 16 }}>PDF format only</div>
//                 </>
//               )}
//               <label style={styles.fileBtn}>
//                 {file ? '📂 Change File' : '📂 Browse PDF'}
//                 <input type="file" accept=".pdf" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
//               </label>
//             </div>

//             {error && <div style={styles.error}>{error}</div>}

//             {file && (
//               <button onClick={handleUpload} disabled={loading} style={styles.uploadBtn}>
//                 {loading ? (
//                   <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
//                     <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⚙</span>
//                     Analyzing Resume...
//                   </span>
//                 ) : '🚀 Analyze Resume'}
//               </button>
//             )}

//             {loading && (
//               <div style={styles.loadingSteps}>
//                 <div style={styles.loadingStep}>✅ Uploading PDF...</div>
//                 <div style={styles.loadingStep}>🔍 Extracting text...</div>
//                 <div style={styles.loadingStep}>🧠 Detecting skills...</div>
//                 <div style={styles.loadingStep}>📊 Calculating scores...</div>
//               </div>
//             )}
//           </>
//         ) : (
//           /* ─── RESULTS ─── */
//           <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

//             {/* Success Banner */}
//             <div style={styles.successBanner}>
//               <span>✅</span>
//               <span><strong>{result.fileName}</strong> analyzed successfully!</span>
//             </div>

//             {/* 3 Score Cards */}
//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
//               <div style={styles.scoreCard}>
//                 <div style={styles.scoreLabel}>Resume Score</div>
//                 <div style={{ ...styles.scoreNum, color: getColor(result.resumeScore) }}>{result.resumeScore}</div>
//                 <div style={{ ...styles.scoreBadge, background: getColor(result.resumeScore) + '20', color: getColor(result.resumeScore) }}>{getLabel(result.resumeScore)}</div>
//                 <div style={styles.scoreBar}><div style={{ ...styles.scoreBarFill, width: `${result.resumeScore}%`, background: getColor(result.resumeScore) }} /></div>
//               </div>

//               <div style={styles.scoreCard}>
//                 <div style={styles.scoreLabel}>ATS Score</div>
//                 <div style={{ ...styles.scoreNum, color: getColor(result.atsScore) }}>{result.atsScore}</div>
//                 <div style={{ ...styles.scoreBadge, background: getColor(result.atsScore) + '20', color: getColor(result.atsScore) }}>Applicant Tracking</div>
//                 <div style={styles.scoreBar}><div style={{ ...styles.scoreBarFill, width: `${result.atsScore}%`, background: getColor(result.atsScore) }} /></div>
//               </div>

//               <div style={styles.scoreCard}>
//                 <div style={styles.scoreLabel}>Placement Readiness</div>
//                 <div style={{ ...styles.scoreNum, color: '#818cf8' }}>{result.placementReadiness}%</div>
//                 <div style={{ ...styles.scoreBadge, background: 'rgba(129,140,248,0.15)', color: '#818cf8' }}>Job Ready</div>
//                 <div style={styles.scoreBar}><div style={{ ...styles.scoreBarFill, width: `${result.placementReadiness}%`, background: '#818cf8' }} /></div>
//               </div>
//             </div>

//             {/* Skills */}
//             <div style={styles.skillsCard}>
//               <div style={styles.skillsHeader}>
//                 <span style={styles.skillsTitle}>🧠 Detected Skills</span>
//                 <span style={styles.skillCount}>{result.totalSkills} found</span>
//               </div>
//               {result.skills.length > 0 ? (
//                 <div style={styles.skillsGrid}>
//                   {result.skills.map(skill => (
//                     <span key={skill} style={styles.skillTag}>{skill}</span>
//                   ))}
//                 </div>
//               ) : (
//                 <div style={styles.noSkills}>
//                   ⚠️ Skills could not be auto-detected. Your PDF may be image-based or scanned. Try a text-based PDF resume.
//                 </div>
//               )}
//             </div>

//             {/* Action Buttons */}
//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
//               <button onClick={handleDownloadReport} disabled={downloading} style={styles.downloadBtn}>
//                 {downloading ? '⏳ Generating...' : '📥 Download Report PDF'}
//               </button>
//               <button onClick={() => navigate('/skillgap', { state: { skills: result.skills } })} style={styles.primaryBtn}>
//                 🎯 Check Skill Gap →
//               </button>
//               <button onClick={() => { setResult(null); setFile(null) }} style={styles.outlineBtn}>
//                 🔄 Upload Another
//               </button>
//             </div>

//           </div>
//         )}
//       </div>

//       <style>{`
//         @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
//       `}</style>
//     </div>
//   )
// }

// const styles = {
//   page: { minHeight: '100vh', background: '#09090f', color: '#f1f0ff', fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 24px' },
//   container: { width: '100%', maxWidth: 700 },
//   back: { background: 'none', border: 'none', color: '#8b8aad', cursor: 'pointer', fontFamily: 'DM Sans', fontSize: '0.9rem', marginBottom: 24, padding: 0 },
//   title: { fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: '2.2rem', fontWeight: 800, marginBottom: 8 },
//   sub: { color: '#8b8aad', marginBottom: 32, fontSize: '1rem' },
//   dropzone: { border: '2px dashed rgba(255,255,255,0.12)', borderRadius: 20, padding: '48px 24px', textAlign: 'center', transition: 'all 0.3s', marginBottom: 20, background: 'rgba(255,255,255,0.02)' },
//   dropzoneDrag: { border: '2px dashed #6366f1', background: 'rgba(99,102,241,0.08)' },
//   dropzoneSuccess: { border: '2px dashed #4ade80', background: 'rgba(74,222,128,0.05)' },
//   fileBtn: { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#f1f0ff', padding: '10px 22px', borderRadius: 10, cursor: 'pointer', fontSize: '0.9rem', display: 'inline-block', marginTop: 4 },
//   error: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', padding: '10px 14px', borderRadius: 10, fontSize: '0.85rem', marginBottom: 16 },
//   uploadBtn: { width: '100%', background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', border: 'none', color: '#fff', padding: 16, borderRadius: 14, fontSize: '1.05rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans' },
//   loadingSteps: { marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 },
//   loadingStep: { color: '#8b8aad', fontSize: '0.85rem', padding: '6px 0' },
//   successBanner: { background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 12, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.9rem' },
//   scoreCard: { background: '#111120', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '24px 20px', textAlign: 'center' },
//   scoreLabel: { fontSize: '0.7rem', color: '#8b8aad', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 },
//   scoreNum: { fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: '2.8rem', fontWeight: 800, marginBottom: 8 },
//   scoreBadge: { display: 'inline-block', borderRadius: 99, padding: '3px 12px', fontSize: '0.72rem', fontWeight: 600, marginBottom: 14 },
//   scoreBar: { height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 2, overflow: 'hidden' },
//   scoreBarFill: { height: '100%', borderRadius: 2 },
//   skillsCard: { background: '#111120', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 24 },
//   skillsHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
//   skillsTitle: { fontSize: '0.95rem', fontWeight: 600 },
//   skillCount: { background: 'rgba(99,102,241,0.2)', color: '#6366f1', borderRadius: 99, padding: '3px 12px', fontSize: '0.75rem' },
//   skillsGrid: { display: 'flex', flexWrap: 'wrap', gap: 8 },
//   skillTag: { background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', color: '#818cf8', borderRadius: 8, padding: '6px 14px', fontSize: '0.82rem' },
//   noSkills: { background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: '#fbbf24', borderRadius: 10, padding: '12px 16px', fontSize: '0.85rem' },
//   downloadBtn: { background: 'linear-gradient(135deg,#059669,#10b981)', border: 'none', color: '#fff', padding: 14, borderRadius: 12, fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans' },
//   primaryBtn: { background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', border: 'none', color: '#fff', padding: 14, borderRadius: 12, fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans' },
//   outlineBtn: { background: 'none', border: '1px solid rgba(255,255,255,0.07)', color: '#f1f0ff', padding: 14, borderRadius: 12, fontSize: '0.88rem', cursor: 'pointer', fontFamily: 'DM Sans' }
// }

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'

export default function ResumeUpload() {
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [downloading, setDownloading] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  const handleFile = (f) => {
    if (f && f.type === 'application/pdf') { setFile(f); setError('') }
    else setError('Only PDF files are allowed!')
  }

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  const handleUpload = async () => {
    if (!file) return
    setLoading(true); setError('')
    try {
      const formData = new FormData()
      formData.append('resume', file)
      const { data } = await API.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setResult(data.resume)
      setActiveTab('overview')
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed')
    }
    setLoading(false)
  }

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/resume/report/${result.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = 'SkillLens_Resume_Report.pdf'; a.click()
      window.URL.revokeObjectURL(url)
    } catch { setError('Download failed') }
    setDownloading(false)
  }

  const getColor = (score) => score >= 70 ? '#4ade80' : score >= 50 ? '#fbbf24' : '#f87171'
  const getLabel = (score) => score >= 80 ? 'Excellent 🔥' : score >= 65 ? 'Good 👍' : score >= 50 ? 'Average ⚡' : 'Needs Work 💪'

  const tabs = ['overview', 'skills', 'education', 'experience', 'projects', 'feedback']

  return (
    <div style={styles.page}>
      <style>{`
        input::placeholder{color:#555577}
        .tab:hover{background:rgba(255,255,255,0.06)!important}
      `}</style>
      <div style={styles.container}>
        <button onClick={() => navigate('/dashboard')} style={styles.back}>← Dashboard</button>
        <h1 style={styles.title}>Resume Analyzer</h1>
        <p style={styles.sub}>Upload your PDF — AI extracts Skills, Education, Experience, Projects & generates scores</p>

        {!result ? (
          <>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              style={{ ...styles.dropzone, ...(dragging ? styles.dropDrag : {}), ...(file ? styles.dropSuccess : {}) }}
            >
              <div style={{ fontSize: '3rem', marginBottom: 14 }}>📄</div>
              {file ? (
                <>
                  <div style={{ color: '#4ade80', fontWeight: 600, fontSize: '1.05rem', marginBottom: 6 }}>✓ {file.name}</div>
                  <div style={{ color: '#8b8aad', fontSize: '0.85rem', marginBottom: 14 }}>{(file.size / 1024).toFixed(1)} KB · PDF</div>
                </>
              ) : (
                <>
                  <div style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: 8 }}>Drag & Drop Resume here</div>
                  <div style={{ color: '#8b8aad', fontSize: '0.85rem', marginBottom: 14 }}>PDF format only</div>
                </>
              )}
              <label style={styles.browseBtn}>
                {file ? '📂 Change File' : '📂 Browse PDF'}
                <input type="file" accept=".pdf" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
              </label>
            </div>

            {error && <div style={styles.error}>{error}</div>}

            {file && (
              <button onClick={handleUpload} disabled={loading} style={styles.analyzeBtn}>
                {loading ? '🔍 Analyzing Resume...' : '🚀 Analyze Resume'}
              </button>
            )}

            {loading && (
              <div style={styles.loadingBox}>
                {['Uploading PDF...', 'Extracting text...', 'Detecting skills...', 'Parsing education & experience...', 'Calculating scores...', 'Generating feedback...'].map((step, i) => (
                  <div key={i} style={styles.loadingStep}>⏳ {step}</div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Success Banner */}
            <div style={styles.successBanner}>
              ✅ <strong>{result.fileName}</strong> analyzed successfully!
            </div>

            {/* 3 Main Score Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              {[
                { label: 'Resume Score', val: result.resumeScore, sub: getLabel(result.resumeScore) },
                { label: 'ATS Score', val: result.atsScore, sub: 'Applicant Tracking' },
                { label: 'Placement Readiness', val: result.placementReadiness, sub: 'Job Ready', suffix: '%' }
              ].map(card => (
                <div key={card.label} style={styles.scoreCard}>
                  <div style={styles.scoreLabel}>{card.label}</div>
                  <div style={{ ...styles.scoreNum, color: getColor(card.val) }}>{card.val}{card.suffix || ''}</div>
                  <div style={{ fontSize: '0.75rem', color: '#8b8aad', marginBottom: 12 }}>{card.sub}</div>
                  <div style={styles.scoreBar}><div style={{ ...styles.scoreBarFill, width: `${card.val}%`, background: getColor(card.val) }} /></div>
                </div>
              ))}
            </div>

            {/* Section Scores */}
            {result.sectionScores && (
              <div style={styles.card}>
                <div style={styles.cardTitle}>📊 Section-wise Score Breakdown</div>
                {[
                  { label: 'Skills', score: result.sectionScores.skills, max: 25 },
                  { label: 'Experience', score: result.sectionScores.experience, max: 25 },
                  { label: 'Education', score: result.sectionScores.education, max: 20 },
                  { label: 'Projects', score: result.sectionScores.projects, max: 20 },
                  { label: 'Formatting', score: result.sectionScores.formatting, max: 10 },
                ].map(s => (
                  <div key={s.label} style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 6 }}>
                      <span>{s.label}</span>
                      <span style={{ color: getColor((s.score / s.max) * 100) }}>{s.score}/{s.max}</span>
                    </div>
                    <div style={styles.scoreBar}>
                      <div style={{ ...styles.scoreBarFill, width: `${(s.score / s.max) * 100}%`, background: getColor((s.score / s.max) * 100) }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tabs */}
            <div style={styles.tabs}>
              {tabs.map(tab => (
                <button key={tab} className="tab" onClick={() => setActiveTab(tab)} style={{ ...styles.tab, ...(activeTab === tab ? styles.tabActive : {}) }}>
                  {tab === 'overview' ? '📋 Overview' :
                   tab === 'skills' ? `🧠 Skills (${result.totalSkills})` :
                   tab === 'education' ? `🎓 Education (${result.education?.length || 0})` :
                   tab === 'experience' ? `💼 Experience (${result.experience?.length || 0})` :
                   tab === 'projects' ? `🚀 Projects (${result.projects?.length || 0})` :
                   '💡 Feedback'}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div style={styles.card}>

              {/* Overview */}
              {activeTab === 'overview' && (
                <div>
                  <div style={styles.cardTitle}>📋 Resume Overview</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    {[
                      { icon: '🧠', label: 'Skills Found', val: result.totalSkills },
                      { icon: '🎓', label: 'Education Entries', val: result.education?.length || 0 },
                      { icon: '💼', label: 'Experience Entries', val: result.experience?.length || 0 },
                      { icon: '🚀', label: 'Projects Found', val: result.projects?.length || 0 },
                    ].map(item => (
                      <div key={item.label} style={styles.overviewItem}>
                        <div style={{ fontSize: '1.8rem', marginBottom: 6 }}>{item.icon}</div>
                        <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: '2rem', fontWeight: 700 }}>{item.val}</div>
                        <div style={{ color: '#8b8aad', fontSize: '0.78rem' }}>{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {activeTab === 'skills' && (
                <div>
                  <div style={styles.cardTitle}>🧠 Detected Skills <span style={styles.badge}>{result.totalSkills} found</span></div>
                  {result.skills.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {result.skills.map(skill => (
                        <span key={skill} style={styles.skillTag}>{skill}</span>
                      ))}
                    </div>
                  ) : (
                    <div style={styles.emptyMsg}>⚠️ No skills auto-detected. Your PDF may be image-based.</div>
                  )}
                </div>
              )}

              {/* Education */}
              {activeTab === 'education' && (
                <div>
                  <div style={styles.cardTitle}>🎓 Education</div>
                  {result.education?.length > 0 ? result.education.map((edu, i) => (
                    <div key={i} style={styles.listItem}>
                      <div style={styles.listDot}>🎓</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{edu.degree || 'Degree'}</div>
                        {edu.institution && <div style={{ color: '#8b8aad', fontSize: '0.82rem', marginTop: 3 }}>{edu.institution}</div>}
                        {edu.year && <div style={{ color: '#6366f1', fontSize: '0.78rem', marginTop: 2 }}>{edu.year}</div>}
                      </div>
                    </div>
                  )) : <div style={styles.emptyMsg}>⚠️ No education details detected</div>}
                </div>
              )}

              {/* Experience */}
              {activeTab === 'experience' && (
                <div>
                  <div style={styles.cardTitle}>💼 Work Experience</div>
                  {result.experience?.length > 0 ? result.experience.map((exp, i) => (
                    <div key={i} style={styles.listItem}>
                      <div style={styles.listDot}>💼</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{exp.title}</div>
                        {exp.company && <div style={{ color: '#8b8aad', fontSize: '0.82rem', marginTop: 3 }}>{exp.company}</div>}
                        {exp.duration && <div style={{ color: '#6366f1', fontSize: '0.78rem', marginTop: 2 }}>{exp.duration}</div>}
                      </div>
                    </div>
                  )) : <div style={styles.emptyMsg}>⚠️ No experience details detected</div>}
                </div>
              )}

              {/* Projects */}
              {activeTab === 'projects' && (
                <div>
                  <div style={styles.cardTitle}>🚀 Projects</div>
                  {result.projects?.length > 0 ? result.projects.map((proj, i) => (
                    <div key={i} style={styles.listItem}>
                      <div style={styles.listDot}>🚀</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{proj.name}</div>
                        {proj.tech?.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                            {proj.tech.map(t => <span key={t} style={styles.techTag}>{t}</span>)}
                          </div>
                        )}
                      </div>
                    </div>
                  )) : <div style={styles.emptyMsg}>⚠️ No projects detected</div>}
                </div>
              )}

              {/* Feedback */}
              {activeTab === 'feedback' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {result.feedback?.weak?.length > 0 && (
                    <div>
                      <div style={{ ...styles.cardTitle, color: '#f87171' }}>❌ Weak Sections</div>
                      {result.feedback.weak.map((w, i) => (
                        <div key={i} style={styles.feedbackItem}>
                          <span style={{ color: '#f87171' }}>⚠</span> {w}
                        </div>
                      ))}
                    </div>
                  )}
                  {result.feedback?.missing?.length > 0 && (
                    <div>
                      <div style={{ ...styles.cardTitle, color: '#fbbf24' }}>🔍 Missing Keywords</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {result.feedback.missing.map(m => (
                          <span key={m} style={styles.missingTag}>{m}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {result.feedback?.suggestions?.length > 0 && (
                    <div>
                      <div style={{ ...styles.cardTitle, color: '#4ade80' }}>💡 Improvement Suggestions</div>
                      {result.feedback.suggestions.map((s, i) => (
                        <div key={i} style={styles.feedbackItem}>
                          <span style={{ color: '#4ade80' }}>→</span> {s}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <button onClick={handleDownload} disabled={downloading} style={styles.downloadBtn}>
                {downloading ? '⏳ Generating...' : '📥 Download PDF Report'}
              </button>
              <button onClick={() => navigate('/skillgap', { state: { skills: result.skills } })} style={styles.primaryBtn}>
                🎯 Check Skill Gap →
              </button>
              <button onClick={() => { setResult(null); setFile(null) }} style={styles.outlineBtn}>
                🔄 Upload Another
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', background: '#09090f', color: '#f1f0ff', fontFamily: 'DM Sans, sans-serif', padding: '40px 24px' },
  container: { width: '100%', maxWidth: 800, margin: '0 auto' },
  back: { background: 'none', border: 'none', color: '#8b8aad', cursor: 'pointer', fontFamily: 'DM Sans', fontSize: '0.9rem', marginBottom: 24, padding: 0 },
  title: { fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: '2.2rem', fontWeight: 800, marginBottom: 8 },
  sub: { color: '#8b8aad', marginBottom: 32, fontSize: '0.95rem' },
  dropzone: { border: '2px dashed rgba(255,255,255,0.12)', borderRadius: 20, padding: '48px 24px', textAlign: 'center', transition: 'all 0.3s', marginBottom: 20, background: 'rgba(255,255,255,0.02)' },
  dropDrag: { border: '2px dashed #6366f1', background: 'rgba(99,102,241,0.08)' },
  dropSuccess: { border: '2px dashed #4ade80', background: 'rgba(74,222,128,0.05)' },
  browseBtn: { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#f1f0ff', padding: '10px 22px', borderRadius: 10, cursor: 'pointer', fontSize: '0.9rem', display: 'inline-block', marginTop: 4 },
  error: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', padding: '10px 14px', borderRadius: 10, fontSize: '0.85rem', marginBottom: 16 },
  analyzeBtn: { width: '100%', background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', border: 'none', color: '#fff', padding: 16, borderRadius: 14, fontSize: '1.05rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans' },
  loadingBox: { marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 },
  loadingStep: { color: '#8b8aad', fontSize: '0.85rem' },
  successBanner: { background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 12, padding: '12px 18px', fontSize: '0.9rem', display: 'flex', gap: 8, alignItems: 'center' },
  scoreCard: { background: '#111120', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '22px 18px', textAlign: 'center' },
  scoreLabel: { fontSize: '0.7rem', color: '#8b8aad', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 },
  scoreNum: { fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: '2.6rem', fontWeight: 800, marginBottom: 4 },
  scoreBar: { height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 2, overflow: 'hidden' },
  scoreBarFill: { height: '100%', borderRadius: 2 },
  card: { background: '#111120', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 24 },
  cardTitle: { fontSize: '0.95rem', fontWeight: 600, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10 },
  tabs: { display: 'flex', gap: 6, flexWrap: 'wrap' },
  tab: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: '#8b8aad', padding: '8px 14px', borderRadius: 10, cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'DM Sans' },
  tabActive: { background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#f1f0ff' },
  badge: { background: 'rgba(99,102,241,0.2)', color: '#6366f1', borderRadius: 99, padding: '2px 10px', fontSize: '0.72rem' },
  skillTag: { background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', color: '#818cf8', borderRadius: 8, padding: '5px 12px', fontSize: '0.82rem' },
  techTag: { background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)', color: '#60a5fa', borderRadius: 6, padding: '3px 10px', fontSize: '0.75rem' },
  emptyMsg: { background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)', color: '#fbbf24', borderRadius: 10, padding: '12px 16px', fontSize: '0.85rem' },
  listItem: { display: 'flex', gap: 14, padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', alignItems: 'flex-start' },
  listDot: { fontSize: '1.2rem', marginTop: 2, flexShrink: 0 },
  overviewItem: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '20px', textAlign: 'center' },
  feedbackItem: { display: 'flex', gap: 10, alignItems: 'flex-start', padding: '8px 0', fontSize: '0.875rem', borderBottom: '1px solid rgba(255,255,255,0.04)', lineHeight: 1.5 },
  missingTag: { background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)', color: '#fbbf24', borderRadius: 8, padding: '5px 12px', fontSize: '0.82rem' },
  downloadBtn: { background: 'linear-gradient(135deg,#059669,#10b981)', border: 'none', color: '#fff', padding: 14, borderRadius: 12, fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans' },
  primaryBtn: { background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', border: 'none', color: '#fff', padding: 14, borderRadius: 12, fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans' },
  outlineBtn: { background: 'none', border: '1px solid rgba(255,255,255,0.07)', color: '#f1f0ff', padding: 14, borderRadius: 12, fontSize: '0.88rem', cursor: 'pointer', fontFamily: 'DM Sans' }
}
