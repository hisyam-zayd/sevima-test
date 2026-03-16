import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'

export default function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    try {
      const { data } = await api.post('/register', form)
      login(data.user, data.token)
      navigate('/')
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors)
      } else {
        setErrors({ general: err.response?.data?.message || 'Registrasi gagal.' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
            <circle cx="12" cy="12" r="4"/>
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
          </svg>
          <h1 className="text-3xl font-bold tracking-tight">InstaApp</h1>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          <p className="text-center text-gray-500 text-sm font-semibold mb-4">
            Daftar untuk melihat foto dari teman-temanmu (kalau punya).
          </p>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <input
                type="text"
                name="name"
                placeholder="Nama lengkap"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>}
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>}
            </div>
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password (min. 6 karakter)"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password[0]}</p>}
            </div>
            {errors.general && <p className="text-red-500 text-xs text-center">{errors.general}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white font-semibold py-2 rounded-md text-sm transition-colors"
            >
              {loading ? 'Mendaftar...' : 'Daftar'}
            </button>
          </form>
        </div>

        <div className="mt-4 text-center bg-white border border-gray-200 rounded-xl p-4 shadow-sm text-sm">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-blue-500 font-semibold hover:underline">
            Masuk
          </Link>
        </div>
      </div>
    </div>
  )
}
