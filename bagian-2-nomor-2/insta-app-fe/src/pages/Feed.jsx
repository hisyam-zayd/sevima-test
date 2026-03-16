import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'
import CreatePost from '../components/CreatePost'
import PostCard from '../components/PostCard'

export default function Feed() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const fetchPosts = useCallback(async () => {
    try {
      const { data } = await api.get('/posts')
      setPosts(data)
    } catch {
      setError('Gagal memuat posts.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const handleLogout = async () => {
    try {
      await api.post('/logout')
    } catch {}
    logout()
    navigate('/login')
  }

  const handlePostCreated = (newPost) => {
    // Refetch to get full post with user data
    fetchPosts()
  }

  const handlePostUpdated = (updatedPost) => {
    setPosts(prev => prev.map(p => p.id === updatedPost.id ? { ...p, ...updatedPost } : p))
  }

  const handlePostDeleted = (postId) => {
    setPosts(prev => prev.filter(p => p.id !== postId))
  }

  const avatar = user?.name?.charAt(0).toUpperCase()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
            </svg>
            <span className="text-xl font-bold tracking-tight">InstaApp</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-semibold">
                {avatar}
              </div>
              <span className="text-sm font-medium hidden sm:block">{user?.name}</span>
            </div>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              title="Keluar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-xl mx-auto px-4 py-6 space-y-4">
        <CreatePost onPostCreated={handlePostCreated} />

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500 text-sm">{error}</p>
            <button onClick={fetchPosts} className="mt-3 text-blue-500 text-sm font-semibold hover:underline">Coba Lagi</button>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">Belum ada post. Jadilah yang pertama berbagi!</p>
          </div>
        ) : (
          posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onUpdated={handlePostUpdated}
              onDeleted={handlePostDeleted}
            />
          ))
        )}
      </main>

      {/* Logout confirmation modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xs p-6 text-center">
            <h3 className="font-semibold text-base mb-2">Keluar dari InstaApp?</h3>
            <p className="text-sm text-gray-500 mb-6">Kamu harus login kembali untuk mengakses feed.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
