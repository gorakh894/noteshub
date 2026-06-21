import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Bell, Check, CheckCheck, X } from 'lucide-react'
import { notificationService } from '../../services/noteService'
import { formatRelativeTime } from '../../utils/helpers'

function NotificationDropdown({ onClose }) {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const ref = useRef(null)

  useEffect(() => {
    fetchNotifications()

    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const fetchNotifications = async () => {
    try {
      const { data } = await notificationService.getNotifications({ limit: 10 })
      setNotifications(data.notifications)
      setUnreadCount(data.unreadCount)
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  const markAllRead = async () => {
    await notificationService.markAllAsRead()
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    setUnreadCount(0)
  }

  const typeIcons = {
    note_approved: '✅',
    note_rejected: '❌',
    badge_earned: '🏆',
    follow: '👤',
    answer: '💬',
    upvote: '👍',
    group_message: '👥',
    system: '🔔',
  }

  return (
    <div
      ref={ref}
      className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden animate-slide-in"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-primary-600" />
          <span className="font-semibold text-gray-900 dark:text-white">Notifications</span>
          {unreadCount > 0 && (
            <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-xs text-primary-600 hover:underline flex items-center gap-1">
              <CheckCheck className="w-3 h-3" /> All read
            </button>
          )}
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto">
        {loading ? (
          <div className="p-4 space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="skeleton w-8 h-8 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="skeleton h-3.5 w-full rounded" />
                  <div className="skeleton h-3 w-2/3 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">No notifications yet</p>
          </div>
        ) : (
          notifications.map(notif => (
            <div
              key={notif._id}
              className={`flex gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-50 dark:border-gray-800/50 ${
                !notif.isRead ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''
              }`}
            >
              <div className="text-xl flex-shrink-0 mt-0.5">
                {typeIcons[notif.type] || '🔔'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight">
                  {notif.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                  {notif.message}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {formatRelativeTime(notif.createdAt)}
                </p>
              </div>
              {!notif.isRead && (
                <div className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0 mt-2" />
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 dark:border-gray-800 px-4 py-2.5">
        <Link
          to="/dashboard"
          onClick={onClose}
          className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
        >
          View all notifications →
        </Link>
      </div>
    </div>
  )
}

export default NotificationDropdown
