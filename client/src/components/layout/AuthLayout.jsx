import { Outlet, Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'

function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 relative overflow-hidden items-center justify-center p-12">
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />

        <div className="relative z-10 text-white max-w-md">
          <Link to="/" className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold">EngiNotes Hub</span>
          </Link>

          <h2 className="text-4xl font-bold mb-4 leading-tight">
            Your Engineering Study Companion
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Access thousands of notes, question papers, and study resources shared by engineering students across India.
          </p>

          <div className="space-y-4">
            {[
              { icon: '📚', text: '10,000+ Study Notes & Resources' },
              { icon: '📋', text: '5,000+ Previous Year Papers' },
              { icon: '👥', text: '50,000+ Engineering Students' },
              { icon: '🏆', text: 'Gamified Learning Experience' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-white/90">
                <span className="text-xl">{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-950">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">EngiNotes Hub</span>
            </Link>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
