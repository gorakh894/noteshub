import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Users, BookOpen, Download, FileText, TrendingUp,
  CheckCircle, Clock, AlertCircle, Award
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import { adminService } from '../../services/noteService'
import { formatNumber, formatDate } from '../../utils/helpers'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6']

function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const { data: d } = await adminService.getStats()
      setData(d)
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>

  const { stats, recentUsers, topNotes, topContributors, charts } = data || {}

  const statCards = [
    { icon: Users, label: 'Total Users', value: formatNumber(stats?.totalUsers), color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { icon: BookOpen, label: 'Total Notes', value: formatNumber(stats?.totalNotes), color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { icon: Download, label: 'Total Downloads', value: formatNumber(stats?.totalDownloads), color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
    { icon: FileText, label: 'PYQ Papers', value: formatNumber(stats?.totalPapers), color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
    { icon: Clock, label: 'Pending Notes', value: stats?.pendingNotes, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    { icon: CheckCircle, label: 'Approved Notes', value: formatNumber(stats?.approvedNotes), color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  ]

  // Format monthly signups for chart
  const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const signupData = charts?.monthlySignups?.map(d => ({
    month: monthNames[d._id.month],
    users: d.count
  })) || []

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="section-title mb-1">Admin Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">Platform overview and analytics</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/notes" className="btn-secondary text-sm flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            Review Notes
            {stats?.pendingNotes > 0 && (
              <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{stats.pendingNotes}</span>
            )}
          </Link>
          <Link to="/admin/users" className="btn-secondary text-sm">Manage Users</Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {statCards.map((card, i) => (
          <div key={i} className="card p-4">
            <div className={`w-9 h-9 ${card.bg} rounded-lg flex items-center justify-center mb-3`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">{card.value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Signups Chart */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Monthly User Signups</h2>
          {signupData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={signupData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="users" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400">
              <TrendingUp className="w-8 h-8 mr-2" /> No data yet
            </div>
          )}
        </div>

        {/* Notes by Branch Pie Chart */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Notes by Branch</h2>
          {charts?.notesByBranch?.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={charts.notesByBranch}
                  dataKey="count"
                  nameKey="_id"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ _id, percent }) => `${_id} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {charts.notesByBranch.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400">No data yet</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Notes */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Top Downloaded Notes</h2>
          {topNotes?.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">No approved notes yet</p>
          ) : (
            <div className="space-y-3">
              {topNotes?.map((note, i) => (
                <Link to={`/notes/${note._id}`} key={note._id} className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors">
                  <span className="w-6 text-sm font-bold text-gray-400">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{note.title}</p>
                    <p className="text-xs text-gray-400">{note.subject} • {note.author?.name}</p>
                  </div>
                  <span className="text-sm text-green-600 flex items-center gap-1 flex-shrink-0">
                    <Download className="w-3.5 h-3.5" /> {formatNumber(note.downloadCount)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Top Contributors */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">Top Contributors</h2>
            <Link to="/leaderboard" className="text-xs text-primary-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {topContributors?.map((contributor, i) => (
              <div key={contributor._id} className="flex items-center gap-3">
                <span className="w-6 text-sm font-bold text-gray-400">#{i + 1}</span>
                <img
                  src={contributor.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(contributor.name)}&background=6366f1&color=fff&size=32`}
                  alt={contributor.name}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{contributor.name}</p>
                  <p className="text-xs text-gray-400">{contributor.branch} • {contributor.uploadCount} uploads</p>
                </div>
                <span className="text-sm font-semibold text-primary-600">{formatNumber(contributor.contributionScore)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
