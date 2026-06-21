import { useState } from 'react'
import { Filter, X, ChevronDown } from 'lucide-react'
import { BRANCHES, YEARS, SEMESTERS, NOTE_CATEGORIES, SORT_OPTIONS } from '../../utils/constants'

function FilterPanel({ filters, onChange, showCategory = true }) {
  const [open, setOpen] = useState(false)

  const activeFilterCount = Object.values(filters).filter(v => v && v !== '').length

  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value })
  }

  const clearFilters = () => {
    onChange({ branch: '', year: '', semester: '', category: '', sort: 'newest', search: filters.search || '' })
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
      {/* Filter Header */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="font-medium text-gray-700 dark:text-gray-300">Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); clearFilters() }}
              className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Clear
            </button>
          )}
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* Filter Body */}
      {open && (
        <div className="border-t border-gray-100 dark:border-gray-800 p-4 space-y-4">
          {/* Sort */}
          <div>
            <label className="label text-xs uppercase tracking-wide text-gray-400">Sort By</label>
            <select
              value={filters.sort || 'newest'}
              onChange={(e) => handleChange('sort', e.target.value)}
              className="input text-sm"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Branch */}
          <div>
            <label className="label text-xs uppercase tracking-wide text-gray-400">Branch</label>
            <select
              value={filters.branch || ''}
              onChange={(e) => handleChange('branch', e.target.value)}
              className="input text-sm"
            >
              <option value="">All Branches</option>
              {BRANCHES.map(b => (
                <option key={b.value} value={b.value}>{b.label}</option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div>
            <label className="label text-xs uppercase tracking-wide text-gray-400">Year</label>
            <select
              value={filters.year || ''}
              onChange={(e) => handleChange('year', e.target.value)}
              className="input text-sm"
            >
              <option value="">All Years</option>
              {YEARS.map(y => (
                <option key={y.value} value={y.value}>{y.label}</option>
              ))}
            </select>
          </div>

          {/* Semester */}
          <div>
            <label className="label text-xs uppercase tracking-wide text-gray-400">Semester</label>
            <select
              value={filters.semester || ''}
              onChange={(e) => handleChange('semester', e.target.value)}
              className="input text-sm"
            >
              <option value="">All Semesters</option>
              {SEMESTERS.map(s => (
                <option key={s} value={s}>Semester {s}</option>
              ))}
            </select>
          </div>

          {/* Category */}
          {showCategory && (
            <div>
              <label className="label text-xs uppercase tracking-wide text-gray-400">Category</label>
              <select
                value={filters.category || ''}
                onChange={(e) => handleChange('category', e.target.value)}
                className="input text-sm"
              >
                <option value="">All Categories</option>
                {NOTE_CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          )}

          {/* Exam Important */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.examImportant === 'true' || filters.examImportant === true}
              onChange={(e) => handleChange('examImportant', e.target.checked ? 'true' : '')}
              className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Exam Important Only</span>
          </label>
        </div>
      )}
    </div>
  )
}

export default FilterPanel
