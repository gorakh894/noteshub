import { useEffect, lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import useThemeStore from './store/themeStore'
import useAuthStore from './store/authStore'
import Layout from './components/layout/Layout'
import AuthLayout from './components/layout/AuthLayout'
import LoadingSpinner from './components/ui/LoadingSpinner'

// Lazy load pages
const Home = lazy(() => import('./pages/Home'))
const BrowseNotes = lazy(() => import('./pages/BrowseNotes'))
const NoteDetail = lazy(() => import('./pages/NoteDetail'))
const QuestionPapers = lazy(() => import('./pages/QuestionPapers'))
const Discussions = lazy(() => import('./pages/Discussions'))
const DiscussionDetail = lazy(() => import('./pages/DiscussionDetail'))
const StudyGroups = lazy(() => import('./pages/StudyGroups'))
const GroupDetail = lazy(() => import('./pages/GroupDetail'))
const Leaderboard = lazy(() => import('./pages/Leaderboard'))
const About = lazy(() => import('./pages/About'))

// Auth Pages
const Login = lazy(() => import('./pages/auth/Login'))
const Register = lazy(() => import('./pages/auth/Register'))
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'))
const VerifyEmail = lazy(() => import('./pages/auth/VerifyEmail'))

// Dashboard Pages
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'))
const MyUploads = lazy(() => import('./pages/dashboard/MyUploads'))
const MyDownloads = lazy(() => import('./pages/dashboard/MyDownloads'))
const Bookmarks = lazy(() => import('./pages/dashboard/Bookmarks'))
const UploadNote = lazy(() => import('./pages/dashboard/UploadNote'))
const Profile = lazy(() => import('./pages/dashboard/Profile'))

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'))
const AdminNotes = lazy(() => import('./pages/admin/AdminNotes'))

// Protected Route
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (adminOnly && !['admin', 'coordinator'].includes(user?.role)) {
    return <Navigate to="/dashboard" replace />
  }
  return children
}

function App() {
  const { initTheme } = useThemeStore()
  const { fetchMe, isAuthenticated } = useAuthStore()

  useEffect(() => {
    initTheme()
    if (isAuthenticated) {
      fetchMe()
    }
  }, [])

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '10px',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#6366f1', secondary: '#fff' } },
        }}
      />
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="browse" element={<BrowseNotes />} />
            <Route path="notes/:id" element={<NoteDetail />} />
            <Route path="question-papers" element={<QuestionPapers />} />
            <Route path="discussions" element={<Discussions />} />
            <Route path="discussions/:id" element={<DiscussionDetail />} />
            <Route path="study-groups" element={<StudyGroups />} />
            <Route path="study-groups/:id" element={
              <ProtectedRoute><GroupDetail /></ProtectedRoute>
            } />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="about" element={<About />} />
          </Route>

          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password/:token" element={<ResetPassword />} />
            <Route path="verify-email/:token" element={<VerifyEmail />} />
          </Route>

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="uploads" element={<MyUploads />} />
            <Route path="downloads" element={<MyDownloads />} />
            <Route path="bookmarks" element={<Bookmarks />} />
            <Route path="upload" element={<UploadNote />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute adminOnly><Layout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="notes" element={<AdminNotes />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  )
}

export default App
