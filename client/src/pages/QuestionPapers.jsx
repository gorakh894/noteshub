import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Download, FileText, Search, ChevronDown, ExternalLink } from 'lucide-react'
import { paperService } from '../services/noteService'
import { BRANCHES, SEMESTERS, YEARS } from '../utils/constants'
import { formatDate, formatNumber, downloadFile } from '../utils/helpers'
import toast from 'react-hot-toast'

function QuestionPapers() {
  const [searchParams] = useSearchParams()
  const [papers, setPapers] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [grouped, setGrouped] = useState({})
  const [filters, setFilters] = useState({
    branch: searchParams.get('branch') || '',
    semester: searchParams.get('semester') || '',
    year: searchParams.get('year') || '',
    search: '',
    examYear: '',
  })

  useEffect(() => {
    fetchPapers()
  }, [filters])

  const fetchPapers = async () => {
    setLoading(true)
    try {
      const params = {}
      Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v })
      const { data } = await paperService.getPapers(params)
      setPapers(data.papers)
      setGrouped(data.grouped)
      setTotal(data.total)
    } catch {
      setPapers([])
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (paper) => {
    try {
      const { data } = await paperService.downloadPaper(paper._id)
      
      // Use fileType from response, or extract from URL as fallback
      const fileExtension = data.fileType || data.fileUrl.split('.').pop().split('?')[0]
      const filename = `${data.subject || paper.subject}_${data.year || paper.year}_${data.semester || paper.semester || 'Paper'}.${fileExtension}`
      
      await downloadFile(data.fileUrl, filename)
      toast.success('Download started!')
    } catch {
      toast.error('Download failed')
    }
  }

  // Generate years array (last 10 years)
  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i)

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="section-title mb-2">Previous Year Question Papers</h1>
        <p className="text-gray-500 dark:text-gray-400">
          {total} question papers from top universities — SPPU, Mumbai University, and more
        </p>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search subject..."
              value={filters.search}
              onChange={(e) => setFilters(p => ({ ...p, search: e.target.value }))}
              className="input pl-9 text-sm"
            />
          </div>

          <select
            value={filters.branch}
            onChange={(e) => setFilters(p => ({ ...p, branch: e.target.value }))}
            className="input text-sm"
          >
            <option value="">All Branches</option>
            {BRANCHES.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
          </select>

          <select
            value={filters.semester}
            onChange={(e) => setFilters(p => ({ ...p, semester: e.target.value }))}
            className="input text-sm"
          >
            <option value="">All Semesters</option>
            {SEMESTERS.map(s => <option key={s} value={s}>Sem {s}</option>)}
          </select>

          <select
            value={filters.examYear}
            onChange={(e) => setFilters(p => ({ ...p, examYear: e.target.value }))}
            className="input text-sm"
          >
            <option value="">Any Year</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {/* Papers */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="skeleton h-5 w-3/4 mb-3 rounded" />
              <div className="skeleton h-4 w-1/2 mb-2 rounded" />
              <div className="flex gap-2 mt-4">
                <div className="skeleton h-8 flex-1 rounded-lg" />
                <div className="skeleton h-8 w-20 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : papers.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No papers found</h3>
          <p className="text-gray-500 dark:text-gray-400">Try different filters</p>
        </div>
      ) : (
        <>
          {/* Show by subject groups when no search */}
          {!filters.search && Object.keys(grouped).length > 0 ? (
            <div className="space-y-6">
              {Object.entries(grouped).map(([subject, subjectPapers]) => (
                <div key={subject} className="card">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-lg border-b border-gray-100 dark:border-gray-800 pb-3">
                    📚 {subject}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {subjectPapers.map(paper => (
                      <PaperCard key={paper._id} paper={paper} onDownload={handleDownload} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {papers.map(paper => (
                <PaperCard key={paper._id} paper={paper} onDownload={handleDownload} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function PaperCard({ paper, onDownload }) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700 transition-all">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white text-sm">{paper.subject}</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {paper.university} • {paper.examMonth} {paper.examYear}
          </p>
        </div>
        <span className="badge bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 text-xs flex-shrink-0">
          {paper.examYear}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className="badge bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 text-xs">{paper.branch}</span>
        <span className="badge bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 text-xs">Sem {paper.semester}</span>
        {paper.isVerified && (
          <span className="badge bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs">✓ Verified</span>
        )}
      </div>

      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-gray-400 flex items-center gap-1">
          <Download className="w-3 h-3" /> {formatNumber(paper.downloadCount)}
        </span>
        <div className="flex gap-2">
          {paper.solutionUrl && (
            <a
              href={paper.solutionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-green-600 hover:underline flex items-center gap-1"
            >
              Solutions
            </a>
          )}
          <button
            onClick={() => onDownload(paper)}
            className="flex items-center gap-1 text-xs btn-primary py-1 px-2.5"
          >
            <Download className="w-3 h-3" />
            Download
          </button>
        </div>
      </div>
    </div>
  )
}

export default QuestionPapers
