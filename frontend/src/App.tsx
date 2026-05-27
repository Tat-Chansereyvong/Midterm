import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Comments from './pages/Comments'
import Home from './pages/Home'
import NotFound from './error/NotFound'
import ErrorBoundary from './error/ErrorBoundary'
import NavBar from './components/NavBar'

export default function App() {
  return (
    <ErrorBoundary>
      <NavBar />
      <main style={{ padding: 20 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/users/me" element={<Profile />} />
          <Route path="/comments" element={<Comments />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </ErrorBoundary>
  )
}
