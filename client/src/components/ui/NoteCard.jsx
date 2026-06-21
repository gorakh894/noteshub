import { Link } from 'react-router-dom'
import { Download, Star, Bookmark, BookmarkCheck, Eye, FileText, Award } from 'lucide-react'
import { formatRelativeTime, formatNumber, getBranchColor } from '../../utils/helpers'
import { FILE_TYPE_ICONS, FILE_TYPE_COLORS } from '../../utils/constants'
import useAuthStore from '../../store/authStore'
import { noteService } from '../../services/noteService'
import { useState } from 'react'
import toast from 'react-hot-toast'

function NoteCard({ note, onBookmarkChange }) {
  const { isAuthenticated, user } = useAuthStore()
  const [isBookmarked, setIsBookmarked] = useState(user?.bookmarks?.includes(note._id))
  const [loading, setLoading] = useState(false)

  const handleBookmark = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast.error('Please login to bookmark notes')
      return
    }
    setLoading(true)
    try {
      const { data } = await noteService.bookmarkNote(note._id)
      setIsBookmarked(data.isBookmarked)
      toast.success(data.message)
      onBookmarkChange?.()
    } catch {
      toast.error('Failed to bookmark')
    } finally {
      setLoading(false)
    }
  }

  const fileTypeColor = FILE_TYPE_COLORS[note.fileType] || 'file-pdf'
  const fileTypeIcon = FILE_TYPE_ICONS[note.fileType] || '📎'

  return (
    <Link to={`/notes/${note._id}`} className="group block">
      <div className="card hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-200 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className={`badge ${fileTypeColor} uppercase`}>
              {fileTypeIcon} {note.fileType || 'pdf'}
            </span>
            {note.isExamImportant && (
              <span className="badge bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                <Award className="w-3 h-3" /> Exam
              </span>
            )}
          </div>
          <button
            onClick={handleBookmark}
            disabled={loading}
            className="p-1 rounded-lg text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
          >
            {isBookmarked
              ? <BookmarkCheck className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              : <Bookmark className="w-4 h-4" />
            }
          </button>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
          {note.title}
        </h3>

        {/* Subject & Branch */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">{note.subject}</span>
          <span className="text-gray-300 dark:text-gray-600">•</span>
          <span className={`badge text-xs ${getBranchColor(note.branch)}`}>{note.branch}</span>
        </div>

        {/* Description */}
        {note.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 flex-1">
            {note.description}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-3 flex-wrap">
          <span>Sem {note.semester}</span>
          <span>•</span>
          <span>{note.year}</span>
          {note.unit && <><span>•</span><span>Unit {note.unit}</span></>}
          <span>•</span>
          <span>{note.category}</span>
        </div>

        {/* Stats & Author */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Download className="w-3.5 h-3.5" />
              {formatNumber(note.downloadCount)}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {formatNumber(note.viewCount)}
            </span>
            {note.averageRating > 0 && (
              <span className="flex items-center gap-1 text-amber-500">
                <Star className="w-3.5 h-3.5 fill-current" />
                {note.averageRating.toFixed(1)}
              </span>
            )}
          </div>

          {note.author && (
            <div className="flex items-center gap-1.5">
              <img
                src={note.author.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(note.author.name)}&background=6366f1&color=fff&size=32`}
                alt={note.author.name}
                className="w-5 h-5 rounded-full object-cover"
              />
              <span className="text-xs text-gray-500 dark:text-gray-400 max-w-[80px] truncate">
                {note.author.name}
              </span>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          {formatRelativeTime(note.createdAt)}
        </p>
      </div>
    </Link>
  )
}

export default NoteCard
