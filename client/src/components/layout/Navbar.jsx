import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  BookOpen, Search, Sun, Moon, Bell, Menu, X,
  Upload, User, LogOut, Settings, LayoutDashboard,
  ChevronDown, Shield
} from 'lucide-react'
import useAuthStore from '../../store/authStore'
import useThemeStore from '../../store/themeStore'
import NotificationDropdown from '../notifications/NotificationDropdown'

function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore()
  const { isDark, toggleTheme } = useThemeStore()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [search, setSearch] = useState('')
  const userMenuRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/browse?search=${encodeURIComponent(search.trim())}`)
      setSearch('')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
    setUserMenuOpen(false)
  }

  const navLinks = [
    { to: '/browse', label: 'Browse Notes' },
    { to: '/question-papers', label: 'PYQ Papers' },
    { to: '/discussions', label: 'Discussions' },
    { to: '/study-groups', label: 'Study Groups' },
    { to: '/leaderboard', label: 'Leaderboard' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-md">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900 dark:text-white hidden sm:block">
              EngiNotes<span className="text-primary-600"> Hub</span>
            </span>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md hidden md:flex">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search notes, subjects, topics..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 border border-transparent dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-gray-700 transition-all"
              />
            </div>
          </form>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20 dark:text-primary-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setNotifOpen(!notifOpen)}
                    className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                  </button>
                  {notifOpen && <NotificationDropdown onClose={() => setNotifOpen(false)} />}
                </div>

                {/* Upload Button */}
                <Link
                  to="/dashboard/upload"
                  className="hidden sm:flex items-center gap-1.5 btn-primary text-sm py-1.5 px-3"
                >
                  <Upload className="w-4 h-4" />
                  Upload
                </Link>

                {/* User Menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <img
                      src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=6366f1&color=fff`}
                      alt={user?.name}
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg py-2 animate-slide-in">
                      <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                        <p className="font-medium text-gray-900 dark:text-white text-sm">{user?.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                      </div>

                      {[
                        { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
                        { to: '/dashboard/profile', icon: User, label: 'Profile' },
                        ...((['admin', 'coordinator'].includes(user?.role)) ? [{ to: '/admin', icon: Shield, label: 'Admin Panel' }] : []),
                      ].map(item => (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <item.icon className="w-4 h-4" />
                          {item.label}
                        </Link>
                      ))}

                      <div className="border-t border-gray-100 dark:border-gray-800 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-secondary text-sm py-1.5 px-3">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-1.5 px-3">Sign Up</Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3 space-y-1">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="mb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm input"
              />
            </div>
          </form>
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'text-gray-700 dark:text-gray-300'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          {isAuthenticated && (
            <Link
              to="/dashboard/upload"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-primary-600 dark:text-primary-400"
            >
              <Upload className="w-4 h-4" />
              Upload Notes
            </Link>
          )}
        </div>
      )}
    </header>
  )
}

export default Navbar
