import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Users, Plus, Lock, Globe, Search, MessageCircle } from 'lucide-react'
import { groupService } from '../services/noteService'
import { getBranchColor } from '../utils/helpers'
import { BRANCHES } from '../utils/constants'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'

function StudyGroups() {
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ branch: '', search: '' })
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    fetchGroups()
  }, [filters])

  const fetchGroups = async () => {
    setLoading(true)
    try {
      const params = {}
      Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v })
      const { data } = await groupService.getGroups(params)
      setGroups(data.groups)
    } catch {
      setGroups([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="section-title mb-1">Study Groups</h1>
          <p className="text-gray-500 dark:text-gray-400">Collaborate with fellow students</p>
        </div>
        <button
          onClick={() => isAuthenticated ? setShowCreateModal(true) : navigate('/login')}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create Group
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            placeholder="Search groups..."
            value={filters.search}
            onChange={(e) => setFilters(p => ({ ...p, search: e.target.value }))}
            className="input pl-9 text-sm"
          />
        </div>
        <select
          value={filters.branch}
          onChange={(e) => setFilters(p => ({ ...p, branch: e.target.value }))}
          className="input text-sm w-40"
        >
          <option value="">All Branches</option>
          {BRANCHES.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
        </select>
      </div>

      {/* Groups Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="flex items-center gap-3 mb-3">
                <div className="skeleton w-12 h-12 rounded-xl flex-shrink-0" />
                <div className="flex-1">
                  <div className="skeleton h-4 w-3/4 mb-1.5 rounded" />
                  <div className="skeleton h-3 w-1/2 rounded" />
                </div>
              </div>
              <div className="skeleton h-3 w-full mb-1.5 rounded" />
              <div className="skeleton h-3 w-2/3 rounded" />
            </div>
          ))}
        </div>
      ) : groups.length === 0 ? (
        <div className="text-center py-16">
          <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No groups found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">Create the first study group!</p>
          {isAuthenticated && (
            <button onClick={() => setShowCreateModal(true)} className="btn-primary">Create Group</button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map(group => (
            <GroupCard key={group._id} group={group} onRefresh={fetchGroups} />
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <CreateGroupModal onClose={() => setShowCreateModal(false)} onCreated={() => { setShowCreateModal(false); fetchGroups() }} />
      )}
    </div>
  )
}

function GroupCard({ group, onRefresh }) {
  const { isAuthenticated, user } = useAuthStore()
  const navigate = useNavigate()
  const [joining, setJoining] = useState(false)

  const isMember = group.members?.some(m => m.user?._id === user?._id)

  const handleJoin = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) { navigate('/login'); return }
    if (isMember) { navigate(`/study-groups/${group._id}`); return }
    setJoining(true)
    try {
      await groupService.joinGroup(group._id, {})
      toast.success('Joined group!')
      onRefresh()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to join')
    } finally {
      setJoining(false)
    }
  }

  return (
    <Link to={`/study-groups/${group._id}`} className="card hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700 transition-all block group">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
          {group.avatar || '📚'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors text-sm truncate">
              {group.name}
            </h3>
            {group.isPrivate
              ? <Lock className="w-3 h-3 text-gray-400 flex-shrink-0" />
              : <Globe className="w-3 h-3 text-green-500 flex-shrink-0" />
            }
          </div>
          {group.subject && (
            <p className="text-xs text-primary-600 dark:text-primary-400 font-medium">{group.subject}</p>
          )}
        </div>
      </div>

      {group.description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">{group.description}</p>
      )}

      <div className="flex items-center gap-2 flex-wrap mb-3">
        {group.branch && (
          <span className={`badge text-xs ${getBranchColor(group.branch)}`}>{group.branch}</span>
        )}
        {group.semester && (
          <span className="badge bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 text-xs">Sem {group.semester}</span>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
          <Users className="w-4 h-4" />
          <span>{group.members?.length || 0}/{group.maxMembers}</span>
        </div>
        <button
          onClick={handleJoin}
          disabled={joining}
          className={`text-sm py-1 px-3 rounded-lg font-medium transition-colors ${
            isMember
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'btn-primary py-1 px-3'
          }`}
        >
          {joining ? 'Joining...' : isMember ? '✓ Member' : 'Join'}
        </button>
      </div>
    </Link>
  )
}

function CreateGroupModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    name: '', description: '', subject: '', branch: '',
    semester: '', isPrivate: false, maxMembers: 50
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await groupService.createGroup(form)
      toast.success('Study group created!')
      onCreated()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create group')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Create Study Group</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="label">Group Name *</label>
            <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g., DBMS Study Circle" className="input" />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} placeholder="What's this group about?" className="input resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Subject</label>
              <input value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} placeholder="e.g., DBMS" className="input" />
            </div>
            <div>
              <label className="label">Branch</label>
              <select value={form.branch} onChange={e => setForm(p => ({ ...p, branch: e.target.value }))} className="input">
                <option value="">Any</option>
                {BRANCHES.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
              </select>
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isPrivate} onChange={e => setForm(p => ({ ...p, isPrivate: e.target.checked }))} className="w-4 h-4 text-primary-600 rounded border-gray-300" />
            <div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Private Group</span>
              <p className="text-xs text-gray-400">Require invite code to join</p>
            </div>
          </label>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 disabled:opacity-50">
              {loading ? 'Creating...' : 'Create Group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default StudyGroups
