import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, Grid, List, SlidersHorizontal } from 'lucide-react'
import { noteService } from '../services/noteService'
import NoteCard from '../components/ui/NoteCard'
import NoteCardSkeleton from '../components/ui/NoteCardSkeleton'
import FilterPanel from '../components/ui/FilterPanel'

function BrowseNotes() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(true)

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    branch: searchParams.get('branch') || '',
    year: searchParams.get('year') || '',
    semester: searchParams.get('semester') || '',
    category: searchParams.get('category') || '',
    sort: searchParams.get('sort') || 'newest',
    examImportant: searchParams.get('examImportant') || '',
  })

  const [searchInput, setSearchInput] = useState(filters.search)

  const fetchNotes = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const params = { page, limit: 12 }
      Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v })

      const { data } = await noteService.getNotes(params)
      setNotes(data.notes)
      setTotal(data.total)
      setTotalPages(data.totalPages)
      setCurrentPage(page)
    } catch {
      setNotes([])
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchNotes(1)
    // Sync to URL
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v) })
    setSearchParams(params, { replace: true })
  }, [filters])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setFilters(prev => ({ ...prev, search: searchInput }))
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="mb-6">
        <h1 className="section-title mb-1">Browse Notes</h1>
        <p className="text-gray-500 dark:text-gray-400">
          {loading ? 'Loading...' : `${total} notes found`}
        </p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Filters */}
        {showFilters && (
          <aside className="w-64 flex-shrink-0 hidden md:block">
            <FilterPanel filters={filters} onChange={setFilters} />
          </aside>
        )}

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Search + Controls */}
          <div className="flex gap-3 mb-4">
            <form onSubmit={handleSearchSubmit} className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search notes, subjects, topics..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="input pl-9 text-sm"
              />
            </form>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary text-sm flex items-center gap-1.5 flex-shrink-0 md:hidden"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Filters */}
          {!showFilters && (
            <div className="mb-4 md:hidden">
              <FilterPanel filters={filters} onChange={setFilters} />
            </div>
          )}

          {/* Active Filters Tags */}
          {(filters.branch || filters.year || filters.semester || filters.category) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {filters.branch && (
                <span className="badge bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
                  {filters.branch}
                  <button onClick={() => setFilters(p => ({ ...p, branch: '' }))} className="ml-1 hover:text-red-500">×</button>
                </span>
              )}
              {filters.year && (
                <span className="badge bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
                  {filters.year}
                  <button onClick={() => setFilters(p => ({ ...p, year: '' }))} className="ml-1 hover:text-red-500">×</button>
                </span>
              )}
              {filters.semester && (
                <span className="badge bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
                  Sem {filters.semester}
                  <button onClick={() => setFilters(p => ({ ...p, semester: '' }))} className="ml-1 hover:text-red-500">×</button>
                </span>
              )}
              {filters.category && (
                <span className="badge bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
                  {filters.category}
                  <button onClick={() => setFilters(p => ({ ...p, category: '' }))} className="ml-1 hover:text-red-500">×</button>
                </span>
              )}
            </div>
          )}

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array(6).fill(0).map((_, i) => <NoteCardSkeleton key={i} />)}
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">📂</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No notes found</h3>
              <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {notes.map(note => <NoteCard key={note._id} note={note} onBookmarkChange={() => {}} />)}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => fetchNotes(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="btn-secondary text-sm py-1.5 px-3 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let page = i + 1
                      if (totalPages > 5 && currentPage > 3) page = currentPage - 2 + i
                      if (page > totalPages) return null
                      return (
                        <button
                          key={page}
                          onClick={() => fetchNotes(page)}
                          className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                            page === currentPage
                              ? 'bg-primary-600 text-white'
                              : 'btn-secondary'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    })}
                  </div>
                  <button
                    onClick={() => fetchNotes(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="btn-secondary text-sm py-1.5 px-3 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default BrowseNotes
