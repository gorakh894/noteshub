import { useState, useEffect } from 'react'
import { Bookmark } from 'lucide-react'
import { userService } from '../../services/noteService'
import NoteCard from '../../components/ui/NoteCard'
import NoteCardSkeleton from '../../components/ui/NoteCardSkeleton'

function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookmarks()
  }, [])

  const fetchBookmarks = async () => {
    setLoading(true)
    try {
      const { data } = await userService.getBookmarks()
      setBookmarks(data.bookmarks)
    } catch {
      setBookmarks([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="section-title mb-1">My Bookmarks</h1>
        <p className="text-gray-500 dark:text-gray-400">
          {loading ? 'Loading...' : `${bookmarks.length} saved notes`}
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => <NoteCardSkeleton key={i} />)}
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="text-center py-16">
          <Bookmark className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No bookmarks yet</h3>
          <p className="text-gray-500 dark:text-gray-400">Save notes you want to come back to</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookmarks.map(note => (
            <NoteCard key={note._id} note={note} onBookmarkChange={fetchBookmarks} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Bookmarks
