import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Send, Users, BookOpen, LogOut, ChevronLeft } from 'lucide-react'
import { io } from 'socket.io-client'
import { groupService } from '../services/noteService'
import { formatRelativeTime } from '../utils/helpers'
import useAuthStore from '../store/authStore'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

function GroupDetail() {
  const { id } = useParams()
  const { user, token } = useAuthStore()
  const navigate = useNavigate()
  const [group, setGroup] = useState(null)
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState([])
  const [messageInput, setMessageInput] = useState('')
  const [socket, setSocket] = useState(null)
  const [typingUsers, setTypingUsers] = useState([])
  const [activeTab, setActiveTab] = useState('chat')
  const messagesEndRef = useRef(null)
  const typingTimeout = useRef(null)

  useEffect(() => {
    fetchGroup()
    const socketInstance = initSocket()
    return () => socketInstance?.disconnect()
  }, [id])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchGroup = async () => {
    try {
      const { data } = await groupService.getGroup(id)
      setGroup(data.group)
      setMessages(data.group.messages?.slice(-50) || [])
    } catch {
      navigate('/study-groups')
    } finally {
      setLoading(false)
    }
  }

  const initSocket = () => {
    const socketInstance = io(import.meta.env.VITE_SOCKET_URL || '', {
      auth: { token }
    })

    socketInstance.on('connect', () => {
      socketInstance.emit('join_group', id)
    })

    socketInstance.on('new_message', ({ message }) => {
      setMessages(prev => [...prev, message])
    })

    socketInstance.on('user_typing', ({ user: typingUser }) => {
      setTypingUsers(prev => {
        if (!prev.find(u => u._id === typingUser._id)) return [...prev, typingUser]
        return prev
      })
    })

    socketInstance.on('user_stop_typing', ({ userId }) => {
      setTypingUsers(prev => prev.filter(u => u._id !== userId))
    })

    setSocket(socketInstance)
    return socketInstance
  }

  const handleSend = (e) => {
    e.preventDefault()
    if (!messageInput.trim() || !socket) return

    socket.emit('group_message', { groupId: id, content: messageInput.trim() })
    socket.emit('stop_typing', { groupId: id })
    setMessageInput('')
  }

  const handleTyping = (e) => {
    setMessageInput(e.target.value)
    if (socket) {
      socket.emit('typing', { groupId: id })
      clearTimeout(typingTimeout.current)
      typingTimeout.current = setTimeout(() => {
        socket.emit('stop_typing', { groupId: id })
      }, 2000)
    }
  }

  const handleLeave = async () => {
    if (!confirm('Leave this group?')) return
    try {
      await groupService.leaveGroup(id)
      toast.success('Left group')
      navigate('/study-groups')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to leave')
    }
  }

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
  if (!group) return null

  const isMember = group.members?.some(m => m.user?._id === user?._id)

  return (
    <div className="page-container max-w-5xl">
      <button onClick={() => navigate('/study-groups')} className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-sm mb-4 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back to Groups
      </button>

      {/* Group Header */}
      <div className="card mb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center text-3xl shadow-md">
              {group.avatar || '📚'}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">{group.name}</h1>
              {group.description && <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{group.description}</p>}
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                {group.subject && <span className="badge bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 text-xs">{group.subject}</span>}
                {group.branch && <span className="badge bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 text-xs">{group.branch}</span>}
                <span className="flex items-center gap-1 text-xs text-gray-500"><Users className="w-3.5 h-3.5" /> {group.members?.length} members</span>
              </div>
            </div>
          </div>
          {isMember && group.creator?._id !== user?._id && (
            <button onClick={handleLeave} className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 flex-shrink-0">
              <LogOut className="w-4 h-4" /> Leave
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
        {[{ id: 'chat', icon: Send, label: 'Chat' }, { id: 'resources', icon: BookOpen, label: 'Resources' }, { id: 'members', icon: Users, label: 'Members' }].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-white dark:bg-gray-900 text-primary-600 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'}`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Chat Tab */}
      {activeTab === 'chat' && (
        <div className="card flex flex-col" style={{ height: '60vh' }}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-3 p-2">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-600">
                <Send className="w-8 h-8 mb-2" />
                <p className="text-sm">No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((msg, i) => {
                const isOwn = msg.sender?._id === user?._id
                return (
                  <div key={msg._id || i} className={`flex gap-2.5 ${isOwn ? 'flex-row-reverse' : ''}`}>
                    <img
                      src={msg.sender?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.sender?.name || 'U')}&background=6366f1&color=fff&size=32`}
                      alt={msg.sender?.name}
                      className="w-7 h-7 rounded-full flex-shrink-0 mt-0.5"
                    />
                    <div className={`max-w-[70%] ${isOwn ? 'items-end' : ''}`}>
                      {!isOwn && <p className="text-xs text-gray-500 mb-0.5">{msg.sender?.name}</p>}
                      <div className={`px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${
                        isOwn
                          ? 'bg-primary-600 text-white rounded-tr-sm'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-tl-sm'
                      }`}>
                        {msg.content}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{formatRelativeTime(msg.createdAt)}</p>
                    </div>
                  </div>
                )
              })
            )}
            {typingUsers.filter(u => u._id !== user?._id).length > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex gap-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-sm">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          {isMember ? (
            <form onSubmit={handleSend} className="flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
              <input
                value={messageInput}
                onChange={handleTyping}
                placeholder="Type a message..."
                className="input flex-1 text-sm"
              />
              <button type="submit" disabled={!messageInput.trim()} className="btn-primary p-2.5 aspect-square disabled:opacity-50">
                <Send className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="text-center pt-3 border-t border-gray-100 dark:border-gray-800">
              <p className="text-sm text-gray-500">Join group to send messages</p>
            </div>
          )}
        </div>
      )}

      {/* Resources Tab */}
      {activeTab === 'resources' && (
        <div className="card">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Shared Resources</h3>
          {group.sharedResources?.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <BookOpen className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">No resources shared yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {group.sharedResources?.map((res, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <BookOpen className="w-5 h-5 text-primary-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{res.note?.title}</p>
                    <p className="text-xs text-gray-400">Shared by {res.sharedBy?.name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Members Tab */}
      {activeTab === 'members' && (
        <div className="card">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            Members ({group.members?.length})
          </h3>
          <div className="space-y-3">
            {group.members?.map((member, i) => (
              <div key={i} className="flex items-center gap-3">
                <img
                  src={member.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.user?.name || 'U')}&background=6366f1&color=fff&size=40`}
                  alt={member.user?.name}
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{member.user?.name}</p>
                  <p className="text-xs text-gray-400">{member.user?.branch} • {member.user?.year}</p>
                </div>
                {member.role === 'admin' && (
                  <span className="badge bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 text-xs">Admin</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default GroupDetail
