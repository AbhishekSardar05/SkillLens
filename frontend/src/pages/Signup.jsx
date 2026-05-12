import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../api/axios'

const Toast = ({ message, type, onClose }) => (
  <div style={{ position:'fixed', top:24, right:24, zIndex:9999, background: type==='success' ? 'rgba(74,222,128,0.15)' : 'rgba(239,68,68,0.15)', border:`1px solid ${type==='success' ? 'rgba(74,222,128,0.4)' : 'rgba(239,68,68,0.4)'}`, color: type==='success' ? '#4ade80' : '#f87171', padding:'14px 20px', borderRadius:12, display:'flex', alignItems:'center', gap:10, fontSize:'0.9rem', fontWeight:500, backdropFilter:'blur(10px)', boxShadow:'0 8px 32px rgba(0,0,0,0.3)', animation:'slideIn 0.3s ease', fontFamily:'DM Sans, sans-serif' }}>
    <span>{type==='success' ? '✅' : '❌'}</span>
    <span>{message}</span>
    <span onClick={onClose} style={{ cursor:'pointer', marginLeft:8, opacity:0.7 }}>×</span>
  </div>
)

// Admin security key — change this to whatever you want
const ADMIN_SECRET_KEY = 'Gaurav@123'

export default function Signup() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [role, setRole] = useState('user') // 'user' or 'admin'
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', adminKey: '' })
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) return setError('Passwords do not match!')
    if (form.password.length < 6) return setError('Password must be at least 6 characters')
    if (role === 'admin' && form.adminKey !== ADMIN_SECRET_KEY) {
      return setError('Invalid admin security key!')
    }
    setLoading(true)
    setError('')
    try {
      await API.post('/auth/signup', {
        name: form.name,
        email: form.email,
        password: form.password,
        isAdmin: role === 'admin'
      })
      setStep(2)
      showToast(`OTP sent to ${form.email}!`, 'success')
    } catch (err) {
  console.log('FULL ERROR:', err)
  console.log('RESPONSE:', err.response)
  console.log('DATA:', err.response?.data)

  setError(err.response?.data?.message || err.message)
  showToast(err.response?.data?.message || err.message, 'error')
}
    setLoading(false)
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await API.post('/auth/verify-otp', { email: form.email, otp })
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      showToast('Account verified! Redirecting...', 'success')
      setTimeout(() => navigate(data.user.isAdmin ? '/admin' : '/dashboard'), 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP')
      showToast('Invalid OTP. Try again!', 'error')
    }
    setLoading(false)
  }

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes slideIn { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        input::placeholder { color: #555577; }
        input:focus { border-color: rgba(124,58,237,0.5) !important; outline: none; }
        .role-card:hover { border-color: rgba(124,58,237,0.4) !important; }
        .google-btn:hover { background: rgba(255,255,255,0.08) !important; }
      `}</style>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logoRow}>
          <div style={styles.logoIcon}>✦</div>
          <span style={{ fontFamily:'Bricolage Grotesque', fontWeight:700, fontSize:'1.1rem' }}>
            Skill<span style={{ color:'#67e8f9' }}>Lens</span>
          </span>
        </div>

        {step === 1 ? (
          <>
            <h2 style={styles.title}>Create Account</h2>
            <p style={styles.sub}>Start your AI career journey today</p>

            {error && <div style={styles.error}>{error}</div>}

            <form onSubmit={handleSignup}>
              {/* Name */}
              <div style={styles.field}>
                <label style={styles.label}>Full Name</label>
                <input style={styles.input} type="text" placeholder="Gaurav Raj" value={form.name} onChange={e => setForm({...form, name:e.target.value})} required />
              </div>

              {/* Email */}
              <div style={styles.field}>
                <label style={styles.label}>Email Address</label>
                <input style={styles.input} type="email" placeholder="xyz@gmail.com" value={form.email} onChange={e => setForm({...form, email:e.target.value})} required />
              </div>

              {/* Role Selection */}
              <div style={styles.field}>
                <label style={styles.label}>Account Type</label>
                <div style={{ display:'flex', gap:10 }}>
                  {['user', 'admin'].map(r => (
                    <div
                      key={r}
                      className="role-card"
                      onClick={() => setRole(r)}
                      style={{ ...styles.roleCard, ...(role === r ? styles.roleCardActive : {}) }}
                    >
                      <div style={{ ...styles.radioCircle, ...(role === r ? styles.radioCircleActive : {}) }}>
                        {role === r && <div style={styles.radioDot} />}
                      </div>
                      <span style={{ fontSize:'0.88rem', fontWeight:500, textTransform:'capitalize' }}>{r === 'user' ? '👤 User' : '👑 Admin'}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Admin Key (only if admin selected) */}
              {role === 'admin' && (
                <div style={{ ...styles.field, animation:'fadeIn 0.3s ease' }}>
                  <label style={styles.label}>Admin Security Key</label>
                  <input
                    style={{ ...styles.input, borderColor:'rgba(124,58,237,0.3)' }}
                    type="password"
                    placeholder="Enter admin security key"
                    value={form.adminKey}
                    onChange={e => setForm({...form, adminKey:e.target.value})}
                    required={role === 'admin'}
                  />
                  <div style={{ fontSize:'0.72rem', color:'#8b8aad', marginTop:4 }}>
                    🔐 Contact your administrator for the security key
                  </div>
                </div>
              )}

              {/* Password */}
              <div style={styles.field}>
                <label style={styles.label}>Password</label>
                <div style={{ position:'relative' }}>
                  <input
                    style={styles.input}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min 6 characters"
                    value={form.password}
                    onChange={e => setForm({...form, password:e.target.value})}
                    required
                  />
                  <span onClick={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                    {showPassword ? '🙈' : '👁'}
                  </span>
                </div>
              </div>

              {/* Confirm Password */}
              <div style={styles.field}>
                <label style={styles.label}>Confirm Password</label>
                <div style={{ position:'relative' }}>
                  <input
                    style={{ ...styles.input, borderColor: form.confirmPassword && form.password !== form.confirmPassword ? 'rgba(239,68,68,0.5)' : form.confirmPassword && form.password === form.confirmPassword ? 'rgba(74,222,128,0.5)' : 'rgba(255,255,255,0.08)' }}
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Re-enter password"
                    value={form.confirmPassword}
                    onChange={e => setForm({...form, confirmPassword:e.target.value})}
                    required
                  />
                  <span onClick={() => setShowConfirm(!showConfirm)} style={styles.eyeBtn}>
                    {showConfirm ? '🙈' : '👁'}
                  </span>
                </div>
                {form.confirmPassword && form.password !== form.confirmPassword && (
                  <div style={{ color:'#f87171', fontSize:'0.72rem', marginTop:4 }}>❌ Passwords do not match</div>
                )}
                {form.confirmPassword && form.password === form.confirmPassword && (
                  <div style={{ color:'#4ade80', fontSize:'0.72rem', marginTop:4 }}>✅ Passwords match</div>
                )}
              </div>

              <button style={styles.btn} type="submit" disabled={loading}>
                {loading ? '⏳ Sending OTP...' : 'Create Account →'}
              </button>
            </form>

            {/* Divider */}
            <div style={styles.divider}>
              <div style={styles.divLine} /><span style={styles.divText}>OR</span><div style={styles.divLine} />
            </div>

            {/* Google */}
            <button className="google-btn" onClick={() => window.location.href = 'https://skilllens-dpn0.onrender.com/api/auth/google'} style={styles.googleBtn}>
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
                <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.01c-.72.48-1.63.76-2.7.76-2.08 0-3.84-1.4-4.47-3.29H1.87v2.07A8 8 0 0 0 8.98 17z"/>
                <path fill="#FBBC05" d="M4.51 10.52A4.8 4.8 0 0 1 4.26 9c0-.53.09-1.04.25-1.52V5.41H1.87A8 8 0 0 0 .98 9c0 1.29.31 2.51.89 3.59l2.64-2.07z"/>
                <path fill="#EA4335" d="M8.98 3.58c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 .98 9l2.89 2.07C4.14 5 6.34 3.58 8.98 3.58z"/>
              </svg>
              Continue with Google
            </button>

            <p style={styles.switchText}>
              Already have an account? <Link to="/login" style={styles.link}>Login</Link>
            </p>
          </>
        ) : (
          <>
            <div style={{ fontSize:'2.5rem', marginBottom:12, textAlign:'center' }}>📧</div>
            <h2 style={{ ...styles.title, textAlign:'center' }}>Verify Your Email</h2>
            <p style={{ ...styles.sub, textAlign:'center' }}>
              OTP sent to <strong style={{ color:'#f1f0ff' }}>{form.email}</strong>
            </p>

            {error && <div style={styles.error}>{error}</div>}

            <form onSubmit={handleVerify}>
              <div style={styles.field}>
                <label style={styles.label}>Enter 6-digit OTP</label>
                <input
                  style={{ ...styles.input, textAlign:'center', fontSize:'1.8rem', letterSpacing:'0.8rem', fontWeight:700, padding:16 }}
                  type="text"
                  placeholder="------"
                  maxLength={6}
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g,''))}
                  required
                />
              </div>
              <button style={styles.btn} type="submit" disabled={loading}>
                {loading ? '⏳ Verifying...' : 'Verify & Continue →'}
              </button>
            </form>

            <p style={{ textAlign:'center', color:'#8b8aad', fontSize:'0.85rem', marginTop:16 }}>
              Didn't receive?{' '}
              <span style={styles.link} onClick={async () => {
                try {
                  await API.post('/auth/signup', { name:form.name, email:form.email, password:form.password })
                  showToast('OTP resent!', 'success')
                } catch {
                  showToast('Could not resend', 'error')
                }
              }}>Resend OTP</span>
            </p>
          </>
        )}
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'radial-gradient(ellipse at top, rgba(124,58,237,0.15) 0%, #09090f 60%)', padding:20, fontFamily:'DM Sans, sans-serif' },
  card: { background:'#111120', border:'1px solid rgba(255,255,255,0.07)', borderRadius:20, padding:'36px 32px', width:'100%', maxWidth:440 },
  logoRow: { display:'flex', alignItems:'center', gap:10, marginBottom:24 },
  logoIcon: { width:34, height:34, borderRadius:9, background:'linear-gradient(135deg,#7c3aed,#3b82f6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, color:'#fff' },
  title: { fontFamily:'Bricolage Grotesque, sans-serif', fontSize:'1.75rem', fontWeight:800, marginBottom:6 },
  sub: { color:'#8b8aad', fontSize:'0.88rem', marginBottom:22, lineHeight:1.6 },
  error: { background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', color:'#f87171', padding:'10px 14px', borderRadius:10, fontSize:'0.84rem', marginBottom:16 },
  field: { marginBottom:14 },
  label: { display:'block', fontSize:'0.8rem', color:'#8b8aad', marginBottom:6 },
  input: { width:'100%', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, padding:'11px 15px', color:'#f1f0ff', fontSize:'0.92rem', fontFamily:'DM Sans', transition:'border-color 0.2s' },
  eyeBtn: { position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', cursor:'pointer', fontSize:'0.9rem', userSelect:'none' },
  roleCard: { flex:1, display:'flex', alignItems:'center', gap:8, padding:'10px 14px', borderRadius:10, border:'1px solid rgba(255,255,255,0.08)', cursor:'pointer', background:'rgba(255,255,255,0.02)', transition:'all 0.2s' },
  roleCardActive: { background:'rgba(124,58,237,0.12)', borderColor:'rgba(124,58,237,0.4)' },
  radioCircle: { width:16, height:16, borderRadius:'50%', border:'2px solid rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all 0.2s' },
  radioCircleActive: { borderColor:'#7c3aed' },
  radioDot: { width:7, height:7, borderRadius:'50%', background:'#7c3aed' },
  btn: { width:'100%', background:'linear-gradient(135deg,#7c3aed,#3b82f6)', border:'none', color:'#fff', padding:13, borderRadius:12, fontSize:'0.98rem', fontWeight:600, cursor:'pointer', fontFamily:'DM Sans', marginTop:8 },
  divider: { display:'flex', alignItems:'center', gap:12, margin:'18px 0' },
  divLine: { flex:1, height:1, background:'rgba(255,255,255,0.07)' },
  divText: { color:'#8b8aad', fontSize:'0.75rem' },
  googleBtn: { width:'100%', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', color:'#f1f0ff', padding:'11px 20px', borderRadius:12, cursor:'pointer', fontFamily:'DM Sans', fontSize:'0.92rem', fontWeight:500, display:'flex', alignItems:'center', justifyContent:'center', gap:10, marginBottom:18 },
  switchText: { textAlign:'center', color:'#8b8aad', fontSize:'0.84rem' },
  link: { color:'#7c3aed', textDecoration:'none', fontWeight:600, cursor:'pointer' }
}
