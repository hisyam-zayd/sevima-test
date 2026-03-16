import { useState, useRef } from 'react'
import api from '../api'
import { useAuth } from '../context/AuthContext'

export default function CreatePost({ onPostCreated }) {
  const { user } = useAuth()
  const [content, setContent] = useState('')
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef()

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      setError('Ukuran gambar maksimal 2 MB.')
      fileRef.current.value = ''
      return
    }
    setError('')
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const removeImage = () => {
    setImage(null)
    setPreview(null)
    fileRef.current.value = ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim()) return
    setLoading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('content', content)
      if (image) formData.append('image', image)
      const { data } = await api.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      onPostCreated(data)
      setContent('')
      setImage(null)
      setPreview(null)
      if (fileRef.current) fileRef.current.value = ''
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal membuat post.')
    } finally {
      setLoading(false)
    }
  }

  const avatar = user?.name?.charAt(0).toUpperCase()

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <div className="flex gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
          {avatar}
        </div>
        <form onSubmit={handleSubmit} className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Bagikan momen kamu..."
            rows={preview ? 2 : 3}
            maxLength={1000}
            className="w-full resize-none border-none outline-none text-sm bg-transparent placeholder-gray-400"
          />
          {preview && (
            <div className="relative mt-2 mb-2 max-w-xs">
              <img src={preview} alt="preview" className="rounded-lg object-cover max-h-48 w-full" />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-black/70"
              >
                ✕
              </button>
            </div>
          )}
          {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fileRef.current.click()}
                className="text-gray-400 hover:text-blue-500 transition-colors"
                title="Upload foto"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 18h16.5a2.25 2.25 0 002.25-2.25V7.5a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 7.5v8.25A2.25 2.25 0 003.75 18z" />
                </svg>
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400">{content.length}/1000</span>
              <button
                type="submit"
                disabled={loading || !content.trim()}
                className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-semibold px-4 py-1.5 rounded-full transition-colors"
              >
                {loading ? 'Posting...' : 'Bagikan'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
