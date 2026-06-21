# Admin Panel Access Guide

## 🎯 How to Access Admin Panel

### Step 1: Login with Admin Credentials

**Admin Account**:
- **Email**: `admin@enginotes.com`
- **Password**: `admin123`

### Step 2: Access Admin Panel

After logging in, you can access the admin panel in two ways:

**Option 1: Direct URL**
```
http://localhost:5173/admin
```

**Option 2: Navigation Menu**
- Look for "Admin" link in the header/navigation
- Or go to Dashboard and look for "Admin Panel" link

---

## 📊 Admin Panel Features

### 1. **Dashboard Overview** (`/admin`)
- Total users count
- Total notes count
- Total downloads
- Pending approvals
- Recent activity
- User growth chart
- Popular subjects
- Top contributors

### 2. **User Management** (`/admin/users`)
- View all registered users
- Block/Unblock users
- Change user roles (User ↔ Admin)
- View user statistics
- Search and filter users

### 3. **Notes Management** (`/admin/notes`)
- View all uploaded notes
- Approve pending notes
- Reject notes with reason
- Delete inappropriate notes
- View note details
- Filter by status (pending/approved/rejected)

---

## 👤 User Roles

### Admin Role
**Permissions**:
- ✅ View admin dashboard
- ✅ Manage all users
- ✅ Approve/reject notes
- ✅ Delete any content
- ✅ View analytics
- ✅ Access all features

### Regular User Role
**Permissions**:
- ✅ Upload notes
- ✅ Download notes
- ✅ Create discussions
- ✅ Join study groups
- ✅ Rate and bookmark
- ❌ No admin access

---

## 🔐 Admin Account Details

**From Database Seeder**:
```javascript
{
  name: "Admin User",
  email: "admin@enginotes.com",
  password: "admin123",
  role: "admin",
  branch: "IT",
  year: "Final",
  isEmailVerified: true
}
```

---

## 🧪 Testing Admin Features

### Test User Management:
1. Login as admin
2. Go to `/admin/users`
3. Try blocking/unblocking a user
4. Try changing user role

### Test Note Moderation:
1. Create a regular user account
2. Upload a note (will be pending)
3. Login as admin
4. Go to `/admin/notes`
5. Approve or reject the note

### Test Analytics:
1. Login as admin
2. Go to `/admin`
3. View dashboard statistics
4. Check user growth
5. See popular subjects

---

## 🛡️ Admin Routes Protection

All admin routes are protected by middleware:

**Backend Protection** (`server/middleware/auth.js`):
```javascript
// Only admins can access
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next()
  } else {
    res.status(403).json({ message: 'Access denied. Admin only.' })
  }
}
```

**Frontend Protection** (`client/src/App.jsx`):
```javascript
// Admin routes wrapped with role check
<Route path="/admin/*" element={<AdminRoute />}>
  <Route path="" element={<AdminDashboard />} />
  <Route path="users" element={<AdminUsers />} />
  <Route path="notes" element={<AdminNotes />} />
</Route>
```

---

## 📋 Admin Panel Pages

### 1. Admin Dashboard
**Path**: `/admin`
**Features**:
- Overview statistics cards
- User growth chart
- Recent activity feed
- Pending approvals count
- Quick actions

### 2. User Management
**Path**: `/admin/users`
**Features**:
- User list with avatars
- Search by name/email
- Filter by role/status
- Block/unblock actions
- Role management
- View user details

### 3. Notes Management
**Path**: `/admin/notes`
**Features**:
- All notes list
- Filter by status (pending/approved/rejected)
- View note details
- Approve/reject with reason
- Delete notes
- View author info
- Download count stats

---

## 🔍 How to Check If You're Admin

### In Frontend:
```javascript
import useAuthStore from './store/authStore'

const { user } = useAuthStore()
if (user?.role === 'admin') {
  // Show admin features
}
```

### In Browser Console:
```javascript
// Open browser console (F12)
localStorage.getItem('auth-storage')
// Look for: "role":"admin"
```

---

## 🚀 Quick Start Commands

### 1. Start the Project:
```bash
# Backend
cd server
npm run dev

# Frontend (new terminal)
cd client
npm run dev
```

### 2. Seed Database (if not done):
```bash
cd server
npm run seed
# OR
node utils/seeder.js
```

### 3. Access Admin Panel:
```
1. Open: http://localhost:5173/
2. Click "Login"
3. Enter: admin@enginotes.com / admin123
4. Go to: http://localhost:5173/admin
```

---

## 👥 Sample Accounts Created by Seeder

### Admin Account:
- **Email**: admin@enginotes.com
- **Password**: admin123
- **Role**: Admin

### Regular Users:
1. **Email**: john@example.com
   **Password**: password123
   **Role**: User

2. **Email**: priya@example.com
   **Password**: password123
   **Role**: User

3. **Email**: rahul@example.com
   **Password**: password123
   **Role**: User

---

## 🔧 Making Another User Admin

### Option 1: Via Database (MongoDB Compass/Atlas)
```javascript
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { role: "admin" } }
)
```

### Option 2: Via Admin Panel
1. Login as existing admin
2. Go to `/admin/users`
3. Find the user
4. Click "Change Role"
5. Select "Admin"

### Option 3: Edit User Model Directly
Update the user's role in the database to `"admin"`

---

## 📊 Admin Dashboard Metrics

### Statistics Shown:
- **Total Users**: Count of registered users
- **Total Notes**: Count of all uploaded notes
- **Total Downloads**: Sum of all download counts
- **Pending Approvals**: Notes waiting for approval
- **Active Users**: Users active in last 30 days
- **Popular Subjects**: Most uploaded subjects
- **Top Contributors**: Users with most uploads

---

## ⚠️ Important Notes

### Security:
- ✅ Admin routes are protected
- ✅ Regular users cannot access admin panel
- ✅ API endpoints check admin role
- ✅ Frontend hides admin links for non-admins

### Default Password:
- 🔒 **Change admin password** after first login!
- Go to Profile → Change Password

### Role Management:
- Only admins can change user roles
- Admins can promote/demote other users
- At least one admin should always exist

---

## 🎯 Common Admin Tasks

### Approve a Note:
1. Login as admin
2. Go to `/admin/notes`
3. Click "Pending" filter
4. Click note to view details
5. Click "Approve" button

### Reject a Note:
1. Go to pending notes
2. Select the note
3. Click "Reject"
4. Enter rejection reason
5. Confirm

### Block a User:
1. Go to `/admin/users`
2. Find the user
3. Click "Block User"
4. Confirm action

### View Analytics:
1. Go to `/admin`
2. View statistics cards
3. Check user growth chart
4. Review recent activity

---

## ✅ Checklist

- [x] Database seeded with admin account
- [x] Admin credentials: admin@enginotes.com / admin123
- [x] MongoDB connected successfully
- [x] Both servers running (frontend + backend)
- [x] Admin routes configured
- [x] Sample data created

## 🎉 You're Ready!

**Access Admin Panel Now**:
1. Open: http://localhost:5173/login
2. Login with: admin@enginotes.com / admin123
3. Navigate to: http://localhost:5173/admin

**Enjoy your admin powers!** 👑
