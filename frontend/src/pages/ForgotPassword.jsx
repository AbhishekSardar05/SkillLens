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

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1=email, 2=otp, 3=new password
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  const handleSendOTP = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await API.post('/auth/forgot-password', { email })
      setStep(2)
      showToast(`OTP sent to ${email}!`, 'success')
    } catch (err) {
      setError(err.response?.data?.message || 'Email not found')
      showToast('Email not found!', 'error')
    }
    setLoading(false)
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await API.post('/auth/verify-reset-otp', { email, otp })
      setStep(3)
      showToast('OTP verified! Set new password', 'success')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP')
      showToast('Invalid OTP!', 'error')
    }
    setLoading(false)
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) return setError('Passwords do not match!')
    if (newPassword.length < 6) return setError('Password must be at least 6 characters')
    setLoading(true)
    setError('')
    try {
      await API.post('/auth/reset-password', { email, otp, newPassword })
      showToast('Password reset successful!', 'success')
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed')
      showToast('Reset failed!', 'error')
    }
    setLoading(false)
  }

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes slideIn { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }
        input::placeholder { color: #555577; }
        input:focus { border-color: rgba(124,58,237,0.5) !important; outline: none; }
      `}</style>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logo}>
          <div style={styles.logoIcon}>✦</div>
          <span style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700 }}>Skill<span style={{ color: '#67e8f9' }}>Lens</span></span>
        </div>

        {/* Steps indicator */}
        <div style={styles.steps}>
          {['Email', 'OTP', 'Password'].map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                ...styles.stepDot,
                background: step > i + 1 ? '#4ade80' : step === i + 1 ? 'linear-gradient(135deg,#7c3aed,#3b82f6)' : 'rgba(255,255,255,0.07)',
                color: step >= i + 1 ? '#fff' : '#8b8aad'
              }}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: '0.75rem', color: step === i + 1 ? '#f1f0ff' : '#8b8aad' }}>{s}</span>
              {i < 2 && <div style={{ width: 24, height: 1, background: 'rgba(255,255,255,0.1)', margin: '0 4px' }} />}
            </div>
          ))}
        </div>

        {/* Step 1 — Email */}
        {step === 1 && (
          <>
            <div style={styles.icon}>🔐</div>
            <h2 style={styles.title}>Forgot Password?</h2>
            <p style={styles.sub}>Enter your email address and we'll send you an OTP to reset your password.</p>

            {error && <div style={styles.error}>{error}</div>}

            <form onSubmit={handleSendOTP}>
              <div style={styles.field}>
                <label style={styles.label}>Email Address</label>
                <input
                  style={styles.input}
                  type="email"
                  placeholder="gaurav@gmail.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <button style={styles.btn} type="submit" disabled={loading}>
                {loading ? 'Sending OTP...' : 'Send OTP →'}
              </button>
            </form>

            <p style={styles.switch}>
              Remember password? <Link to="/login" style={styles.link}>Login</Link>
            </p>
          </>
        )}

        {/* Step 2 — OTP */}
        {step === 2 && (
          <>
            <div style={styles.icon}>📧</div>
            <h2 style={styles.title}>Enter OTP</h2>
            <p style={styles.sub}>
              We sent a 6-digit OTP to<br />
              <strong style={{ color: '#f1f0ff' }}>{email}</strong>
            </p>

            {error && <div style={styles.error}>{error}</div>}

            <form onSubmit={handleVerifyOTP}>
              <div style={styles.field}>
                <label style={styles.label}>OTP Code</label>
                <input
                  style={{ ...styles.input, textAlign: 'center', fontSize: '1.8rem', letterSpacing: '0.8rem', fontWeight: 700, padding: '16px' }}
                  type="text"
                  placeholder="------"
                  maxLength={6}
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  required
                />
              </div>
              <button style={styles.btn} type="submit" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify OTP →'}
              </button>
            </form>

            <p style={styles.switch}>
              Didn't receive OTP?{' '}
              <span style={styles.link} onClick={() => { setStep(1); setOtp('') }}>
                Change Email
              </span>
            </p>
          </>
        )}

        {/* Step 3 — New Password */}
        {step === 3 && (
          <>
            <div style={styles.icon}>🔑</div>
            <h2 style={styles.title}>Set New Password</h2>
            <p style={styles.sub}>Create a strong password for your account.</p>

            {error && <div style={styles.error}>{error}</div>}

            <form onSubmit={handleResetPassword}>
              <div style={styles.field}>
                <label style={styles.label}>New Password</label>
                <input
                  style={styles.input}
                  type="password"
                  placeholder="Min 6 characters"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Confirm New Password</label>
                <input
                  style={{
                    ...styles.input,
                    borderColor: confirmPassword && newPassword !== confirmPassword
                      ? 'rgba(239,68,68,0.5)'
                      : confirmPassword && newPassword === confirmPassword
                      ? 'rgba(74,222,128,0.5)'
                      : 'rgba(255,255,255,0.08)'
                  }}
                  type="password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                />
                {confirmPassword && newPassword !== confirmPassword && (
                  <div style={{ color: '#f87171', fontSize: '0.75rem', marginTop: 6 }}>❌ Passwords do not match</div>
                )}
                {confirmPassword && newPassword === confirmPassword && (
                  <div style={{ color: '#4ade80', fontSize: '0.75rem', marginTop: 6 }}>✅ Passwords match</div>
                )}
              </div>
              <button style={styles.btn} type="submit" disabled={loading}>
                {loading ? 'Resetting...' : '🔑 Reset Password →'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'radial-gradient(ellipse at top, rgba(124,58,237,0.15) 0%, #09090f 60%)',
    padding: 20, fontFamily: 'DM Sans, sans-serif'
  },
  card: {
    background: '#111120', border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 20, padding: '40px 36px', width: '100%', maxWidth: 440
  },
  logo: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, fontSize: '1.15rem' },
  logoIcon: { width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 },
  steps: { display: 'flex', alignItems: 'center', marginBottom: 28 },
  stepDot: { width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 },
  icon: { fontSize: '2.5rem', marginBottom: 12 },
  title: { fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: '1.8rem', fontWeight: 800, marginBottom: 8 },
  sub: { color: '#8b8aad', fontSize: '0.9rem', marginBottom: 24, lineHeight: 1.6 },
  error: {
    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
    color: '#f87171', padding: '10px 14px', borderRadius: 10,
    fontSize: '0.85rem', marginBottom: 16
  },
  field: { marginBottom: 16 },
  label: { display: 'block', fontSize: '0.82rem', color: '#8b8aad', marginBottom: 7 },
  input: {
    width: '100%', background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10,
    padding: '11px 15px', color: '#f1f0ff', fontSize: '0.95rem',
    fontFamily: 'DM Sans', transition: 'border-color 0.2s'
  },
  btn: {
    width: '100%', background: 'linear-gradient(135deg,#7c3aed,#3b82f6)',
    border: 'none', color: '#fff', padding: 13, borderRadius: 12,
    fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
    fontFamily: 'DM Sans', marginTop: 8
  },
  switch: { textAlign: 'center', color: '#8b8aad', fontSize: '0.85rem', marginTop: 20 },
  link: { color: '#7c3aed', textDecoration: 'none', fontWeight: 600, cursor: 'pointer' }
}