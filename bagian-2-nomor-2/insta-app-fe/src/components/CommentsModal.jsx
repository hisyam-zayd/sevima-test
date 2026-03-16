import { useState, useEffect, useRef } from 'react'
import api from '../api'
import { useAuth } from '../context/AuthContext'

export default function CommentsModal({ post, onClose, onCommentsChange }) {
  const { user } = useAuth()
  const [comments, setComments] = useState([])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editContent, setEditContent] = useState('')
  const inputRef = useRef()

  useEffect(() => {
    fetchComments()
    inputRef.current?.focus()
  }, [])

  const fetchComments = async () => {
    const { data } = await api.get(`/comments?post_id=${post.id}`)
    setComments(data)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim()) return
    setLoading(true)
    try {
      const { data } = await api.post('/comments', { post_id: post.id, content })
      const updated = [{ ...data, user }, ...comments]
      setComments(updated)
      onCommentsChange?.(updated)
      setContent('')
    } catch {}
    setLoading(false)
  }

  const startEdit = (comment) => {
    setEditingId(comment.id)
    setEditContent(comment.content)
  }

  const saveEdit = async (commentId) => {
    if (!editContent.trim()) return
    try {
      const { data } = await api.put(`/comments/${commentId}`, { content: editContent })
      const updated = comments.map(c => c.id === commentId ? { ...c, content: data.content } : c)
      setComments(updated)
      onCommentsChange?.(updated)
      setEditingId(null)
    } catch {}
  }

  const deleteComment = async (commentId) => {
    if (!confirm('Hapus komentar ini?')) return
    try {
      await api.delete(`/comments/${commentId}`)
      const updated = comments.filter(c => c.id !== commentId)
      setComments(updated)
      onCommentsChange?.(updated)
    } catch {}
  }

  const avatar = (name) => name?.charAt(0).toUpperCase()

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-0 sm:px-4" onClick={onClose}>
      <div
        className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl shadow-xl flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h3 className="font-semibold text-sm">Komentar</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Comments list */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {comments.length === 0 && (
            <p className="text-gray-400 text-sm text-center py-8">Belum ada komentar. Jadilah yang pertama!</p>
          )}
          {comments.map(comment => (
            <div key={comment.id} className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                {avatar(comment.user?.name)}
              </div>
              <div className="flex-1">
                {editingId === comment.id ? (
                  <div className="flex gap-2">
                    <input
                      value={editContent}
                      onChange={e => setEditContent(e.target.value)}
                      className="flex-1 text-sm border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:border-blue-400"
                      onKeyDown={e => e.key === 'Enter' && saveEdit(comment.id)}
                    />
                    <button onClick={() => saveEdit(comment.id)} className="text-blue-500 text-xs font-semibold">Simpan</button>
                    <button onClick={() => setEditingId(null)} className="text-gray-400 text-xs">Batal</button>
                  </div>
                ) : (
                  <>
                    <p className="text-sm">
                      <span className="font-semibold mr-1">{comment.user?.name}</span>
                      {comment.content}
                    </p>
                    {comment.user_id === user?.id && (
                      <div className="flex gap-2 mt-0.5">
                        <button onClick={() => startEdit(comment)} className="text-xs text-gray-400 hover:text-gray-600">Edit</button>
                        <button onClick={() => deleteComment(comment.id)} className="text-xs text-gray-400 hover:text-red-500">Hapus</button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="border-t border-gray-100 px-4 py-3">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
              {avatar(user?.name)}
            </div>
            <input
              ref={inputRef}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Tambah komentar..."
              className="flex-1 text-sm bg-transparent outline-none"
              maxLength={1000}
            />
            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="text-blue-500 font-semibold text-sm disabled:opacity-40"
            >
              Kirim
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
