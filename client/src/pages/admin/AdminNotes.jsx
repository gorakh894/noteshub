import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle, XCircle, Eye, Trash2, ExternalLink, Star } from 'lucide-react'
import { adminService } from '../../services/noteService'
import { formatDate } from '../../utils/helpers'
import { FILE_TYPE_ICONS } from '../../utils/constants'
import toast from 'react-hot-toast'

function AdminNotes() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [rejectModal, setRejectModal] = useState(null)
  const [rejectReason, setRejectReason] = useState('')

  useEffect(() => {
    fetchPendingNotes()
  }, [])

  const fetchPendingNotes = async () => {
    setLoading(true)
    try {
      const { data } = await adminService.getPendingNotes({ limit: 20 })
      setNotes(data.notes)
      setTotal(data.total)
    } catch {
      setNotes([])
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (noteId) => {
    try {
      await adminService.approveNote(noteId)
      toast.success('Note approved!')
      setNotes(prev => prev.filter(n => n._id !== noteId))
    } catch {
      toast.error('Failed to approve')
    }
  }

  const handleReject = async () => {
    if (!rejectReason.trim()) { toast.error('Please provide a reason'); return }
    try {
      await adminService.rejectNote(rejectModal, rejectReason)
      toast.success('Note rejected')
      setNotes(prev => prev.filter(n => n._id !== rejectModal))
      setRejectModal(null)
      setRejectReason('')
    } catch {
      toast.error('Failed to reject')
    }
  }

  const handleDelete = async (noteId) => {
    if (!confirm('Permanently delete this note?')) return
    try {
      await adminService.deleteNote(noteId)
      toast.success('Note deleted')
      setNotes(prev => prev.filter(n => n._id !== noteId))
    } catch {
      toast.error('Failed to delete')
    }
  }

  const handleFeature = async (noteId) => {
    try {
      const { data } = await adminService.featureNote(noteId)
      toast.success(data.isFeatured ? 'Note featured!' : 'Note unfeatured')
      fetchPendingNotes()
    } catch {
      toast.error('Failed')
    }
  }

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="section-title mb-1">Note Moderation</h1>
        <p className="text-gray-500 dark:text-gray-400">{total} pending for review</p>
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
              <div className="flex gap-2">
                <div className="skeleton h-8 w-20 rounded-lg" />
                <div className="skeleton h-8 w-20 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : notes.length === 0 ? (
        <div className="card text-center py-12">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">All caught up!</h3>
          <p className="text-gray-500 dark:text-gray-400">No pending notes to review.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map(note => (
            <div key={note._id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xl flex-shrink-0">
                  {FILE_TYPE_ICONS[note.fileType] || '📎'}
                </div>

                <div className="flex-1 min-w-0">
                  <Link
                    to={`/notes/${note._id}`}
                    className="font-medium text-gray-900 dark:text-white hover:text-primary-600 transition-colors"
                  >
                    {note.title}
                  </Link>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    {note.subject} • {note.branch} • Sem {note.semester} • {note.category}
                  </p>
                  {note.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{note.description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1.5">
                      <img
                        src={note.author?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(note.author?.name || 'U')}&background=6366f1&color=fff&size=24`}
                        alt={note.author?.name}
                        className="w-5 h-5 rounded-full"
                      />
                      <span className="text-xs text-gray-500">{note.author?.name}</span>
                    </div>
                    <span className="text-xs text-gray-400">{formatDate(note.createdAt)}</span>
                    {note.tags?.length > 0 && (
                      <span className="text-xs text-gray-400 truncate max-w-40">
                        #{note.tags.slice(0, 3).join(' #')}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
                  <a
                    href={note.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                    title="Preview file"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => handleApprove(note._id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button
                    onClick={() => setRejectModal(note._id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 text-sm rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Reject
                  </button>
                  <button
                    onClick={() => handleDelete(note._id)}
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

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md shadow-2xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Reject Note</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Provide a reason for rejection (the author will be notified):</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              placeholder="e.g., Content is not clear, wrong category, duplicate..."
              className="input mb-4 resize-none"
            />
            <div className="flex gap-3">
              <button onClick={() => { setRejectModal(null); setRejectReason('') }} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleReject} className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors">
                Reject Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminNotes
