import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react'
import useAuthStore from '../../store/authStore'
import toast from 'react-hot-toast'

function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading, isAuthenticated, googleLogin } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/dashboard'

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true })
  }, [isAuthenticated])

  // Load Google Sign-In script (temporarily disabled - configure Google OAuth first)
  useEffect(() => {
    // Uncomment below when you have valid Google OAuth credentials
    /*
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    document.body.appendChild(script)

    script.onload = () => {
      if (window.google && import.meta.env.VITE_GOOGLE_CLIENT_ID) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        })
        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-btn'),
          { theme: 'outline', size: 'large', width: '100%', text: 'signin_with' }
        )
      }
    }
    return () => document.body.removeChild(script)
    */
  }, [])

  const handleGoogleResponse = async (response) => {
    const result = await googleLogin(response.credential)
    if (result.success) {
      toast.success('Welcome back!')
      navigate(from, { replace: true })
    } else {
      toast.error(result.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await login(form)
    if (result.success) {
      toast.success('Welcome back!')
      navigate(from, { replace: true })
    } else {
      toast.error(result.message)
    }
  }

  return (
    <div>
      <div className="text-center mb-7">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Sign in to access your notes</p>
      </div>

      {/* Google Sign-In - Temporarily disabled */}
      {/* <div id="google-signin-btn" className="flex justify-center mb-5" /> */}

      {/* Uncomment the divider below when Google Sign-In is enabled */}
      {/*
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
        <span className="text-xs text-gray-400 dark:text-gray-500 px-2">or continue with email</span>
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
      </div>
      */}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              className="input pl-9"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="label mb-0">Password</label>
            <Link to="/forgot-password" className="text-xs text-primary-600 dark:text-primary-400 hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              className="input pl-9 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full py-2.5 flex items-center justify-center gap-2 text-base disabled:opacity-50"
        >
          {isLoading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <><LogIn className="w-5 h-5" /> Sign In</>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
        Don't have an account?{' '}
        <Link to="/register" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
          Sign up free
        </Link>
      </p>
    </div>
  )
}

export default Login
