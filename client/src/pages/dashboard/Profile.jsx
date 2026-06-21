import { useState, useRef } from 'react'
import { Camera, Save, Lock, User } from 'lucide-react'
import useAuthStore from '../../store/authStore'
import { userService } from '../../services/noteService'
import { BRANCHES, YEARS, SEMESTERS } from '../../utils/constants'
import { BADGE_COLORS } from '../../utils/constants'
import toast from 'react-hot-toast'

function Profile() {
  const { user, updateUser } = useAuthStore()
  const fileRef = useRef(null)
  const [activeTab, setActiveTab] = useState('profile')
  const [saving, setSaving] = useState(false)
  const [avatarLoading, setAvatarLoading] = useState(false)
  const [profile, setProfile] = useState({
    name: user?.name || '',
    branch: user?.branch || '',
    year: user?.year || '',
    semester: user?.semester || '',
    college: user?.college || '',
    bio: user?.bio || '',
  })
  const [passwords, setPasswords] = useState({
    currentPassword: '', newPassword: '', confirmPassword: ''
  })

  const handleProfileSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { data } = await userService.updateProfile(profile)
      updateUser(data.user)
      toast.success('Profile updated!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update')
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setAvatarLoading(true)
    const formData = new FormData()
    formData.append('avatar', file)
    try {
      const { data } = await userService.updateAvatar(formData)
      updateUser({ avatar: data.avatar })
      toast.success('Avatar updated!')
    } catch {
      toast.error('Failed to update avatar')
    } finally {
      setAvatarLoading(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    setSaving(true)
    try {
      await userService.changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      })
      toast.success('Password changed!')
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page-container max-w-3xl">
      <h1 className="section-title mb-6">Profile Settings</h1>

      {/* Avatar */}
      <div className="card mb-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <img
              src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=6366f1&color=fff&size=80`}
              alt={user?.name}
              className="w-20 h-20 rounded-2xl object-cover shadow-md"
            />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={avatarLoading}
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary-600 text-white rounded-full flex items-center justify-center shadow-sm hover:bg-primary-700 transition-colors"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
            <input ref={fileRef} type="file" hidden accept="image/*" onChange={handleAvatarChange} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{user?.email}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="badge bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 capitalize">{user?.role}</span>
              {user?.isEmailVerified
                ? <span className="badge bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs">✓ Verified</span>
                : <span className="badge bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-xs">⚠ Unverified</span>
              }
            </div>
          </div>
          <div className="ml-auto text-center">
            <div className="text-2xl font-bold text-primary-600">{user?.contributionScore || 0}</div>
            <div className="text-xs text-gray-400">Score</div>
          </div>
        </div>
      </div>

      {/* Badges */}
      {user?.badges?.length > 0 && (
        <div className="card mb-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">My Badges</h3>
          <div className="flex flex-wrap gap-2">
            {user.badges.map((badge, i) => (
              <span key={i} className={`badge ${BADGE_COLORS[badge.name] || 'bg-gray-100 text-gray-700'}`}>
                {badge.icon} {badge.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
        {[{ id: 'profile', icon: User, label: 'Profile' }, { id: 'security', icon: Lock, label: 'Security' }].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-white dark:bg-gray-900 text-primary-600 shadow-sm' : 'text-gray-600 dark:text-gray-400'}`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <form onSubmit={handleProfileSave} className="card space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} className="input" placeholder="Your full name" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Branch</label>
              <select value={profile.branch} onChange={e => setProfile(p => ({ ...p, branch: e.target.value }))} className="input text-sm">
                <option value="">Select Branch</option>
                {BRANCHES.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Year</label>
              <select value={profile.year} onChange={e => setProfile(p => ({ ...p, year: e.target.value }))} className="input text-sm">
                <option value="">Select Year</option>
                {YEARS.map(y => <option key={y.value} value={y.value}>{y.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label">College</label>
            <input value={profile.college} onChange={e => setProfile(p => ({ ...p, college: e.target.value }))} className="input" placeholder="Your college name" />
          </div>
          <div>
            <label className="label">Bio</label>
            <textarea value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} rows={3} className="input resize-none" placeholder="Tell us about yourself..." maxLength={300} />
            <p className="text-xs text-gray-400 mt-1 text-right">{profile.bio.length}/300</p>
          </div>
          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-50">
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      )}

      {activeTab === 'security' && (
        <form onSubmit={handlePasswordChange} className="card space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Change Password</h3>
          {user?.password !== undefined && (
            <div>
              <label className="label">Current Password</label>
              <input type="password" value={passwords.currentPassword} onChange={e => setPasswords(p => ({ ...p, currentPassword: e.target.value }))} className="input" placeholder="Current password" />
            </div>
          )}
          <div>
            <label className="label">New Password</label>
            <input type="password" value={passwords.newPassword} onChange={e => setPasswords(p => ({ ...p, newPassword: e.target.value }))} className="input" placeholder="Min. 6 characters" minLength={6} required />
          </div>
          <div>
            <label className="label">Confirm New Password</label>
            <input type="password" value={passwords.confirmPassword} onChange={e => setPasswords(p => ({ ...p, confirmPassword: e.target.value }))} className="input" placeholder="Repeat new password" required />
          </div>
          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-50">
            <Lock className="w-4 h-4" /> {saving ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      )}
    </div>
  )
}

export default Profile
