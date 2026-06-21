import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, UserPlus } from 'lucide-react'
import useAuthStore from '../../store/authStore'
import { BRANCHES, YEARS, SEMESTERS } from '../../utils/constants'
import toast from 'react-hot-toast'

function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    branch: '', year: '', semester: '', college: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const { register: registerUser, isLoading, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true })
  }, [isAuthenticated])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    const { confirmPassword, ...userData } = form
    const result = await registerUser(userData)
    if (result.success) {
      toast.success(result.message || 'Registration successful!')
      navigate('/dashboard', { replace: true })
    } else {
      toast.error(result.message)
    }
  }

  return (
    <div>
      <div className="text-center mb-7">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create your account</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Join thousands of engineering students</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Full Name *</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              required
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              className="input pl-9"
            />
          </div>
        </div>

        <div>
          <label className="label">Email Address *</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              required
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              className="input pl-9"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Branch</label>
            <select value={form.branch} onChange={e => setForm(p => ({ ...p, branch: e.target.value }))} className="input text-sm">
              <option value="">Select Branch</option>
              {BRANCHES.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Year</label>
            <select value={form.year} onChange={e => setForm(p => ({ ...p, year: e.target.value }))} className="input text-sm">
              <option value="">Select Year</option>
              {YEARS.map(y => <option key={y.value} value={y.value}>{y.label}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="label">College</label>
          <input
            type="text"
            placeholder="e.g., COEP Technological University"
            value={form.college}
            onChange={e => setForm(p => ({ ...p, college: e.target.value }))}
            className="input text-sm"
          />
        </div>

        <div>
          <label className="label">Password *</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              required
              type={showPassword ? 'text' : 'password'}
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              className="input pl-9 pr-10"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="label">Confirm Password *</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              required
              type={showPassword ? 'text' : 'password'}
              placeholder="Repeat your password"
              value={form.confirmPassword}
              onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
              className="input pl-9"
            />
          </div>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400">
          By registering, you agree to our{' '}
          <a href="#" className="text-primary-600 hover:underline">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-primary-600 hover:underline">Privacy Policy</a>.
        </p>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full py-2.5 flex items-center justify-center gap-2 text-base disabled:opacity-50"
        >
          {isLoading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <><UserPlus className="w-5 h-5" /> Create Account</>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">Sign in</Link>
      </p>
    </div>
  )
}

export default Register
