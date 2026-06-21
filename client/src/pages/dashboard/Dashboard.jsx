import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Upload, BookOpen, Download, Bookmark, Star, Trophy,
  AlertCircle, CheckCircle, Clock, ArrowRight, Bell
} from 'lucide-react'
import useAuthStore from '../../store/authStore'
import { noteService } from '../../services/noteService'
import { formatRelativeTime } from '../../utils/helpers'
import NoteCard from '../../components/ui/NoteCard'
import NoteCardSkeleton from '../../components/ui/NoteCardSkeleton'

function Dashboard() {
  const { user } = useAuthStore()
  const [recentNotes, setRecentNotes] = useState([])
  const [pendingNotes, setPendingNotes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [recent, pending] = await Promise.all([
        noteService.getMyNotes({ limit: 3, status: 'approved' }),
        noteService.getMyNotes({ limit: 3, status: 'pending' })
      ])
      setRecentNotes(recent?.data?.notes || [])
      setPendingNotes(pending?.data?.notes || [])
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      setRecentNotes([])
      setPendingNotes([])
    } finally {
      setLoading(false)
    }
  }

  const quickLinks = [
    { to: '/dashboard/upload', icon: Upload, label: 'Upload Notes', color: 'bg-primary-600', textColor: 'text-white' },
    { to: '/browse', icon: BookOpen, label: 'Browse Notes', color: 'bg-blue-50 dark:bg-blue-900/20', textColor: 'text-blue-600 dark:text-blue-400' },
    { to: '/dashboard/bookmarks', icon: Bookmark, label: 'My Bookmarks', color: 'bg-amber-50 dark:bg-amber-900/20', textColor: 'text-amber-600 dark:text-amber-400' },
    { to: '/dashboard/downloads', icon: Download, label: 'My Downloads', color: 'bg-green-50 dark:bg-green-900/20', textColor: 'text-green-600 dark:text-green-400' },
  ]

  return (
    <div className="page-container">
      {/* Welcome Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {user?.branch ? `${user.branch} • ${user.year}` : 'Complete your profile to get started'}
          </p>
        </div>
        <Link to="/dashboard/profile" className="btn-secondary text-sm">
          Edit Profile
        </Link>
      </div>

      {/* Email verification banner */}
      {!user?.isEmailVerified && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl mb-6">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-800 dark:text-amber-300 flex-1">
            Please verify your email address to unlock all features.
          </p>
          <button className="text-sm text-amber-700 dark:text-amber-400 font-medium hover:underline">Resend</button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Upload, label: 'Uploads', value: user?.uploadCount || 0, color: 'text-primary-600' },
          { icon: Download, label: 'Downloads', value: user?.downloadCount || 0, color: 'text-green-600' },
          { icon: Trophy, label: 'Score', value: user?.contributionScore || 0, color: 'text-amber-500' },
          { icon: Star, label: 'Badges', value: user?.badges?.length || 0, color: 'text-purple-600' },
        ].map((stat, i) => (
          <div key={i} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {quickLinks.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`flex items-center gap-3 p-4 rounded-xl ${link.color} ${link.textColor} hover:shadow-md transition-all`}
          >
            <link.icon className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{link.label}</span>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Recent Uploads */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">Recent Uploads</h2>
            <Link to="/dashboard/uploads" className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array(2).fill(0).map((_, i) => <NoteCardSkeleton key={i} />)}
            </div>
          ) : recentNotes.length === 0 ? (
            <div className="card text-center py-8">
              <Upload className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">No uploads yet</p>
              <Link to="/dashboard/upload" className="text-sm text-primary-600 hover:underline mt-2 block">
                Upload your first note
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentNotes.map(note => <NoteCard key={note._id} note={note} />)}
            </div>
          )}
        </div>

        {/* Pending Approvals & Badges */}
        <div className="space-y-6">
          {/* Pending */}
          {pendingNotes.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-gray-900 dark:text-white">Pending Review</h2>
                <span className="badge bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">{pendingNotes.length}</span>
              </div>
              <div className="space-y-2">
                {pendingNotes.map(note => (
                  <div key={note._id} className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{note.title}</p>
                      <p className="text-xs text-gray-400">{note.subject} • {formatRelativeTime(note.createdAt)}</p>
                    </div>
                    <span className="badge bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-xs">Pending</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Badges */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-900 dark:text-white">My Badges</h2>
            </div>
            {user?.badges?.length === 0 ? (
              <div className="card text-center py-6">
                <Trophy className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">Upload notes to earn badges</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {(user?.badges || []).map((badge, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg">
                    <span className="text-lg">{badge.icon}</span>
                    <span className="text-sm font-medium text-primary-700 dark:text-primary-400">{badge.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Profile completion */}
          {(!user?.branch || !user?.college) && (
            <div className="card bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-5">
              <h3 className="font-semibold mb-2">Complete Your Profile</h3>
              <p className="text-white/80 text-sm mb-3">Add your branch, college, and bio to connect with peers</p>
              <Link to="/dashboard/profile" className="inline-flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-sm px-3 py-1.5 rounded-lg transition-colors">
                Complete Profile <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
