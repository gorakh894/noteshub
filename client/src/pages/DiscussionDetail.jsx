import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ThumbsUp, ThumbsDown, CheckCircle, MessageCircle, Eye, ChevronLeft, Send, Award } from 'lucide-react'
import { discussionService } from '../services/noteService'
import { formatRelativeTime, getBranchColor } from '../utils/helpers'
import useAuthStore from '../store/authStore'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

function DiscussionDetail() {
  const { id } = useParams()
  const { isAuthenticated, user } = useAuthStore()
  const navigate = useNavigate()
  const [discussion, setDiscussion] = useState(null)
  const [loading, setLoading] = useState(true)
  const [answerContent, setAnswerContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [upvoted, setUpvoted] = useState(false)

  useEffect(() => {
    fetchDiscussion()
  }, [id])

  const fetchDiscussion = async () => {
    try {
      const { data } = await discussionService.getDiscussion(id)
      setDiscussion(data.discussion)
      setUpvoted(data.discussion.upvotes?.includes(user?._id))
    } catch {
      navigate('/discussions')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitAnswer = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) { toast.error('Please login'); return }
    if (!answerContent.trim()) { toast.error('Write your answer'); return }

    setSubmitting(true)
    try {
      const { data } = await discussionService.addAnswer(id, { content: answerContent })
      setDiscussion(prev => ({
        ...prev,
        answers: [...(prev.answers || []), data.answer]
      }))
      setAnswerContent('')
      toast.success('Answer posted!')
    } catch {
      toast.error('Failed to post answer')
    } finally {
      setSubmitting(false)
    }
  }

  const handleVoteAnswer = async (answerId, vote) => {
    if (!isAuthenticated) { toast.error('Please login'); return }
    try {
      const { data } = await discussionService.voteAnswer(id, answerId, vote)
      setDiscussion(prev => ({
        ...prev,
        answers: prev.answers.map(a =>
          a._id === answerId ? { ...a, upvotes: Array(data.upvotes).fill(''), downvotes: Array(data.downvotes).fill('') } : a
        )
      }))
    } catch {
      toast.error('Vote failed')
    }
  }

  const handleVoteDiscussion = async () => {
    if (!isAuthenticated) { toast.error('Please login'); return }
    try {
      const { data } = await discussionService.voteDiscussion(id)
      setUpvoted(data.hasVoted)
      setDiscussion(prev => ({ ...prev, upvotes: Array(data.upvotes).fill('') }))
    } catch { }
  }

  const handleAccept = async (answerId) => {
    try {
      await discussionService.acceptAnswer(id, answerId)
      setDiscussion(prev => ({
        ...prev,
        isResolved: true,
        answers: prev.answers.map(a => ({ ...a, isAccepted: a._id === answerId }))
      }))
      toast.success('Answer accepted!')
    } catch { }
  }

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
  if (!discussion) return null

  const isAuthor = user?._id === discussion.author?._id

  return (
    <div className="page-container max-w-4xl">
      <button onClick={() => navigate('/discussions')} className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-sm mb-6 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back to Discussions
      </button>

      {/* Question */}
      <div className="card mb-6">
        <div className="flex gap-4">
          {/* Vote Column */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={handleVoteDiscussion}
              className={`p-2 rounded-lg transition-colors ${upvoted ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'text-gray-400 hover:text-primary-600 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              <ThumbsUp className="w-5 h-5" />
            </button>
            <span className="font-semibold text-gray-700 dark:text-gray-300">{discussion.upvotes?.length || 0}</span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span className="badge bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">{discussion.category}</span>
              {discussion.branch && <span className={`badge ${getBranchColor(discussion.branch)}`}>{discussion.branch}</span>}
              {discussion.isResolved && (
                <span className="badge bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  <CheckCircle className="w-3 h-3" /> Resolved
                </span>
              )}
              {discussion.subject && <span className="badge bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">{discussion.subject}</span>}
            </div>

            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{discussion.title}</h1>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap mb-4 leading-relaxed">{discussion.content}</p>

            {discussion.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {discussion.tags.map(tag => (
                  <span key={tag} className="badge bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 text-xs">#{tag}</span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between flex-wrap gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {discussion.views}</span>
                <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4" /> {discussion.answers?.length} answers</span>
              </div>
              <div className="flex items-center gap-2">
                <img
                  src={discussion.author?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(discussion.author?.name || 'U')}&background=6366f1&color=fff&size=32`}
                  alt={discussion.author?.name}
                  className="w-7 h-7 rounded-full"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{discussion.author?.name}</span>
                  <span className="text-xs text-gray-400 ml-1">• {formatRelativeTime(discussion.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Answers */}
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {discussion.answers?.length} Answer{discussion.answers?.length !== 1 ? 's' : ''}
      </h2>

      {discussion.answers?.length === 0 ? (
        <div className="card text-center py-10 mb-6">
          <MessageCircle className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No answers yet. Be the first to help!</p>
        </div>
      ) : (
        <div className="space-y-4 mb-6">
          {[...discussion.answers]
            .sort((a, b) => b.isAccepted - a.isAccepted || (b.upvotes?.length - b.downvotes?.length) - (a.upvotes?.length - a.downvotes?.length))
            .map(answer => (
              <div
                key={answer._id}
                className={`card ${answer.isAccepted ? 'border-green-400 dark:border-green-600 bg-green-50/50 dark:bg-green-900/10' : ''}`}
              >
                <div className="flex gap-4">
                  {/* Vote Column */}
                  <div className="flex flex-col items-center gap-1">
                    <button
                      onClick={() => handleVoteAnswer(answer._id, 'up')}
                      className="p-1.5 rounded text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </button>
                    <span className={`text-sm font-semibold ${(answer.upvotes?.length - answer.downvotes?.length) > 0 ? 'text-green-600' : 'text-gray-500'}`}>
                      {(answer.upvotes?.length || 0) - (answer.downvotes?.length || 0)}
                    </span>
                    <button
                      onClick={() => handleVoteAnswer(answer._id, 'down')}
                      className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <ThumbsDown className="w-4 h-4" />
                    </button>
                    {answer.isAccepted && (
                      <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {answer.isAccepted && (
                      <div className="badge bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 mb-2">
                        <Award className="w-3 h-3" /> Accepted Answer
                      </div>
                    )}
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap mb-3 leading-relaxed">{answer.content}</p>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={answer.author?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(answer.author?.name || 'U')}&background=6366f1&color=fff&size=28`}
                          alt={answer.author?.name}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {answer.author?.name} • {formatRelativeTime(answer.createdAt)}
                        </span>
                      </div>
                      {isAuthor && !discussion.isResolved && (
                        <button
                          onClick={() => handleAccept(answer._id)}
                          className="text-sm text-green-600 hover:text-green-700 dark:hover:text-green-400 flex items-center gap-1"
                        >
                          <CheckCircle className="w-4 h-4" /> Accept
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      )}

      {/* Answer Form */}
      {isAuthenticated ? (
        <div className="card">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Your Answer</h3>
          <form onSubmit={handleSubmitAnswer}>
            <textarea
              value={answerContent}
              onChange={(e) => setAnswerContent(e.target.value)}
              placeholder="Write your answer here... Be clear and helpful!"
              rows={5}
              className="input mb-3 resize-none"
              required
            />
            <button
              type="submit"
              disabled={submitting || !answerContent.trim()}
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {submitting ? 'Posting...' : 'Post Answer'}
            </button>
          </form>
        </div>
      ) : (
        <div className="card text-center py-8">
          <p className="text-gray-500 dark:text-gray-400 mb-3">Login to post an answer</p>
          <Link to="/login" className="btn-primary">Login</Link>
        </div>
      )}
    </div>
  )
}

export default DiscussionDetail
