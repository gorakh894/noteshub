# EngiNotes Hub - Engineering Notes Sharing & Collaboration Platform

A modern, full-stack MERN application for engineering students to share, access, organize, and collaborate on academic notes, question papers, and study resources.

## 🚀 Current Status

### ✅ Completed
- **Backend**: Fully implemented with Node.js + Express + MongoDB
- **Frontend**: Complete React application with 30+ pages
- **Authentication**: JWT + Google OAuth ready
- **File Upload**: Cloudinary integration configured
- **Real-time Chat**: Socket.IO setup complete
- **Admin Panel**: Full dashboard with analytics
- **Dark/Light Mode**: Theme switching implemented

### ⚠️ MongoDB Connection Issue
The server is running but **MongoDB Atlas connection is failing** due to IP whitelist restrictions.

**To fix this:**
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Navigate to: Network Access → IP Access List
3. Click "Add IP Address"
4. Select "Allow Access from Anywhere" (0.0.0.0/0) for testing
5. Or add your current IP address specifically
6. Save changes and restart the server

**Alternative**: Install MongoDB locally and update `.env`:
```bash
# Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
# After installation, update server/.env:
MONGODB_URI=mongodb://localhost:27017/enginotes
```

## 🌐 Access the Application

- **Frontend**: http://localhost:5173/
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health

## 🛠️ Tech Stack

- **Frontend**: React.js + Tailwind CSS + Vite + Zustand
- **Backend**: Node.js + Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT + Google OAuth
- **File Storage**: Cloudinary
- **Real-time**: Socket.IO
- **Email**: Nodemailer (Gmail SMTP)

## 📁 Project Structure

```
enginotes-hub/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Layout, UI components, Notifications
│   │   ├── pages/          # 30+ pages (Auth, Dashboard, Admin, etc.)
│   │   ├── services/       # API service layer
│   │   ├── store/          # Zustand stores (auth, theme)
│   │   └── utils/          # Constants, helpers
│   └── package.json
└── server/                 # Node.js Backend
    ├── config/             # Database, Cloudinary config
    ├── controllers/        # 8 controllers with full CRUD
    ├── middleware/         # Authentication middleware
    ├── models/             # 6 Mongoose models
    ├── routes/             # Express routes
    ├── socket/             # Socket.IO real-time chat
    ├── utils/              # Seeder, email, tokens
    └── package.json
```

## 🎯 Quick Start Guide

### Both Servers Are Already Running!

The application is currently running in development mode:
- ✅ Frontend: http://localhost:5173/
- ✅ Backend: http://localhost:5000/api

### If You Need to Restart:

**Backend:**
```bash
cd server
npm run dev
```

**Frontend:**
```bash
cd client
npm run dev
```

### After Fixing MongoDB Connection:

Seed the database with sample data:
```bash
cd server
npm run seed
```

## 📝 Environment Variables

### Server (.env) - Already Configured ✅
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASS=your_app_password
```

### Client (.env) - Already Configured ✅
```
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_SOCKET_URL=http://localhost:5000
```

## ✨ Features Implemented

- 🔐 **Authentication**: JWT + Google OAuth, Email Verification, Password Reset
- 📚 **Notes Repository**: Subject-wise organization, Upload/Download with Cloudinary
- 🔍 **Smart Search**: Filter by branch, year, semester, subject, faculty
- 📋 **Question Papers**: Year-wise PYQ collection with solutions
- 👥 **Study Groups**: Create groups, real-time chat with Socket.IO
- 💬 **Discussion Forum**: Ask questions, upvote answers, community learning
- 📊 **Admin Dashboard**: User management, content moderation, analytics
- 🏆 **Gamification**: Contributor badges, leaderboard, download milestones
- 🔔 **Notifications**: Real-time notifications for activities
- 🌙 **Theme Toggle**: Dark/Light mode with persistence
- 📱 **Responsive Design**: Mobile-first approach with Tailwind CSS
- ⚡ **Performance**: Lazy loading, skeleton loaders, optimized builds

## 📚 Database Models

1. **User** - Profile, authentication, role-based access
2. **Note** - Academic notes with metadata and ratings
3. **QuestionPaper** - Previous year papers
4. **Discussion** - Forum posts with answers and votes
5. **StudyGroup** - Collaboration groups with members
6. **Notification** - User notifications system

## 🎓 Academic Organization

**Departments**:
- Information Technology
- Computer Engineering
- AI & Data Science
- Electronics
- Mechanical
- Civil
- Electrical

**Academic Levels**:
- First Year through Final Year
- Semester-wise content
- Unit-wise organization
- Faculty-specific resources

## API Documentation

### Auth Routes
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/google` - Google OAuth
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password/:token` - Reset password
- `GET /api/auth/verify-email/:token` - Verify email

### Notes Routes
- `GET /api/notes` - Get all notes (with filters)
- `POST /api/notes` - Upload note
- `GET /api/notes/:id` - Get single note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `POST /api/notes/:id/download` - Increment download count
- `POST /api/notes/:id/rate` - Rate a note
- `POST /api/notes/:id/bookmark` - Bookmark a note

### Question Papers Routes
- `GET /api/papers` - Get all question papers
- `POST /api/papers` - Upload question paper
- `GET /api/papers/:id` - Get single paper

### Discussion Routes
- `GET /api/discussions` - Get all discussions
- `POST /api/discussions` - Create discussion
- `POST /api/discussions/:id/answers` - Add answer
- `POST /api/discussions/:id/answers/:answerId/vote` - Vote answer

### Study Groups Routes
- `GET /api/groups` - Get all groups
- `POST /api/groups` - Create group
- `POST /api/groups/:id/join` - Join group
- `POST /api/groups/:id/leave` - Leave group

### Admin Routes
- `GET /api/admin/stats` - Get analytics
- `GET /api/admin/users` - Manage users
- `PUT /api/admin/notes/:id/approve` - Approve note
- `DELETE /api/admin/notes/:id` - Delete note

## Deployment

### Vercel (Frontend)
1. Connect GitHub repo to Vercel
2. Set root directory to `client`
3. Add environment variables
4. Deploy

### Render (Backend)
1. Create new Web Service on Render
2. Set root directory to `server`
3. Add environment variables
4. Deploy
