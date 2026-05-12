import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'

export default function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', bio: '' })
  const [loading, setLoading] = useState(false)
  const [photoLoading, setPhotoLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [stats, setStats] = useState({ resumes: 0, analyses: 0 })
  const fileInputRef = useRef(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    const u = localStorage.getItem('user')
    if (!u) { navigate('/login'); return }
    const parsed = JSON.parse(u)
    setUser(parsed)
    setForm({ name: parsed.name || '', phone: parsed.phone || '', bio: parsed.bio || '' })
    fetchFreshProfile()
    fetchStats()
  }, [])

  const fetchFreshProfile = async () => {
    try {
      const { data } = await API.get('/auth/profile')
      setUser(data)
      setForm({ name: data.name || '', phone: data.phone || '', bio: data.bio || '' })
      localStorage.setItem('user', JSON.stringify(data))
    } catch (err) {
      console.log('Profile fetch error:', err.message)
    }
  }

  const fetchStats = async () => {
    try {
      const [resumeRes, analysisRes] = await Promise.all([
        API.get('/resume/my').catch(() => ({ data: [] })),
        API.get('/skillgap/my').catch(() => ({ data: [] }))
      ])
      setStats({ resumes: resumeRes.data.length, analyses: analysisRes.data.length })
    } catch {}
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await API.put('/auth/profile', form)
      const updated = { ...user, ...data.user }
      localStorage.setItem('user', JSON.stringify(updated))
      setUser(updated)
      setEditing(false)
      showToast('Profile updated successfully!')
    } catch (err) {
      showToast(err.response?.data?.message || 'Update failed', 'error')
    }
    setLoading(false)
  }

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return showToast('Only image files allowed!', 'error')
    if (file.size > 2 * 1024 * 1024) return showToast('Image must be under 2MB!', 'error')

    setPhotoLoading(true)
    try {
      const formData = new FormData()
      formData.append('photo', file)
      const { data } = await API.post('/auth/profile/photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      const updated = { ...user, ...data.user }
      localStorage.setItem('user', JSON.stringify(updated))
      setUser(updated)
      showToast('Profile photo updated! 🎉')
    } catch (err) {
      showToast(err.response?.data?.message || 'Photo upload failed', 'error')
    }
    setPhotoLoading(false)
  }

  const getPhotoUrl = () => {
    if (!user?.profilePhoto || user.profilePhoto === '') return null
    // Cloudinary URL — directly return karo
    if (user.profilePhoto.startsWith('http')) return user.profilePhoto
    // Local URL
    return `http://localhost:5000${user.profilePhoto}`
  }

  if (!user) return (
    <div style={{ minHeight: '100vh', background: '#09090f', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b8aad', fontFamily: 'DM Sans, sans-serif' }}>
      ⏳ Loading profile...
    </div>
  )

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        input:focus { border-color: rgba(124,58,237,0.5) !important; outline: none; }
        textarea:focus { border-color: rgba(124,58,237,0.5) !important; outline: none; }
        @keyframes slideIn { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .quick-btn:hover { background: rgba(99,102,241,0.1) !important; border-color: rgba(99,102,241,0.3) !important; }
        .photo-overlay { opacity: 0; transition: opacity 0.2s; }
        .avatar-wrap:hover .photo-overlay { opacity: 1 !important; }
      `}</style>

      {toast && (
        <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 9999, background: toast.type === 'success' ? 'rgba(74,222,128,0.15)' : 'rgba(239,68,68,0.15)', border: `1px solid ${toast.type === 'success' ? 'rgba(74,222,128,0.4)' : 'rgba(239,68,68,0.4)'}`, color: toast.type === 'success' ? '#4ade80' : '#f87171', padding: '12px 20px', borderRadius: 12, fontSize: '0.9rem', fontFamily: 'DM Sans', animation: 'slideIn 0.3s ease', backdropFilter: 'blur(10px)' }}>
          {toast.type === 'success' ? '✅' : '❌'} {toast.msg}
        </div>
      )}

      <div style={styles.container}>
        <button onClick={() => navigate('/dashboard')} style={styles.back}>← Dashboard</button>
        <h1 style={styles.title}>My Profile</h1>
        <p style={styles.sub}>Manage your personal information and account settings</p>

        <div style={styles.grid}>
          {/* Left — Avatar Card */}
          <div style={styles.avatarCard}>

            {/* Profile Photo with Upload */}
            <div className="avatar-wrap" style={{ position: 'relative', marginBottom: 14, cursor: 'pointer' }} onClick={() => fileInputRef.current?.click()}>
              {getPhotoUrl() ? (
                <img
                  src={getPhotoUrl()}
                  alt="Profile"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                  style={{ width: 88, height: 88, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(124,58,237,0.4)', display: 'block' }}
                />
              ) : null}
              <div style={{ ...styles.avatar, display: getPhotoUrl() ? 'none' : 'flex' }}>
                {photoLoading ? (
                  <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⚙</span>
                ) : user.name?.[0]?.toUpperCase()}
              </div>

              {/* Hover Overlay */}
              <div className="photo-overlay" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: '1.2rem' }}>📷</span>
                <span style={{ fontSize: '0.6rem', color: '#fff', fontWeight: 600 }}>CHANGE</span>
              </div>
            </div>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handlePhotoChange}
            />

            {/* Change Photo Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={photoLoading}
              style={styles.changePhotoBtn}
            >
              {photoLoading ? '⏳ Uploading...' : '📷 Change Photo'}
            </button>

            <div style={styles.userName}>{user.name}</div>
            <div style={styles.userEmail}>{user.email}</div>
            {user.isAdmin && <div style={styles.adminBadge}>👑 Admin</div>}
            <div style={styles.memberSince}>
              📅 Member since {new Date(user.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>

            {/* Stats */}
            <div style={styles.statsGrid}>
              <div style={styles.statItem}>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#6366f1' }}>{stats.resumes}</div>
                <div style={styles.statLabel}>Resumes</div>
              </div>
              <div style={styles.statItem}>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#7c3aed' }}>{stats.analyses}</div>
                <div style={styles.statLabel}>Analyses</div>
              </div>
            </div>

            {/* Quick Links */}
            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
              <button className="quick-btn" onClick={() => navigate('/upload')} style={styles.quickBtn}>📄 Upload Resume</button>
              <button className="quick-btn" onClick={() => navigate('/skillgap')} style={styles.quickBtn}>🎯 Skill Gap</button>
              <button className="quick-btn" onClick={() => navigate('/dashboard')} style={styles.quickBtn}>⊞ Dashboard</button>
              {user.isAdmin && (
                <button className="quick-btn" onClick={() => navigate('/admin')} style={{ ...styles.quickBtn, color: '#818cf8', borderColor: 'rgba(124,58,237,0.3)' }}>
                  👑 Admin Panel
                </button>
              )}
            </div>
          </div>

          {/* Right — Info Card */}
          <div style={styles.infoCard}>
            <div style={styles.infoHeader}>
              <div style={styles.infoTitle}>👤 Account Information</div>
              {!editing && (
                <button onClick={() => setEditing(true)} style={styles.editBtn}>✏️ Edit Profile</button>
              )}
            </div>

            {!editing ? (
              <div>
                <div style={styles.sectionLabel}>BASIC INFORMATION</div>
                <div style={styles.fieldGrid}>
                  <div style={styles.fieldItem}>
                    <div style={styles.fieldLabel}>👤 Full Name</div>
                    <div style={styles.fieldValue}>{user.name}</div>
                  </div>
                  <div style={styles.fieldItem}>
                    <div style={styles.fieldLabel}>📱 Phone Number</div>
                    <div style={{ ...styles.fieldValue, color: user.phone ? '#f1f0ff' : '#555577' }}>
                      {user.phone || 'Not added yet'}
                    </div>
                  </div>
                </div>

                <div style={styles.sectionLabel}>CONTACT DETAILS</div>
                <div style={styles.fieldGrid}>
                  <div style={styles.fieldItem}>
                    <div style={styles.fieldLabel}>📧 Email Address</div>
                    <div style={{ ...styles.fieldValue, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span>{user.email}</span>
                      <span style={{ background: 'rgba(74,222,128,0.15)', color: '#4ade80', borderRadius: 99, padding: '2px 8px', fontSize: '0.65rem', flexShrink: 0 }}>🔒 Locked</span>
                    </div>
                  </div>
                  <div style={styles.fieldItem}>
                    <div style={styles.fieldLabel}>✅ Account Status</div>
                    <div style={{ ...styles.fieldValue, color: user.isVerified ? '#4ade80' : '#f87171' }}>
                      {user.isVerified ? '✅ Verified' : '❌ Not Verified'}
                    </div>
                  </div>
                </div>

                {user.bio && (
                  <>
                    <div style={styles.sectionLabel}>BIO</div>
                    <div style={{ ...styles.fieldValue, padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, lineHeight: 1.6, border: '1px solid rgba(255,255,255,0.06)' }}>
                      {user.bio}
                    </div>
                  </>
                )}

                {!user.bio && !user.phone && (
                  <div style={{ marginTop: 16, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 12, padding: '14px 16px', fontSize: '0.85rem', color: '#8b8aad' }}>
                    💡 Click <strong style={{ color: '#818cf8' }}>Edit Profile</strong> to add your phone number and bio!
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleUpdate}>
                <div style={styles.sectionLabel}>BASIC INFORMATION</div>
                <div style={styles.fieldGrid}>
                  <div>
                    <label style={styles.label}>Full Name</label>
                    <input style={styles.input} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your full name" required />
                  </div>
                  <div>
                    <label style={styles.label}>Phone Number</label>
                    <input style={styles.input} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="10-digit mobile number" maxLength={10} />
                  </div>
                </div>

                <div style={styles.sectionLabel}>BIO</div>
                <textarea
                  style={{ ...styles.input, height: 90, resize: 'vertical', fontFamily: 'DM Sans' }}
                  value={form.bio}
                  onChange={e => setForm({ ...form, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                />

                <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                  <button type="submit" disabled={loading} style={styles.saveBtn}>
                    {loading ? 'Saving...' : '✅ Save Changes'}
                  </button>
                  <button type="button" onClick={() => setEditing(false)} style={styles.cancelBtn}>
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Security Section */}
            <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={styles.sectionLabel}>SECURITY</div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button onClick={() => navigate('/forgot-password')} style={styles.securityBtn}>
                  🔑 Change Password
                </button>
                <button onClick={() => { localStorage.clear(); navigate('/login') }} style={{ ...styles.securityBtn, color: '#f87171', borderColor: 'rgba(239,68,68,0.3)' }}>
                  ⏻ Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', background: '#09090f', color: '#f1f0ff', fontFamily: 'DM Sans, sans-serif', padding: '40px 24px' },
  container: { maxWidth: 960, margin: '0 auto' },
  back: { background: 'none', border: 'none', color: '#8b8aad', cursor: 'pointer', fontFamily: 'DM Sans', fontSize: '0.9rem', marginBottom: 24, padding: 0 },
  title: { fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: '2rem', fontWeight: 800, marginBottom: 6 },
  sub: { color: '#8b8aad', fontSize: '0.9rem', marginBottom: 32 },
  grid: { display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24 },
  avatarCard: { background: '#111120', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', height: 'fit-content' },
  avatar: { width: 88, height: 88, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem', fontWeight: 800, color: '#fff', border: '3px solid rgba(124,58,237,0.4)' },
  changePhotoBtn: { background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)', color: '#818cf8', borderRadius: 99, padding: '5px 14px', cursor: 'pointer', fontFamily: 'DM Sans', fontSize: '0.75rem', fontWeight: 600, marginBottom: 12, marginTop: 6 },
  userName: { fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: '1.1rem', fontWeight: 700, marginBottom: 4 },
  userEmail: { color: '#8b8aad', fontSize: '0.78rem', marginBottom: 10, wordBreak: 'break-all' },
  adminBadge: { background: 'linear-gradient(135deg,rgba(124,58,237,0.2),rgba(99,102,241,0.2))', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8', borderRadius: 99, padding: '4px 12px', fontSize: '0.72rem', fontWeight: 600, marginBottom: 8 },
  memberSince: { color: '#8b8aad', fontSize: '0.72rem', marginBottom: 20 },
  statsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, width: '100%' },
  statItem: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '12px 8px', textAlign: 'center' },
  statLabel: { color: '#8b8aad', fontSize: '0.7rem', marginTop: 3 },
  quickBtn: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#d1d0f0', borderRadius: 10, padding: '9px 14px', cursor: 'pointer', fontFamily: 'DM Sans', fontSize: '0.82rem', textAlign: 'left', transition: 'all 0.2s', width: '100%' },
  infoCard: { background: '#111120', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 28 },
  infoHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  infoTitle: { fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: '1.1rem', fontWeight: 700 },
  editBtn: { background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', border: 'none', color: '#fff', padding: '8px 18px', borderRadius: 10, cursor: 'pointer', fontFamily: 'DM Sans', fontSize: '0.85rem', fontWeight: 600 },
  sectionLabel: { fontSize: '0.68rem', color: '#8b8aad', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12, marginTop: 16 },
  fieldGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 8 },
  fieldItem: { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '12px 14px' },
  fieldLabel: { fontSize: '0.72rem', color: '#8b8aad', marginBottom: 6 },
  fieldValue: { fontSize: '0.88rem', fontWeight: 500, color: '#f1f0ff' },
  label: { display: 'block', fontSize: '0.78rem', color: '#8b8aad', marginBottom: 6 },
  input: { width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 14px', color: '#f1f0ff', fontSize: '0.9rem', fontFamily: 'DM Sans', marginBottom: 8 },
  saveBtn: { background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', border: 'none', color: '#fff', padding: '10px 24px', borderRadius: 10, cursor: 'pointer', fontFamily: 'DM Sans', fontWeight: 600 },
  cancelBtn: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#8b8aad', padding: '10px 20px', borderRadius: 10, cursor: 'pointer', fontFamily: 'DM Sans' },
  securityBtn: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#d1d0f0', padding: '9px 18px', borderRadius: 10, cursor: 'pointer', fontFamily: 'DM Sans', fontSize: '0.85rem' },
}