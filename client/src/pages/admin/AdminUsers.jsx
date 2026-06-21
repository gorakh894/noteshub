import { useState, useEffect } from 'react'
import { Search, Shield, Ban, CheckCircle, ChevronDown } from 'lucide-react'
import { adminService } from '../../services/noteService'
import { formatDate, formatNumber } from '../../utils/helpers'
import { BRANCHES } from '../../utils/constants'
import toast from 'react-hot-toast'

function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ role: '', branch: '', isActive: '' })
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const timer = setTimeout(() => fetchUsers(1), 300)
    return () => clearTimeout(timer)
  }, [search, filters])

  const fetchUsers = async (page = 1) => {
    setLoading(true)
    try {
      const params = { page, limit: 20 }
      if (search) params.search = search
      Object.entries(filters).forEach(([k, v]) => { if (v !== '') params[k] = v })
      const { data } = await adminService.getUsers(params)
      setUsers(data.users)
      setTotal(data.total)
      setTotalPages(data.totalPages)
      setCurrentPage(page)
    } catch {
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (userId, isActive) => {
    try {
      await adminService.updateUser(userId, { isActive: !isActive })
      toast.success(isActive ? 'User blocked' : 'User unblocked')
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, isActive: !isActive } : u))
    } catch {
      toast.error('Failed to update')
    }
  }

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminService.updateUser(userId, { role: newRole })
      toast.success('Role updated')
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u))
    } catch {
      toast.error('Failed to update role')
    }
  }

  const roleBadgeColors = {
    admin: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    coordinator: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    faculty: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    student: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
  }

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="section-title mb-1">User Management</h1>
        <p className="text-gray-500 dark:text-gray-400">{total} registered users</p>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-9 text-sm"
            />
          </div>
          <select value={filters.role} onChange={(e) => setFilters(p => ({ ...p, role: e.target.value }))} className="input text-sm sm:w-36">
            <option value="">All Roles</option>
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
            <option value="coordinator">Coordinator</option>
            <option value="admin">Admin</option>
          </select>
          <select value={filters.branch} onChange={(e) => setFilters(p => ({ ...p, branch: e.target.value }))} className="input text-sm sm:w-36">
            <option value="">All Branches</option>
            {BRANCHES.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
          </select>
          <select value={filters.isActive} onChange={(e) => setFilters(p => ({ ...p, isActive: e.target.value }))} className="input text-sm sm:w-32">
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Blocked</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">User</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400 hidden md:table-cell">Branch/Year</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Role</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400 hidden lg:table-cell">Score</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400 hidden lg:table-cell">Joined</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="border-b border-gray-100 dark:border-gray-800 animate-pulse">
                    {[1,2,3,4,5,6].map(j => (
                      <td key={j} className="px-4 py-3">
                        <div className="skeleton h-4 w-20 rounded" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-gray-500 dark:text-gray-400">No users found</td>
                </tr>
              ) : users.map(user => (
                <tr key={user._id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff&size=32`}
                        alt={user.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-gray-600 dark:text-gray-400">
                      {user.branch || '—'} {user.year && `/ ${user.year}`}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className={`badge ${roleBadgeColors[user.role]} cursor-pointer border-0 outline-none bg-transparent text-xs font-medium capitalize`}
                    >
                      {['student', 'faculty', 'coordinator', 'admin'].map(r => (
                        <option key={r} value={r} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">{r}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-gray-600 dark:text-gray-400">
                    {formatNumber(user.contributionScore || 0)}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-gray-500 dark:text-gray-400 text-xs">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge text-xs ${user.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                      {user.isActive ? '● Active' : '● Blocked'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleActive(user._id, user.isActive)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        user.isActive
                          ? 'text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                          : 'text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                      }`}
                      title={user.isActive ? 'Block user' : 'Unblock user'}
                    >
                      {user.isActive ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t border-gray-100 dark:border-gray-800">
            <button onClick={() => fetchUsers(currentPage - 1)} disabled={currentPage === 1} className="btn-secondary text-sm py-1.5 px-3 disabled:opacity-50">Prev</button>
            <span className="flex items-center px-3 text-sm text-gray-500">Page {currentPage} of {totalPages}</span>
            <button onClick={() => fetchUsers(currentPage + 1)} disabled={currentPage === totalPages} className="btn-secondary text-sm py-1.5 px-3 disabled:opacity-50">Next</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminUsers
