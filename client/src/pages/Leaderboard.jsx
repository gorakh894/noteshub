import { useState, useEffect } from 'react'
import { Trophy, Upload, Download, Star, Award } from 'lucide-react'
import { userService } from '../services/noteService'
import { formatNumber, getBranchColor } from '../utils/helpers'

function Leaderboard() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      const { data } = await userService.getLeaderboard()
      setUsers(data.users)
    } catch {
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const medals = { 0: '🥇', 1: '🥈', 2: '🥉' }

  return (
    <div className="page-container max-w-3xl">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <h1 className="section-title mb-2">Leaderboard</h1>
        <p className="text-gray-500 dark:text-gray-400">Top contributors helping the engineering community</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array(10).fill(0).map((_, i) => (
            <div key={i} className="card animate-pulse flex items-center gap-4">
              <div className="skeleton w-8 h-8 rounded-full" />
              <div className="skeleton w-10 h-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-40 rounded" />
                <div className="skeleton h-3 w-24 rounded" />
              </div>
              <div className="skeleton h-6 w-16 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((user, i) => (
            <div
              key={user._id}
              className={`card flex items-center gap-4 ${i < 3 ? 'border-primary-200 dark:border-primary-800 bg-gradient-to-r from-primary-50/50 to-transparent dark:from-primary-900/10' : ''}`}
            >
              {/* Rank */}
              <div className="w-8 text-center flex-shrink-0">
                {medals[i] ? (
                  <span className="text-2xl">{medals[i]}</span>
                ) : (
                  <span className="text-lg font-bold text-gray-400">#{i + 1}</span>
                )}
              </div>

              {/* Avatar */}
              <img
                src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff&size=40`}
                alt={user.name}
                className={`w-11 h-11 rounded-xl object-cover flex-shrink-0 ${i < 3 ? 'ring-2 ring-primary-400' : ''}`}
              />

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
                  {user.branch && (
                    <span className={`badge text-xs ${getBranchColor(user.branch)}`}>{user.branch}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  <span className="flex items-center gap-1"><Upload className="w-3 h-3" /> {user.uploadCount || 0}</span>
                  <span className="flex items-center gap-1"><Download className="w-3 h-3" /> {user.downloadCount || 0}</span>
                  {user.badges?.length > 0 && (
                    <span className="flex items-center gap-1">
                      <Award className="w-3 h-3 text-amber-500" /> {user.badges.length} badges
                    </span>
                  )}
                </div>
              </div>

              {/* Score */}
              <div className="text-right flex-shrink-0">
                <div className={`text-lg font-bold ${i === 0 ? 'text-amber-500' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-orange-500' : 'text-primary-600 dark:text-primary-400'}`}>
                  {formatNumber(user.contributionScore)}
                </div>
                <div className="text-xs text-gray-400">points</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* How points work */}
      <div className="mt-8 card bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border-primary-200 dark:border-primary-800">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">How to Earn Points</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {[
            { action: 'Upload a Note', points: '+10 pts' },
            { action: 'Note Gets Approved', points: '+15 pts' },
            { action: 'Upload PYQ Paper', points: '+15 pts' },
            { action: 'Upload Solution', points: '+20 pts' },
            { action: 'Start Discussion', points: '+5 pts' },
            { action: 'Post Answer', points: '+3 pts' },
            { action: 'Note Downloaded', points: '+1 pt' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-2 bg-white/60 dark:bg-gray-800/40 rounded-lg">
              <span className="text-gray-700 dark:text-gray-300">{item.action}</span>
              <span className="font-semibold text-primary-600 dark:text-primary-400">{item.points}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Leaderboard
