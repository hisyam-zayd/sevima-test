import { useState } from 'react'
import api from '../api'
import { useAuth } from '../context/AuthContext'
import CommentsModal from './CommentsModal'

export default function PostCard({ post, onUpdated, onDeleted }) {
  const { user } = useAuth()
  const [liked, setLiked] = useState(() => {
    return post.likes?.some(l => l.user_id === user?.id) ?? false
  })
  const [likeId, setLikeId] = useState(() => {
    return post.likes?.find(l => l.user_id === user?.id)?.id ?? null
  })
  const [likesCount, setLikesCount] = useState(post.likes?.length ?? 0)
  const [showComments, setShowComments] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editContent, setEditContent] = useState(post.content)
  const [menuOpen, setMenuOpen] = useState(false)
  const [likeLoading, setLikeLoading] = useState(false)

  const isOwner = user?.id === post.user_id

  const handleLike = async () => {
    if (likeLoading) return
    setLikeLoading(true)
    try {
      if (liked) {
        await api.delete(`/likes/${likeId}`, { data: { post_id: post.id } })
        setLiked(false)
        setLikeId(null)
        setLikesCount(c => c - 1)
      } else {
        const { data } = await api.post('/likes', { post_id: post.id })
        setLiked(true)
        setLikeId(data.id)
        setLikesCount(c => c + 1)
      }
    } catch {}
    setLikeLoading(false)
  }

  const saveEdit = async () => {
    if (!editContent.trim()) return
    try {
      const { data } = await api.put(`/posts/${post.id}`, { content: editContent })
      onUpdated({ ...post, content: data.content })
      setEditing(false)
    } catch {}
  }

  const deletePost = async () => {
    if (!confirm('Hapus post ini?')) return
    try {
      await api.delete(`/posts/${post.id}`)
      onDeleted(post.id)
    } catch {}
  }

  const commentsCount = post.comments?.length ?? 0
  const avatar = post.user?.name?.charAt(0).toUpperCase()
  const imageUrl = post.image_path ? `/storage/${post.image_path}` : null

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'Baru saja'
    if (mins < 60) return `${mins} menit lalu`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours} jam lalu`
    const days = Math.floor(hours / 24)
    return `${days} hari lalu`
  }

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
              {avatar}
            </div>
            <div>
              <p className="font-semibold text-sm">{post.user?.name}</p>
              <p className="text-xs text-gray-400">{timeAgo(post.created_at)}</p>
            </div>
          </div>

          {isOwner && (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(v => !v)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
                </svg>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden">
                  <button
                    onClick={() => { setEditing(true); setMenuOpen(false) }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    Edit Post
                  </button>
                  <button
                    onClick={() => { deletePost(); setMenuOpen(false) }}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                  >
                    Hapus Post
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Image */}
        {imageUrl && (
          <img
            src={imageUrl}
            alt="post"
            className="w-full object-cover max-h-96"
          />
        )}

        {/* Content */}
        <div className="px-4 py-2">
          {editing ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
                rows={3}
                maxLength={1000}
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 resize-none focus:outline-none focus:border-blue-400"
              />
              <div className="flex gap-2">
                <button onClick={saveEdit} className="text-blue-500 text-sm font-semibold hover:text-blue-600">Simpan</button>
                <button onClick={() => { setEditing(false); setEditContent(post.content) }} className="text-gray-400 text-sm hover:text-gray-600">Batal</button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-800 whitespace-pre-wrap">{post.content}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 px-4 pb-3 pt-1">
          <button
            onClick={handleLike}
            disabled={likeLoading}
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill={liked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>{likesCount}</span>
          </button>

          <button
            onClick={() => setShowComments(true)}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-blue-500 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>{commentsCount}</span>
          </button>
        </div>

        {/* Recent comment preview */}
        {post.comments?.length > 0 && (
          <div className="px-4 pb-3">
            <button
              onClick={() => setShowComments(true)}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Lihat semua {commentsCount} komentar
            </button>
            <div className="mt-1">
              <p className="text-sm">
                <span className="font-semibold mr-1">{post.comments[0]?.user?.name}</span>
                <span className="text-gray-700">{post.comments[0]?.content}</span>
              </p>
            </div>
          </div>
        )}
      </div>

      {showComments && (
        <CommentsModal
          post={post}
          onClose={() => setShowComments(false)}
        />
      )}
    </>
  )
}
