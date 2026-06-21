import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft } from 'lucide-react'
import api from '../../services/api'
import toast from 'react-hot-toast'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/auth/forgot-password', { email })
      setSent(true)
      toast.success('Password reset email sent!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Check your email</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          We sent a password reset link to <strong>{email}</strong>
        </p>
        <Link to="/login" className="text-primary-600 hover:underline flex items-center justify-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to login
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="text-center mb-7">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Forgot your password?</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Enter your email and we'll send you a reset link</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input pl-9"
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 disabled:opacity-50">
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      <Link to="/login" className="flex items-center justify-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mt-5 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to login
      </Link>
    </div>
  )
}

export default ForgotPassword
