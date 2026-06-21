# ⚡ Quick Start Guide

## 🎯 Your Application is Running!

### Current Status:
- ✅ **Frontend**: http://localhost:5173/ (Running)
- ✅ **Backend**: http://localhost:5000/api (Running)
- ⚠️ **MongoDB**: Not connected (needs IP whitelist fix)

---

## 🚨 Fix MongoDB Connection (Choose One)

### Option A: MongoDB Atlas (5 minutes) ⭐ Recommended

1. Open https://cloud.mongodb.com/ and login
2. Click **"Network Access"** (left sidebar)
3. Click **"Add IP Address"**
4. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
5. Click **"Confirm"**
6. Wait 2-3 minutes
7. Check server terminal - should show: `✅ MongoDB Connected`

### Option B: Local MongoDB (15 minutes)

1. Download: https://www.mongodb.com/try/download/community
2. Install with default settings
3. Edit `enginotes-hub/server/.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/enginotes
   ```
4. Server will auto-restart and connect

---

## 🗄️ Seed the Database

After MongoDB connects:

```bash
cd server
npm run seed
```

**This creates**:
- ✅ Admin account: `admin@enginotes.com` / `Admin@123`
- ✅ 5 sample users
- ✅ 10 sample notes
- ✅ 5 question papers
- ✅ Sample discussions
- ✅ Study groups

---

## 🧪 Test the Application

### 1. Open Frontend
Visit: http://localhost:5173/

### 2. Register a New Account
- Click "Register"
- Fill in details
- Check email for verification (if email is configured)

### 3. Or Use Seeded Admin Account
- Email: `admin@enginotes.com`
- Password: `Admin@123`

### 4. Try These Features:
- ✨ Browse notes with filters
- 📤 Upload a note (Dashboard → Upload Note)
- 💬 Create a discussion
- 👥 Join a study group
- 🏆 Check the leaderboard
- 🌙 Toggle dark/light mode
- 👑 Admin panel (if using admin account)

---

## 📁 Project Structure

```
enginotes-hub/
├── client/                    ← React Frontend
│   ├── src/
│   │   ├── pages/             ← 30+ page components
│   │   ├── components/        ← Reusable UI components
│   │   ├── services/          ← API calls
│   │   └── store/             ← Zustand state management
│   └── .env                   ← Frontend config ✅
│
└── server/                    ← Node.js Backend
    ├── controllers/           ← 8 controllers
    ├── models/                ← 6 Mongoose models
    ├── routes/                ← API routes
    ├── socket/                ← Real-time chat
    └── .env                   ← Backend config ✅
```

---

## 🔧 Useful Commands

### Backend
```bash
cd server
npm run dev        # Start development server
npm start          # Start production server
npm run seed       # Seed database
```

### Frontend
```bash
cd client
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

### Check Server Health
```bash
curl http://localhost:5000/health
```

---

## 📚 Important URLs

| What | URL |
|------|-----|
| Frontend | http://localhost:5173/ |
| Backend API | http://localhost:5000/api |
| Health Check | http://localhost:5000/health |
| MongoDB Atlas | https://cloud.mongodb.com/ |
| Cloudinary | https://cloudinary.com/console |

---

## 🎯 API Endpoints Quick Reference

### Auth
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `POST /api/auth/google` - Google OAuth

### Notes
- `GET /api/notes` - Get all notes (with filters)
- `POST /api/notes` - Upload note (requires auth)
- `GET /api/notes/:id` - Get single note
- `POST /api/notes/:id/download` - Download note
- `POST /api/notes/:id/rate` - Rate note
- `POST /api/notes/:id/bookmark` - Bookmark note

### Question Papers
- `GET /api/papers` - Get all papers
- `POST /api/papers` - Upload paper

### Discussions
- `GET /api/discussions` - Get all discussions
- `POST /api/discussions` - Create discussion
- `POST /api/discussions/:id/answers` - Add answer

### Study Groups
- `GET /api/groups` - Get all groups
- `POST /api/groups` - Create group
- `POST /api/groups/:id/join` - Join group

### Admin (requires admin role)
- `GET /api/admin/stats` - Analytics
- `GET /api/admin/users` - Manage users
- `PUT /api/admin/notes/:id/approve` - Approve note

---

## 🐛 Something Not Working?

### Server won't start?
```bash
cd server
rm -rf node_modules
npm install
npm run dev
```

### Client won't start?
```bash
cd client
rm -rf node_modules
npm install
npm run dev
```

### Still stuck?
Check **TROUBLESHOOTING.md** for detailed solutions!

---

## 🚀 Deploy to Production

### Frontend (Vercel)
1. Push code to GitHub
2. Import project in Vercel
3. Set root directory: `client`
4. Add environment variables
5. Deploy!

### Backend (Render)
1. Create new Web Service on Render
2. Connect GitHub repo
3. Set root directory: `server`
4. Add environment variables
5. Deploy!

See **README.md** for complete deployment instructions.

---

## ✅ Checklist

Before considering the project complete:

- [ ] MongoDB connection working
- [ ] Database seeded with sample data
- [ ] Can register/login users
- [ ] Can upload notes
- [ ] Can create discussions
- [ ] Study groups working
- [ ] Admin panel accessible
- [ ] Dark mode working
- [ ] Responsive on mobile
- [ ] All API endpoints tested

---

## 🎉 You've Built:

- ✨ Complete MERN stack application
- 🔐 Authentication with JWT + OAuth
- 📁 File upload with Cloudinary
- 💬 Real-time chat with Socket.IO
- 📊 Admin dashboard with analytics
- 🏆 Gamification system
- 🌙 Dark/light theme
- 📱 Fully responsive design

**Amazing work! 🎊**

---

Need help? Check these files:
- **README.md** - Full documentation
- **TROUBLESHOOTING.md** - Problem solutions
- **PROJECT_STATUS.md** - Detailed status report
