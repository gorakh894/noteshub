import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle, XCircle, Loader } from 'lucide-react'
import api from '../../services/api'

function VerifyEmail() {
  const { token } = useParams()
  const [status, setStatus] = useState('loading') // loading | success | error

  useEffect(() => {
    const verify = async () => {
      try {
        await api.get(`/auth/verify-email/${token}`)
        setStatus('success')
      } catch {
        setStatus('error')
      }
    }
    verify()
  }, [token])

  return (
    <div className="text-center">
      {status === 'loading' && (
        <>
          <Loader className="w-12 h-12 text-primary-600 mx-auto mb-4 animate-spin" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Verifying your email...</h2>
        </>
      )}
      {status === 'success' && (
        <>
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Email Verified! 🎉</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Your email has been verified successfully.</p>
          <Link to="/dashboard" className="btn-primary px-8 py-2.5">Go to Dashboard</Link>
        </>
      )}
      {status === 'error' && (
        <>
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Verification Failed</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">The link is invalid or has expired.</p>
          <Link to="/login" className="btn-primary px-8 py-2.5">Go to Login</Link>
        </>
      )}
    </div>
  )
}

export default VerifyEmail
