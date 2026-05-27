import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="container">
      <div className="hero card">
        <div>
          <h1 style={{ margin: 0 }}>Build and learn with Social Media API</h1>
          <p className="lead muted">A small demo frontend to exercise authentication, profiles and comments.</p>
        </div>
        <div className="cta">
          <Link to="/register" className="btn btn-primary">Get Started</Link>
          <Link to="/login" className="btn btn-ghost">Sign in</Link>
        </div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <h3>Quick actions</h3>
        <p className="muted">Use the nav links to explore the main flows — login, register, profile and comments.</p>
      </div>
    </div>
  )
}
