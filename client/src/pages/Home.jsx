import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, BookOpen, Download, Users, Star, ArrowRight, Zap, Award, Upload, MessageCircle } from 'lucide-react'
import { noteService } from '../services/noteService'
import NoteCard from '../components/ui/NoteCard'
import NoteCardSkeleton from '../components/ui/NoteCardSkeleton'

function Home() {
  const [search, setSearch] = useState('')
  const [featuredNotes, setFeaturedNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await noteService.getNotes({ limit: 6, sort: 'most_downloaded' })
        setFeaturedNotes(data?.notes || [])
      } catch (error) {
        console.error('Failed to fetch featured notes:', error)
        setFeaturedNotes([])
      } finally {
        setLoading(false)
      }
    }
    fetchFeatured()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/browse?search=${encodeURIComponent(search.trim())}`)
    }
  }

  const stats = [
    { icon: BookOpen, value: '10,000+', label: 'Study Notes', color: 'text-blue-600' },
    { icon: Download, value: '50K+', label: 'Downloads', color: 'text-green-600' },
    { icon: Users, value: '25K+', label: 'Students', color: 'text-purple-600' },
    { icon: Star, value: '4.8', label: 'Avg Rating', color: 'text-amber-500' },
  ]

  const quickCategories = [
    { label: '📄 Lecture Notes', params: 'category=Lecture Notes' },
    { label: '✍️ Handwritten', params: 'category=Handwritten Notes' },
    { label: '📊 PPT Slides', params: 'category=PPT' },
    { label: '🧪 Practicals', params: 'category=Practical Journal' },
    { label: '📋 Cheat Sheets', params: 'category=Cheat Sheet' },
    { label: '❓ PYQ Papers', path: '/question-papers' },
    { label: '🔬 Viva Q&A', params: 'category=Viva Q%26A' },
    { label: '⭐ Exam Important', params: 'examImportant=true' },
  ]

  const branches = [
    { name: 'Information Technology', code: 'IT', emoji: '💻', color: 'from-blue-500 to-blue-600' },
    { name: 'Computer Engineering', code: 'CS', emoji: '🖥️', color: 'from-purple-500 to-purple-600' },
    { name: 'AI & Data Science', code: 'AIDS', emoji: '🤖', color: 'from-pink-500 to-pink-600' },
    { name: 'Electronics', code: 'Electronics', emoji: '⚡', color: 'from-yellow-500 to-orange-500' },
    { name: 'Mechanical', code: 'Mechanical', emoji: '⚙️', color: 'from-orange-500 to-red-500' },
    { name: 'Civil', code: 'Civil', emoji: '🏗️', color: 'from-green-500 to-teal-500' },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-96 h-96 bg-white/10 rounded-full" />
          <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-white/10 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-1.5 text-sm mb-6">
            <Zap className="w-4 h-4 text-yellow-300" />
            <span>India's #1 Engineering Notes Platform</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-5 leading-tight">
            Ace Your Engineering
            <span className="block text-yellow-300">Exams with Smart Notes</span>
          </h1>

          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
            Access thousands of notes, question papers, practicals, and study resources — all organized by branch, year, and subject.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-3 max-w-xl mx-auto mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="search"
                placeholder="Search notes, subjects, topics..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg text-base"
              />
            </div>
            <button type="submit" className="px-6 py-3.5 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-semibold rounded-xl transition-colors shadow-lg">
              Search
            </button>
          </form>

          {/* CTAs */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link to="/browse" className="px-6 py-3 bg-white text-primary-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-lg flex items-center gap-2">
              Browse Notes <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/dashboard/upload" className="px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/40 text-white font-semibold rounded-xl hover:bg-white/30 transition-colors flex items-center gap-2">
              <Upload className="w-4 h-4" /> Upload Notes
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 mb-3 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Categories */}
      <section className="py-12 page-container">
        <h2 className="section-title mb-6 text-center">Browse by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickCategories.map((cat, i) => (
            <Link
              key={i}
              to={cat.path || `/browse?${cat.params}`}
              className="flex items-center justify-center p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary-400 dark:hover:border-primary-600 hover:shadow-md transition-all font-medium text-gray-700 dark:text-gray-300 text-sm"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Branches */}
      <section className="py-12 bg-gray-50 dark:bg-gray-950">
        <div className="page-container">
          <h2 className="section-title mb-2 text-center">Browse by Branch</h2>
          <p className="text-gray-500 dark:text-gray-400 text-center mb-8">Find notes specific to your engineering branch</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {branches.map((branch, i) => (
              <Link
                key={i}
                to={`/browse?branch=${branch.code}`}
                className="group flex flex-col items-center p-5 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-lg transition-all text-center"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${branch.color} rounded-xl flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform shadow-md`}>
                  {branch.emoji}
                </div>
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 leading-tight">{branch.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Notes */}
      <section className="py-12 page-container">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="section-title">Most Downloaded Notes</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Trending study materials</p>
          </div>
          <Link to="/browse?sort=most_downloaded" className="text-sm text-primary-600 dark:text-primary-400 font-medium hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading
            ? Array(6).fill(0).map((_, i) => <NoteCardSkeleton key={i} />)
            : featuredNotes.map(note => <NoteCard key={note._id} note={note} />)
          }
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800">
        <div className="page-container">
          <h2 className="section-title text-center mb-2">Everything You Need to Excel</h2>
          <p className="text-gray-500 dark:text-gray-400 text-center mb-10">Designed specifically for engineering students</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: BookOpen, title: 'Subject-Wise Notes', desc: 'Organized by branch, year, semester, and unit for easy access', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
              { icon: Award, title: 'PYQ Papers', desc: 'Previous year question papers from SPPU, Mumbai University and more', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
              { icon: MessageCircle, title: 'Discussion Forum', desc: 'Ask questions, share solutions, and discuss with fellow students', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
              { icon: Users, title: 'Study Groups', desc: 'Create and join study groups with real-time chat and resource sharing', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
              { icon: Zap, title: 'Exam Prep Hub', desc: 'Important questions, cheat sheets, and quick revision materials', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
              { icon: Star, title: 'Gamified Learning', desc: 'Earn badges, climb the leaderboard, and get recognized for contributions', color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400' },
            ].map((feature, i) => (
              <div key={i} className="card hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color}`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="page-container text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Ace Your Exams?
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Join thousands of engineering students already using EngiNotes Hub to study smarter.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/register" className="btn-primary px-8 py-3 text-base">
              Get Started Free
            </Link>
            <Link to="/browse" className="btn-secondary px-8 py-3 text-base">
              Browse Notes
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
