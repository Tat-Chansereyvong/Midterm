import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function NavBar() {
  const [loggedIn, setLoggedIn] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem('token'))
    const onStorage = () => setLoggedIn(!!localStorage.getItem('token'))
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  function handleLogout() {
    localStorage.removeItem('token')
    setLoggedIn(false)
    navigate('/')
  }

  return (
    <nav className="app-nav">
      <div className="brand">
        <div className="logo">SM</div>
        <div>Social Media</div>
      </div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/comments">Comments</Link>
        {loggedIn ? (
          <>
            <Link to="/users/me">Profile</Link>
            <button className="btn btn-ghost" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}
