# 🎓 EngiNotes Hub

A modern, full-stack MERN application for engineering students to share, access, and collaborate on academic notes, question papers, and study resources.

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 🚀 Features

- 🔐 **JWT + Google OAuth** Authentication
- 📚 **Subject-wise Notes Repository** with advanced filtering
- 🔍 **Smart Search** by branch, year, semester, subject
- 📋 **Previous Year Question Papers** collection
- 👥 **Study Groups** with real-time chat (Socket.IO)
- 💬 **Discussion Forum** with Q&A and voting
- 📊 **Admin Dashboard** with analytics and moderation
- 🏆 **Gamification** - badges, leaderboard, points
- 🌙 **Dark/Light Mode** with theme persistence
- 📱 **Fully Responsive** mobile-first design
- ☁️ **Cloudinary** file upload and storage
- 📧 **Email Notifications** with nodemailer

## 📸 Screenshots

*(Add your screenshots here after deployment)*

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **Zustand** for state management
- **React Router v6** for navigation
- **Axios** for API calls
- **React Hot Toast** for notifications
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Socket.IO** for real-time features
- **Cloudinary** for file storage
- **Nodemailer** for emails
- **Helmet** for security
- **CORS** configuration

## 📁 Project Structure

```
enginotes-hub/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # 30+ page components
│   │   ├── services/       # API service layer
│   │   ├── store/          # Zustand state management
│   │   └── utils/          # Helper functions
│   └── package.json
├── server/                 # Node.js backend
│   ├── config/             # Database & Cloudinary config
│   ├── controllers/        # 8 controllers with full CRUD
│   ├── models/             # 6 Mongoose models
│   ├── routes/             # Express routes
│   ├── middleware/         # Auth middleware
│   ├── socket/             # Socket.IO handlers
│   └── utils/              # Utilities & seeder
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- MongoDB Atlas account
- Cloudinary account
- Gmail account (for email)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/enginotes-hub.git
cd enginotes-hub
```

2. **Install dependencies**
```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

3. **Configure environment variables**

Create `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
CLIENT_URL=http://localhost:5173
```

Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

4. **Seed the database** (optional)
```bash
cd server
npm run seed
```

5. **Start development servers**
```bash
# Backend (terminal 1)
cd server
npm run dev

# Frontend (terminal 2)
cd client
npm run dev
```

6. **Access the application**
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Admin Panel: http://localhost:5173/admin

### Default Admin Credentials
- **Email**: admin@enginotes.com
- **Password**: admin123

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/google` - Google OAuth
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password/:token` - Reset password

### Notes
- `GET /api/notes` - Get all notes (with filters)
- `POST /api/notes` - Upload note
- `GET /api/notes/:id` - Get single note
- `POST /api/notes/:id/download` - Download note
- `POST /api/notes/:id/rate` - Rate note
- `POST /api/notes/:id/bookmark` - Bookmark note

### Admin
- `GET /api/admin/stats` - Get analytics
- `GET /api/admin/users` - Manage users
- `PUT /api/admin/notes/:id/approve` - Approve note

## 🚀 Deployment

### Quick Deploy (5 minutes)

1. **Backend to Render**
   - Connect GitHub repository
   - Root Directory: `server`
   - Build: `npm install`
   - Start: `npm start`

2. **Frontend to Vercel**
   - Connect GitHub repository
   - Root Directory: `client`
   - Framework: Vite
   - Build: `npm run build`

**Detailed deployment guide**: See `DEPLOYMENT_GUIDE.md`

## 📊 Database Models

- **User** - User accounts with roles and stats
- **Note** - Academic notes with metadata
- **QuestionPaper** - Previous year papers
- **Discussion** - Forum posts with answers
- **StudyGroup** - Groups with real-time chat
- **Notification** - User notifications

## 🎯 Academic Organization

**Departments**: IT, Computer, AI & DS, Electronics, Mechanical, Civil, Electrical

**Structure**:
- Years: FY, SY, TY, Final
- Semesters: 1-8
- Units: Subject-specific
- Categories: Lecture Notes, Handwritten, PPT, Practicals, etc.

## 🛡️ Security Features

- JWT authentication with refresh tokens
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS configuration
- Helmet.js security headers
- Input validation and sanitization
- XSS protection
- MongoDB injection prevention

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@YOUR_USERNAME](https://github.com/YOUR_USERNAME)
- Email: your.email@example.com

## 🙏 Acknowledgments

- MongoDB Atlas for database hosting
- Cloudinary for file storage
- Vercel for frontend hosting
- Render for backend hosting
- All open-source contributors

## 📞 Support

For support, email your.email@example.com or create an issue in the repository.

---

**⭐ Star this repository if you find it helpful!**

Made with ❤️ for engineering students
