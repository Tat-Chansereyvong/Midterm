import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register } from '../api/api'

export default function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await register({ username, email, password })
      navigate('/users/me')
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="container">
      <div className="auth-card card">
        <h2>Create an account</h2>
        <p className="muted">Join and start posting comments and interacting.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="username">Username</label>
            <input id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>

          <div className="form-row">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="form-row">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          {error && <div role="alert" style={{ color: 'var(--danger)' }}>{error}</div>}

          <div className="actions">
            <button className="btn btn-primary" type="submit">Create account</button>
            <button type="button" className="btn btn-ghost" onClick={() => navigate('/login')}>Have an account?</button>
          </div>
        </form>
      </div>
    </div>
  )
}
