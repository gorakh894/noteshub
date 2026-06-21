import { Link } from 'react-router-dom'
import { BookOpen, Users, Award, Zap, Upload, ArrowRight } from 'lucide-react'

function About() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-secondary-600 text-white py-20">
        <div className="page-container text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <BookOpen className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold mb-4">About EngiNotes Hub</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            India's premier platform for engineering students to share, access, and collaborate on academic study materials.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="page-container py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
            EngiNotes Hub was built by engineering students, for engineering students. We believe that quality education should be accessible to everyone, and the best way to learn is together.
          </p>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Our platform enables students to upload and share notes, find previous year question papers, collaborate in study groups, and discuss academic topics — all in one place.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-50 dark:bg-gray-950 py-12">
        <div className="page-container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: '50K+', label: 'Engineering Students', icon: Users },
              { value: '10K+', label: 'Study Resources', icon: BookOpen },
              { value: '5K+', label: 'PYQ Papers', icon: Award },
              { value: '100K+', label: 'Downloads', icon: Zap },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-1">{stat.value}</div>
                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="page-container py-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-10">What We Offer</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {[
            { title: 'Organized Repository', desc: 'All notes organized by branch, year, semester, and subject for easy discovery.' },
            { title: 'Quality Moderation', desc: 'All uploaded content is reviewed by our team to ensure quality and accuracy.' },
            { title: 'Gamified Learning', desc: 'Earn points and badges for contributions, climb the leaderboard.' },
            { title: 'Real-time Collaboration', desc: 'Study groups with live chat, resource sharing, and collaboration tools.' },
            { title: 'Exam Preparation', desc: 'Dedicated section for important questions, cheat sheets, and PYQ papers.' },
            { title: 'Discussion Forum', desc: 'Ask questions, share solutions, and connect with fellow students.' },
          ].map((f, i) => (
            <div key={i} className="card flex gap-4">
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex-shrink-0 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold">
                {i + 1}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{f.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 py-16">
        <div className="page-container text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Join the Community</h2>
          <p className="text-white/80 mb-8 max-w-md mx-auto">
            Start contributing today and help thousands of engineering students across India.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/register" className="px-8 py-3 bg-white text-primary-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors">
              Get Started Free
            </Link>
            <Link to="/browse" className="px-8 py-3 bg-white/20 border border-white/40 text-white font-semibold rounded-xl hover:bg-white/30 transition-colors flex items-center gap-2">
              Browse Notes <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
