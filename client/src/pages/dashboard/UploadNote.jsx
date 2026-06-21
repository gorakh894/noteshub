import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, X, FileText, AlertCircle } from 'lucide-react'
import { noteService } from '../../services/noteService'
import { BRANCHES, YEARS, SEMESTERS, NOTE_CATEGORIES } from '../../utils/constants'
import { formatFileSize } from '../../utils/helpers'
import toast from 'react-hot-toast'

function UploadNote() {
  const navigate = useNavigate()
  const fileRef = useRef(null)
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [form, setForm] = useState({
    title: '', description: '', subject: '', branch: '',
    year: '', semester: '', unit: '', category: '',
    tags: '', faculty: '', college: '', university: '',
    isExamImportant: false
  })

  const handleFile = (f) => {
    const allowed = ['application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'image/jpeg', 'image/png', 'application/zip', 'application/x-zip-compressed']

    if (!allowed.includes(f.type)) {
      toast.error('Invalid file type. Allowed: PDF, DOCX, PPTX, Images, ZIP')
      return
    }
    if (f.size > 50 * 1024 * 1024) {
      toast.error('File too large. Max 50MB')
      return
    }
    setFile(f)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) { toast.error('Please select a file'); return }
    if (!form.branch || !form.year || !form.semester || !form.category) {
      toast.error('Please fill all required fields')
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)
    Object.entries(form).forEach(([k, v]) => { if (v !== '') formData.append(k, v) })

    try {
      const { data } = await noteService.uploadNote(formData)
      toast.success(data.message)
      navigate('/dashboard/uploads')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed')
    } finally {
      setLoading(false)
      setProgress(0)
    }
  }

  const fileExtIcon = {
    'application/pdf': '📄',
    'application/msword': '📝',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '📝',
    'application/vnd.ms-powerpoint': '📊',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': '📊',
    'image/jpeg': '🖼️', 'image/png': '🖼️',
    'application/zip': '📦', 'application/x-zip-compressed': '📦',
  }

  return (
    <div className="page-container max-w-3xl">
      <div className="mb-6">
        <h1 className="section-title mb-1">Upload Notes</h1>
        <p className="text-gray-500 dark:text-gray-400">Share your study materials with the community</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload Area */}
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
            dragging
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-600'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
        >
          <input
            ref={fileRef}
            type="file"
            hidden
            accept=".pdf,.docx,.doc,.pptx,.ppt,.jpg,.jpeg,.png,.zip"
            onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
          />

          {file ? (
            <div className="flex items-center justify-center gap-4">
              <span className="text-4xl">{fileExtIcon[file.type] || '📎'}</span>
              <div className="text-left">
                <p className="font-medium text-gray-900 dark:text-white">{file.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{formatFileSize(file.size)}</p>
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setFile(null) }}
                className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-700 dark:text-gray-300 font-medium mb-1">Drag & drop or click to upload</p>
              <p className="text-sm text-gray-400">PDF, DOCX, PPTX, Images, ZIP — Max 50MB</p>
            </>
          )}
        </div>

        {/* Form Fields */}
        <div className="card space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Note Details</h3>

          <div>
            <label className="label">Title *</label>
            <input
              required
              placeholder="e.g., DBMS Unit 3 - Normalization Notes"
              value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              className="input"
              maxLength={200}
            />
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              placeholder="Brief description of the content..."
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              rows={2}
              className="input resize-none"
              maxLength={1000}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Subject *</label>
              <input
                required
                placeholder="e.g., Database Management"
                value={form.subject}
                onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                className="input"
              />
            </div>
            <div>
              <label className="label">Unit</label>
              <input
                placeholder="e.g., Unit 3"
                value={form.unit}
                onChange={e => setForm(p => ({ ...p, unit: e.target.value }))}
                className="input"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="label">Branch *</label>
              <select required value={form.branch} onChange={e => setForm(p => ({ ...p, branch: e.target.value }))} className="input text-sm">
                <option value="">Select</option>
                {BRANCHES.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Year *</label>
              <select required value={form.year} onChange={e => setForm(p => ({ ...p, year: e.target.value }))} className="input text-sm">
                <option value="">Select</option>
                {YEARS.map(y => <option key={y.value} value={y.value}>{y.label}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Semester *</label>
              <select required value={form.semester} onChange={e => setForm(p => ({ ...p, semester: e.target.value }))} className="input text-sm">
                <option value="">Sem</option>
                {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="label">Category *</label>
            <select required value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="input">
              <option value="">Select category</option>
              {NOTE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="label">Tags</label>
            <input
              placeholder="e.g., normalization, ACID, SQL (comma separated)"
              value={form.tags}
              onChange={e => setForm(p => ({ ...p, tags: e.target.value }))}
              className="input text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Faculty Name</label>
              <input
                placeholder="e.g., Prof. Sharma"
                value={form.faculty}
                onChange={e => setForm(p => ({ ...p, faculty: e.target.value }))}
                className="input text-sm"
              />
            </div>
            <div>
              <label className="label">University</label>
              <input
                placeholder="e.g., SPPU"
                value={form.university}
                onChange={e => setForm(p => ({ ...p, university: e.target.value }))}
                className="input text-sm"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isExamImportant}
              onChange={e => setForm(p => ({ ...p, isExamImportant: e.target.checked }))}
              className="w-4 h-4 text-primary-600 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Mark as Exam Important</span>
          </label>
        </div>

        {/* Info */}
        <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm text-blue-700 dark:text-blue-400">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>Your note will be reviewed before being published. This typically takes 1-2 hours.</p>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={loading || !file} className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Uploading...</>
            ) : (
              <><Upload className="w-4 h-4" /> Submit Note</>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default UploadNote
