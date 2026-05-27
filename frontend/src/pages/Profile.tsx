import React, { useEffect, useState } from 'react'
import { getProfile, updateProfile } from '../api/api'

export default function Profile() {
  const [profile, setProfile] = useState<any>(null)
  const [bio, setBio] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const data = await getProfile()
        setProfile(data)
        setBio(data.bio || '')
      } catch (e) {
        setProfile(null)
      }
    })()
  }, [])

  const handleSave = async () => {
    setMessage(null)
    try {
      const updated = await updateProfile({ bio })
      setProfile(updated)
      setMessage('Profile updated')
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'Update failed')
    }
  }

  if (!profile) return <div>Loading profile...</div>

  return (
    <div className="container">
      <div className="card">
        <h2>Profile</h2>
        <div className="profile-grid">
          <div>
            <div className="avatar">{profile.username?.charAt(0)?.toUpperCase() || 'U'}</div>
          </div>
          <div>
            <div style={{ marginBottom: 8 }}><strong>Username:</strong> {profile.username}</div>
            <div style={{ marginBottom: 8 }}><strong>Email:</strong> {profile.email}</div>

            <div className="form-row">
              <label htmlFor="bio">Bio</label>
              <textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} />
            </div>

            <div className="actions">
              <button className="btn btn-primary" onClick={handleSave}>Save changes</button>
            </div>
            {message && <div role="status" style={{ marginTop: 8 }}>{message}</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
