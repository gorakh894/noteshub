import { Link } from 'react-router-dom'
import { BookOpen, Github, Twitter, Linkedin, Mail } from 'lucide-react'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-gray-900 dark:text-white">EngiNotes Hub</span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              The ultimate platform for engineering students to share and access study materials.
            </p>
            <div className="flex gap-3">
              {[Github, Twitter, Linkedin, Mail].map((Icon, i) => (
                <button key={i} className="p-2 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Resources</h3>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              {[
                { to: '/browse', label: 'Browse Notes' },
                { to: '/question-papers', label: 'PYQ Papers' },
                { to: '/browse?category=Cheat Sheet', label: 'Cheat Sheets' },
                { to: '/browse?examImportant=true', label: 'Exam Important' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Community</h3>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              {[
                { to: '/discussions', label: 'Discussions' },
                { to: '/study-groups', label: 'Study Groups' },
                { to: '/leaderboard', label: 'Leaderboard' },
                { to: '/about', label: 'About Us' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Branches */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Branches</h3>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              {['IT', 'CS', 'AI & DS', 'Electronics', 'Mechanical', 'Civil'].map(branch => (
                <li key={branch}>
                  <Link
                    to={`/browse?branch=${branch}`}
                    className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {branch}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {currentYear} EngiNotes Hub. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
            <a href="#" className="hover:text-primary-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary-600 transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
