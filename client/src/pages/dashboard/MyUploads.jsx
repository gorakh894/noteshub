import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Upload, Edit, Trash2, Eye, Download, Clock, CheckCircle, XCircle, Plus } from 'lucide-react'
import { noteService } from '../../services/noteService'
import { formatDate, formatNumber } from '../../utils/helpers'
import { FILE_TYPE_ICONS, FILE_TYPE_COLORS } from '../../utils/constants'
import toast from 'react-hot-toast'

function MyUploads() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [total, setTotal] = useState(0)

  useEffect(() => {
    fetchNotes()
  }, [filter])

  const fetchNotes = async () => {
    setLoading(true)
    try {
      const params = { limit: 20 }
      if (filter) params.status = filter
      const { data } = await noteService.getMyNotes(params)
      setNotes(data.notes)
      setTotal(data.total)
    } catch {
      setNotes([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (noteId, title) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    try {
      await noteService.deleteNote(noteId)
      toast.success('Note deleted')
      fetchNotes()
    } catch {
      toast.error('Failed to delete note')
    }
  }

  const statusBadge = {
    approved: <span className="flex items-center gap-1 badge bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs"><CheckCircle className="w-3 h-3" /> Approved</span>,
    pending: <span className="flex items-center gap-1 badge bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-xs"><Clock className="w-3 h-3" /> Pending</span>,
    rejected: <span className="flex items-center gap-1 badge bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs"><XCircle className="w-3 h-3" /> Rejected</span>,
  }

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="section-title mb-1">My Uploads</h1>
          <p className="text-gray-500 dark:text-gray-400">{total} notes uploaded</p>
        </div>
        <Link to="/dashboard/upload" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Upload New
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {[{ value: '', label: 'All' }, { value: 'approved', label: 'Approved' }, { value: 'pending', label: 'Pending' }, { value: 'rejected', label: 'Rejected' }].map(tab => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === tab.value
                ? 'bg-primary-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="card animate-pulse flex gap-4">
              <div className="skeleton w-10 h-10 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-3/4 rounded" />
                <div className="skeleton h-3 w-1/2 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : notes.length === 0 ? (
        <div className="text-center py-16">
          <Upload className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No uploads yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">Start contributing to the community!</p>
          <Link to="/dashboard/upload" className="btn-primary">Upload Your First Note</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map(note => (
            <div key={note._id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0 ${FILE_TYPE_COLORS[note.fileType] || 'file-pdf'}`}>
                  {FILE_TYPE_ICONS[note.fileType] || '📎'}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/notes/${note._id}`}
                        className="font-medium text-gray-900 dark:text-white hover:text-primary-600 transition-colors truncate block"
                      >
                        {note.title}
                      </Link>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        {note.subject} • {note.branch} • Sem {note.semester}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      {statusBadge[note.status]}
                    </div>
                  </div>

                  {note.status === 'rejected' && note.rejectionReason && (
                    <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg text-xs text-red-700 dark:text-red-400">
                      <strong>Reason:</strong> {note.rejectionReason}
                    </div>
                  )}

                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400 dark:text-gray-500">
                    <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {formatNumber(note.viewCount)}</span>
                    <span className="flex items-center gap-1"><Download className="w-3.5 h-3.5" /> {formatNumber(note.downloadCount)}</span>
                    <span>Uploaded {formatDate(note.createdAt)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <Link
                    to={`/notes/${note._id}`}
                    className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                    title="View"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(note._id, note.title)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyUploads
