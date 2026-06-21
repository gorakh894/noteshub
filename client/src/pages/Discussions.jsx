import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MessageCircle, Plus, Search, Eye, ThumbsUp, CheckCircle, Filter } from 'lucide-react'
import { discussionService } from '../services/noteService'
import { formatRelativeTime, getBranchColor } from '../utils/helpers'
import { BRANCHES, DISCUSSION_CATEGORIES } from '../utils/constants'
import useAuthStore from '../store/authStore'

function Discussions() {
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const [discussions, setDiscussions] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState({ branch: '', category: '', search: '', sort: 'newest' })
  const [searchInput, setSearchInput] = useState('')

  useEffect(() => {
    fetchDiscussions(1)
  }, [filters])

  const fetchDiscussions = async (page = 1) => {
    setLoading(true)
    try {
      const params = { page, limit: 15 }
      Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v })
      const { data } = await discussionService.getDiscussions(params)
      setDiscussions(data.discussions)
      setTotal(data.total)
      setTotalPages(data.totalPages)
      setCurrentPage(page)
    } catch {
      setDiscussions([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setFilters(prev => ({ ...prev, search: searchInput }))
  }

  const categoryColors = {
    Question: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    Discussion: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    Help: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    Resource: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    Announcement: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  }

  return (
    <div className="page-container max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="section-title mb-1">Discussions</h1>
          <p className="text-gray-500 dark:text-gray-400">{total} discussions • Ask questions, share solutions</p>
        </div>
        <button
          onClick={() => isAuthenticated ? navigate('/discussions/new') : navigate('/login')}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Discussion</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              placeholder="Search discussions..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="input pl-9 text-sm"
            />
          </form>
          <select
            value={filters.branch}
            onChange={(e) => setFilters(p => ({ ...p, branch: e.target.value }))}
            className="input text-sm sm:w-40"
          >
            <option value="">All Branches</option>
            {BRANCHES.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
          </select>
          <select
            value={filters.category}
            onChange={(e) => setFilters(p => ({ ...p, category: e.target.value }))}
            className="input text-sm sm:w-40"
          >
            <option value="">All Types</option>
            {DISCUSSION_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={filters.sort}
            onChange={(e) => setFilters(p => ({ ...p, sort: e.target.value }))}
            className="input text-sm sm:w-36"
          >
            <option value="newest">Newest</option>
            <option value="most_views">Most Viewed</option>
            <option value="trending">Trending</option>
          </select>
        </div>
      </div>

      {/* Discussions List */}
      {loading ? (
        <div className="space-y-3">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="flex gap-4">
                <div className="skeleton w-10 h-10 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-5 w-3/4 rounded" />
                  <div className="skeleton h-4 w-full rounded" />
                  <div className="skeleton h-4 w-1/2 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : discussions.length === 0 ? (
        <div className="text-center py-16">
          <MessageCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No discussions found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">Be the first to start a discussion!</p>
          {isAuthenticated && (
            <button onClick={() => navigate('/discussions/new')} className="btn-primary">
              Start Discussion
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {discussions.map(discussion => (
            <Link
              key={discussion._id}
              to={`/discussions/${discussion._id}`}
              className="card hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700 transition-all block group"
            >
              <div className="flex gap-4">
                <img
                  src={discussion.author?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(discussion.author?.name || 'U')}&background=6366f1&color=fff&size=40`}
                  alt={discussion.author?.name}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      {discussion.isPinned && <span className="text-xs">📌</span>}
                      {discussion.isResolved && (
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      )}
                      <span className={`badge text-xs ${categoryColors[discussion.category] || ''}`}>
                        {discussion.category}
                      </span>
                      {discussion.branch && (
                        <span className={`badge text-xs ${getBranchColor(discussion.branch)}`}>
                          {discussion.branch}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">
                      {formatRelativeTime(discussion.createdAt)}
                    </span>
                  </div>

                  <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1 mb-1">
                    {discussion.title}
                  </h3>

                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mb-2">
                    {discussion.content}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5" />
                      {discussion.answerCount || 0} answers
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {discussion.views || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      {discussion.upvotes?.length || 0}
                    </span>
                    <span>by <strong>{discussion.author?.name}</strong></span>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-4">
              <button onClick={() => fetchDiscussions(currentPage - 1)} disabled={currentPage === 1} className="btn-secondary text-sm py-1.5 px-3 disabled:opacity-50">Prev</button>
              <span className="flex items-center px-3 text-sm text-gray-500">Page {currentPage} of {totalPages}</span>
              <button onClick={() => fetchDiscussions(currentPage + 1)} disabled={currentPage === totalPages} className="btn-secondary text-sm py-1.5 px-3 disabled:opacity-50">Next</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Discussions
