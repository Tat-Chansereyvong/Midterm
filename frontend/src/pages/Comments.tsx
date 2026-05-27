import React, { useEffect, useState } from 'react'
import { listComments, createComment, updateComment, deleteComment } from '../api/api'

type Comment = { id: string; postId: string; content: string }

export default function Comments() {
  const [comments, setComments] = useState<Comment[]>([])
  const [content, setContent] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const data = await listComments({ limit: 10 })
        setComments(data)
      } catch (e) {
        setError('Failed to load comments')
      }
    })()
  }, [])

  const handleCreate = async () => {
    setError(null)
    try {
      const created = await createComment({ postId: 'post-1', content })
      setComments((s) => [created, ...s])
      setContent('')
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Create failed')
    }
  }

  const handleUpdate = async (id: string) => {
    const newContent = prompt('New content')
    if (!newContent) return
    try {
      const updated = await updateComment(id, { content: newContent })
      setComments((s) => s.map((c) => (c.id === id ? updated : c)))
    } catch (e) {
      setError('Update failed')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteComment(id)
      setComments((s) => s.filter((c) => c.id !== id))
    } catch (e) {
      setError('Delete failed')
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Comments</h2>

        <div style={{ marginBottom: 12 }}>
          <div className="form-row">
            <label htmlFor="new-comment">New comment</label>
            <input id="new-comment" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write a comment" />
          </div>
          <div className="actions">
            <button className="btn btn-primary" onClick={handleCreate}>Post</button>
          </div>
        </div>

        {error && <div role="alert" style={{ color: 'var(--danger)' }}>{error}</div>}

        <div className="comments-list">
          {comments.map((c) => (
            <div key={c.id} className="comment">
              <div>
                <div style={{ fontWeight: 600 }}>{c.postId}</div>
                <div style={{ marginTop: 6 }}>{c.content}</div>
                <div className="meta">by unknown • just now</div>
              </div>
              <div className="comment-actions">
                <button className="btn btn-ghost" onClick={() => handleUpdate(c.id)}>Edit</button>
                <button className="btn btn-ghost" onClick={() => handleDelete(c.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
