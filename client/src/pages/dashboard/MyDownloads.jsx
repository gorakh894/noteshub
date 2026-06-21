import { Download } from 'lucide-react'
import { Link } from 'react-router-dom'

// Downloads are tracked in analytics — this shows a placeholder
function MyDownloads() {
  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="section-title mb-1">My Downloads</h1>
        <p className="text-gray-500 dark:text-gray-400">Track your downloaded study materials</p>
      </div>
      <div className="text-center py-16 card">
        <Download className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Download History</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Your download history will appear here. Browse notes and download what you need!
        </p>
        <Link to="/browse" className="btn-primary">Browse Notes</Link>
      </div>
    </div>
  )
}

export default MyDownloads
