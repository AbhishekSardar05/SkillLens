import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    const userStr = params.get('user')
    const error = params.get('error')

    if (error) {
      navigate('/login?error=google_failed')
      return
    }

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr))
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        navigate(user.isAdmin ? '/admin' : '/dashboard')
      } catch {
        navigate('/login')
      }
    } else {
      navigate('/login')
    }
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: '#09090f',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#f1f0ff',
      fontFamily: 'DM Sans, sans-serif',
      gap: 16
    }}>
      <div style={{ fontSize: '2rem', animation: 'spin 1s linear infinite' }}>⚙</div>
      <div style={{ fontSize: '1rem', color: '#8b8aad' }}>Logging in with Google...</div>
      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  )
}
