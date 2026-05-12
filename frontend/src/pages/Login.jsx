import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../api/axios'

const Toast = ({ message, type, onClose }) => (
  <div style={{
    position: 'fixed', top: 24, right: 24, zIndex: 9999,
    background: type === 'success' ? 'rgba(74,222,128,0.15)' : 'rgba(239,68,68,0.15)',
    border: `1px solid ${type === 'success' ? 'rgba(74,222,128,0.4)' : 'rgba(239,68,68,0.4)'}`,
    color: type === 'success' ? '#4ade80' : '#f87171',
    padding: '14px 20px', borderRadius: 12,
    display: 'flex', alignItems: 'center', gap: 10,
    fontSize: '0.9rem', fontWeight: 500,
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    animation: 'slideIn 0.3s ease',
    fontFamily: 'DM Sans, sans-serif'
  }}>
    <span>{type === 'success' ? '✅' : '❌'}</span>
    <span>{message}</span>
    <span onClick={onClose} style={{ cursor: 'pointer', marginLeft: 8, opacity: 0.7 }}>×</span>
  </div>
)

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await API.post('/auth/login', form)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      showToast('Login successful! Redirecting...', 'success')
      setTimeout(() => navigate('/dashboard'), 1200)
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong'
      setError(msg)
      showToast(msg, 'error')
    }
    setLoading(false)
  }

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google'
  }

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes slideIn { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }
        input::placeholder { color: #555577; }
        input:focus { border-color: rgba(124,58,237,0.5) !important; outline: none; }
        .google-btn:hover { background: rgba(255,255,255,0.08) !important; }
      `}</style>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logo}>
          <div style={styles.logoIcon}>✦</div>
          <span style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700 }}>
            Skill<span style={{ color: '#67e8f9' }}>Lens</span>
          </span>
        </div>

        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.sub}>Login to your SkillLens account</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleLogin}>
          <div style={styles.field}>
            <label style={styles.label}>Email Address</label>
            <input
              style={styles.input}
              type="email"
              placeholder="gaurav@gmail.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div style={styles.field}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
              <label style={styles.label}>Password</label>
              <Link to="/forgot-password" style={{ color: '#7c3aed', fontSize: '0.78rem', textDecoration: 'none', fontWeight: 500 }}>
                Forgot Password?
              </Link>
            </div>
            <input
              style={styles.input}
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login →'}
          </button>
        </form>

        {/* Divider */}
        <div style={styles.divider}>
          <div style={styles.dividerLine} />
          <span style={styles.dividerText}>or</span>
          <div style={styles.dividerLine} />
        </div>

        {/* Google Auth */}
        <button
          className="google-btn"
          onClick={handleGoogleLogin}
          style={styles.googleBtn}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
            <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.01c-.72.48-1.63.76-2.7.76-2.08 0-3.84-1.4-4.47-3.29H1.87v2.07A8 8 0 0 0 8.98 17z"/>
            <path fill="#FBBC05" d="M4.51 10.52A4.8 4.8 0 0 1 4.26 9c0-.53.09-1.04.25-1.52V5.41H1.87A8 8 0 0 0 .98 9c0 1.29.31 2.51.89 3.59l2.64-2.07z"/>
            <path fill="#EA4335" d="M8.98 3.58c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 .98 9l2.89 2.07C4.14 5 6.34 3.58 8.98 3.58z"/>
          </svg>
          Continue with Google
        </button>

        <p style={styles.switch}>
          Don't have an account?{' '}
          <Link to="/signup" style={styles.link}>Sign Up</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'radial-gradient(ellipse at top, rgba(99,102,241,0.15) 0%, #09090f 60%)',
    padding: 20, fontFamily: 'DM Sans, sans-serif'
  },
  card: {
    background: '#111120', border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 20, padding: '40px 36px', width: '100%', maxWidth: 440
  },
  logo: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28, fontSize: '1.15rem' },
  logoIcon: { width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 },
  title: { fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: '1.8rem', fontWeight: 800, marginBottom: 6 },
  sub: { color: '#8b8aad', fontSize: '0.9rem', marginBottom: 24 },
  error: {
    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
    color: '#f87171', padding: '10px 14px', borderRadius: 10,
    fontSize: '0.85rem', marginBottom: 16
  },
  field: { marginBottom: 16 },
  label: { fontSize: '0.82rem', color: '#8b8aad' },
  input: {
    width: '100%', background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10,
    padding: '11px 15px', color: '#f1f0ff', fontSize: '0.95rem',
    fontFamily: 'DM Sans', transition: 'border-color 0.2s', display: 'block', marginTop: 7
  },
  btn: {
    width: '100%', background: 'linear-gradient(135deg,#7c3aed,#3b82f6)',
    border: 'none', color: '#fff', padding: 13, borderRadius: 12,
    fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
    fontFamily: 'DM Sans', marginTop: 8
  },
  divider: { display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' },
  dividerLine: { flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' },
  dividerText: { color: '#8b8aad', fontSize: '0.8rem' },
  googleBtn: {
    width: '100%', background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)', color: '#f1f0ff',
    padding: '12px 20px', borderRadius: 12, cursor: 'pointer',
    fontFamily: 'DM Sans', fontSize: '0.95rem', fontWeight: 500,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: 10, marginBottom: 20
  },
  switch: { textAlign: 'center', color: '#8b8aad', fontSize: '0.85rem', marginTop: 4 },
  link: { color: '#7c3aed', textDecoration: 'none', fontWeight: 600 }
}