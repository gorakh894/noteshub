import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react'
import api from '../../services/api'
import toast from 'react-hot-toast'

function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      await api.post(`/auth/reset-password/${token}`, { password: form.password })
      setSuccess(true)
      toast.success('Password reset successfully!')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset link expired')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Password Reset!</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-4">Redirecting to login...</p>
        <Link to="/login" className="text-primary-600 hover:underline">Go to Login</Link>
      </div>
    )
  }

  return (
    <div>
      <div className="text-center mb-7">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reset Password</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Enter your new password</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">New Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type={showPassword ? 'text' : 'password'} required placeholder="Min. 6 characters" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} className="input pl-9 pr-10" minLength={6} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div>
          <label className="label">Confirm New Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type={showPassword ? 'text' : 'password'} required placeholder="Repeat password" value={form.confirmPassword} onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))} className="input pl-9" />
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 disabled:opacity-50">
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  )
}

export default ResetPassword
