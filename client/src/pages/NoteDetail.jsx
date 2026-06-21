import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  Download, Star, Bookmark, BookmarkCheck, Eye, FileText,
  User, Calendar, Award, ChevronLeft, ExternalLink, Share2,
  MessageCircle, ThumbsUp
} from 'lucide-react'
import { noteService } from '../services/noteService'
import { formatDate, formatNumber, getBranchColor, formatFileSize, downloadFile } from '../utils/helpers'
import { FILE_TYPE_ICONS, FILE_TYPE_COLORS } from '../utils/constants'
import useAuthStore from '../store/authStore'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

function NoteDetail() {
  const { id } = useParams()
  const { isAuthenticated, user } = useAuthStore()
  const navigate = useNavigate()
  const [note, setNote] = useState(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [review, setReview] = useState('')
  const [ratingSubmitting, setRatingSubmitting] = useState(false)

  useEffect(() => {
    fetchNote()
  }, [id])

  const fetchNote = async () => {
    try {
      const { data } = await noteService.getNoteById(id)
      setNote(data.note)
      setIsBookmarked(user?.bookmarks?.includes(id) || false)
      if (user) {
        const existingRating = data.note.ratings?.find(r => r.user?._id === user._id)
        if (existingRating) setUserRating(existingRating.rating)
      }
    } catch (err) {
      if (err.response?.status === 404) {
        navigate('/browse')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    if (downloading) return
    setDownloading(true)
    try {
      const { data } = await noteService.downloadNote(id)
      
      // Use fileType from response, or extract from URL as fallback
      const fileExtension = data.fileType || data.fileUrl.split('.').pop().split('?')[0]
      const filename = note.title.includes('.') ? note.title : `${note.title}.${fileExtension}`
      
      await downloadFile(data.fileUrl, filename)
      setNote(prev => ({ ...prev, downloadCount: prev.downloadCount + 1 }))
      toast.success('Download started!')
    } catch {
      toast.error('Download failed')
    } finally {
      setDownloading(false)
    }
  }

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to bookmark')
      return
    }
    try {
      const { data } = await noteService.bookmarkNote(id)
      setIsBookmarked(data.isBookmarked)
      toast.success(data.message)
    } catch {
      toast.error('Failed to bookmark')
    }
  }

  const handleRating = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to rate')
      return
    }
    if (!userRating) {
      toast.error('Please select a rating')
      return
    }
    setRatingSubmitting(true)
    try {
      const { data } = await noteService.rateNote(id, { rating: userRating, review })
      setNote(prev => ({ ...prev, averageRating: data.averageRating, ratingCount: data.ratingCount }))
      toast.success('Rating submitted!')
    } catch {
      toast.error('Failed to submit rating')
    } finally {
      setRatingSubmitting(false)
    }
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    } catch {
      toast.error('Failed to copy link')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!note) return null

  const fileTypeColor = FILE_TYPE_COLORS[note.fileType] || 'file-pdf'
  const fileTypeIcon = FILE_TYPE_ICONS[note.fileType] || '📎'

  return (
    <div className="page-container max-w-5xl">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-sm mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to notes
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Note Header Card */}
          <div className="card">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`badge ${fileTypeColor} uppercase`}>
                  {fileTypeIcon} {note.fileType}
                </span>
                {note.isExamImportant && (
                  <span className="badge bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                    <Award className="w-3 h-3" /> Exam Important
                  </span>
                )}
                <span className={`badge ${getBranchColor(note.branch)}`}>{note.branch}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleShare}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  title="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleBookmark}
                  className="p-2 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  title="Bookmark"
                >
                  {isBookmarked
                    ? <BookmarkCheck className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    : <Bookmark className="w-4 h-4" />
                  }
                </button>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{note.title}</h1>

            {note.description && (
              <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">{note.description}</p>
            )}

            {/* Meta Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg mb-4">
              {[
                { label: 'Subject', value: note.subject },
                { label: 'Branch', value: note.branch },
                { label: 'Year', value: note.year },
                { label: 'Semester', value: `Semester ${note.semester}` },
                { label: 'Category', value: note.category },
                ...(note.unit ? [{ label: 'Unit', value: note.unit }] : []),
                ...(note.faculty ? [{ label: 'Faculty', value: note.faculty }] : []),
                ...(note.university ? [{ label: 'University', value: note.university }] : []),
              ].map((item, i) => (
                <div key={i}>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{item.label}</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Tags */}
            {note.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {note.tags.map(tag => (
                  <Link
                    key={tag}
                    to={`/browse?search=${tag}`}
                    className="badge bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-primary-50 hover:text-primary-700 dark:hover:bg-primary-900/30 dark:hover:text-primary-400 transition-colors cursor-pointer"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Download, value: formatNumber(note.downloadCount), label: 'Downloads', color: 'text-green-600' },
              { icon: Eye, value: formatNumber(note.viewCount), label: 'Views', color: 'text-blue-600' },
              { icon: Star, value: note.averageRating ? note.averageRating.toFixed(1) : '—', label: `${note.ratingCount} ratings`, color: 'text-amber-500' },
            ].map((stat, i) => (
              <div key={i} className="card text-center p-4">
                <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
                <div className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Rating Section */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Rate This Note</h3>
            <div className="flex gap-2 mb-3">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setUserRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="text-3xl transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-7 h-7 transition-colors ${
                      star <= (hoverRating || userRating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                </button>
              ))}
            </div>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Write a review (optional)..."
              rows={2}
              className="input text-sm mb-3"
            />
            <button
              onClick={handleRating}
              disabled={ratingSubmitting || !userRating}
              className="btn-primary text-sm disabled:opacity-50"
            >
              {ratingSubmitting ? 'Submitting...' : 'Submit Rating'}
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Download Card */}
          <div className="card sticky top-20">
            <div className="text-center mb-4">
              <div className={`text-5xl mb-2`}>{fileTypeIcon}</div>
              <p className="font-medium text-gray-900 dark:text-white">{note.title}</p>
              {note.fileSize && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {formatFileSize(note.fileSize)}
                </p>
              )}
            </div>

            <button
              onClick={handleDownload}
              disabled={downloading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-base"
            >
              {downloading ? (
                <>Loading...</>
              ) : (
                <><Download className="w-5 h-5" /> Download</>
              )}
            </button>

            <a
              href={note.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary w-full flex items-center justify-center gap-2 mt-2 py-2.5"
            >
              <ExternalLink className="w-4 h-4" /> Preview
            </a>
          </div>

          {/* Author Card */}
          {note.author && (
            <div className="card">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">Uploaded By</h3>
              <Link to={`/users/${note.author._id}`} className="flex items-center gap-3 group">
                <img
                  src={note.author.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(note.author.name)}&background=6366f1&color=fff&size=48`}
                  alt={note.author.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors text-sm">
                    {note.author.name}
                  </p>
                  {note.author.branch && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {note.author.branch} • {note.author.year}
                    </p>
                  )}
                </div>
              </Link>
              <div className="flex gap-3 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                <div className="text-center">
                  <div className="text-sm font-bold text-gray-900 dark:text-white">
                    {formatNumber(note.author.contributionScore || 0)}
                  </div>
                  <div className="text-xs text-gray-400">Score</div>
                </div>
                {note.author.badges?.length > 0 && (
                  <div className="text-center">
                    <div className="text-sm font-bold text-gray-900 dark:text-white">
                      {note.author.badges.length}
                    </div>
                    <div className="text-xs text-gray-400">Badges</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Upload Date */}
          <div className="card p-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              Uploaded {formatDate(note.createdAt)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NoteDetail
