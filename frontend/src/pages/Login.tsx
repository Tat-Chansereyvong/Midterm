import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await login({ email, password })
      navigate('/users/me')
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="container">
      <div className="auth-card card">
        <h2>Welcome back</h2>
        <p className="muted">Sign in to access your profile and manage comments.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="form-row">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          {error && <div role="alert" style={{ color: 'var(--danger)' }}>{error}</div>}

          <div className="actions" style={{ marginTop: 8 }}>
            <button className="btn btn-primary" type="submit">Sign in</button>
            <button type="button" className="btn btn-ghost" onClick={() => navigate('/register')}>Create account</button>
          </div>
        </form>
      </div>
    </div>
  )
}
