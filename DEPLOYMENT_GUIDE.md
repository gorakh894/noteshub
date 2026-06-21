# 🚀 Deployment Guide - EngiNotes Hub

Complete guide to deploy your MERN application to production.

---

## 📋 Pre-Deployment Checklist

### ✅ Before You Start:
- [ ] Application tested locally and working
- [ ] MongoDB Atlas cluster created and accessible
- [ ] Cloudinary account set up
- [ ] Google OAuth credentials configured (optional)
- [ ] GitHub repository created
- [ ] Code pushed to GitHub

---

## 🎯 Deployment Stack

| Component | Platform | URL |
|-----------|----------|-----|
| **Frontend** | Vercel | https://vercel.com |
| **Backend** | Render | https://render.com |
| **Database** | MongoDB Atlas | https://cloud.mongodb.com |
| **File Storage** | Cloudinary | https://cloudinary.com |

---

## 📦 Step 1: Prepare Code for Deployment

### 1.1 Update Backend for Production

Create production start script in `server/package.json`:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "seed": "node utils/seeder.js"
  }
}
```

### 1.2 Update CORS for Production

File: `server/server.js`

Make sure CORS allows your production frontend URL:
```javascript
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
```

### 1.3 Create `.gitignore` (if not exists)

```
# Dependencies
node_modules/
.pnp
.pnp.js

# Environment variables
.env
.env.local
.env.production

# Build outputs
dist/
build/

# Logs
*.log
npm-debug.log*

# OS files
.DS_Store
Thumbs.db
```

---

## 🗄️ Step 2: Deploy Database (MongoDB Atlas)

### 2.1 Configure MongoDB Atlas

1. **Login to MongoDB Atlas**: https://cloud.mongodb.com/
2. **Select your cluster** (Cluster0)
3. **Network Access**:
   - Click "Network Access" → "Add IP Address"
   - Select **"Allow Access from Anywhere"** (0.0.0.0/0)
   - Click "Confirm"

4. **Get Connection String**:
   - Click "Database" → "Connect" → "Connect your application"
   - Copy the connection string
   - Format: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/enginotes?retryWrites=true&w=majority`

5. **Seed Production Database** (Optional):
   ```bash
   # Update server/.env with production MongoDB URI
   MONGODB_URI=mongodb+srv://...
   
   # Run seeder
   cd server
   npm run seed
   ```

---

## 🖥️ Step 3: Deploy Backend to Render

### 3.1 Push Code to GitHub

```bash
# Initialize git (if not done)
git init
git add .
git commit -m "Prepare for deployment"

# Create GitHub repository and push
git remote add origin https://github.com/YOUR_USERNAME/enginotes-hub.git
git branch -M main
git push -u origin main
```

### 3.2 Create Render Account

1. Go to https://render.com/
2. Sign up with GitHub
3. Authorize Render to access your repositories

### 3.3 Create New Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `enginotes-hub`
3. Configure the service:

**Settings**:
```
Name: enginotes-hub-api
Region: Choose closest to your users
Branch: main
Root Directory: server
Runtime: Node
Build Command: npm install
Start Command: npm start
Instance Type: Free (or Starter for better performance)
```

### 3.4 Add Environment Variables

Click **"Environment"** tab and add:

```
NODE_ENV=production
PORT=5000

# MongoDB
MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/enginotes?retryWrites=true&w=majority

# JWT Secrets
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_super_secret_refresh_key_min_32_characters
JWT_REFRESH_EXPIRE=30d

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Client URL (will update after deploying frontend)
CLIENT_URL=https://your-app.vercel.app
```

### 3.5 Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. You'll get a URL like: `https://enginotes-hub-api.onrender.com`
4. Test health endpoint: `https://enginotes-hub-api.onrender.com/health`

---

## 🌐 Step 4: Deploy Frontend to Vercel

### 4.1 Update Frontend Environment Variables

Create `client/.env.production`:

```env
VITE_API_URL=https://enginotes-hub-api.onrender.com/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
VITE_SOCKET_URL=https://enginotes-hub-api.onrender.com
```

### 4.2 Create Vercel Account

1. Go to https://vercel.com/
2. Sign up with GitHub
3. Authorize Vercel

### 4.3 Deploy to Vercel

**Method 1: Via Vercel Dashboard**

1. Click **"Add New..."** → **"Project"**
2. Import your GitHub repository: `enginotes-hub`
3. Configure project:

```
Framework Preset: Vite
Root Directory: client
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

4. **Environment Variables** (click "Environment Variables"):
   ```
   VITE_API_URL=https://enginotes-hub-api.onrender.com/api
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   VITE_SOCKET_URL=https://enginotes-hub-api.onrender.com
   ```

5. Click **"Deploy"**
6. Wait for deployment (2-5 minutes)
7. You'll get a URL like: `https://enginotes-hub.vercel.app`

**Method 2: Via Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from client directory
cd client
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? enginotes-hub
# - Directory? ./
# - Override settings? Yes
# - Build command? npm run build
# - Output directory? dist
```

---

## 🔄 Step 5: Update Backend with Frontend URL

1. Go back to **Render Dashboard**
2. Select your backend service
3. Go to **"Environment"** tab
4. Update `CLIENT_URL`:
   ```
   CLIENT_URL=https://enginotes-hub.vercel.app
   ```
5. Click **"Save Changes"**
6. Service will auto-redeploy

---

## 🔐 Step 6: Configure Google OAuth for Production

### 6.1 Update Google Cloud Console

1. Go to https://console.cloud.google.com/
2. Select your project
3. Go to **"APIs & Services"** → **"Credentials"**
4. Edit your OAuth 2.0 Client ID
5. Add **Authorized JavaScript origins**:
   ```
   https://enginotes-hub.vercel.app
   ```
6. Add **Authorized redirect URIs**:
   ```
   https://enginotes-hub.vercel.app
   https://enginotes-hub.vercel.app/auth/callback
   ```
7. Click **"Save"**

---

## 🧪 Step 7: Test Production Deployment

### Test Checklist:

**Backend**:
- [ ] Health endpoint: `https://your-api.onrender.com/health`
- [ ] API responding: `https://your-api.onrender.com/api/notes`
- [ ] MongoDB connected (check Render logs)
- [ ] Cloudinary uploads working
- [ ] Email sending working

**Frontend**:
- [ ] Website loads: `https://your-app.vercel.app`
- [ ] Register new user
- [ ] Login works
- [ ] Upload note (test Cloudinary)
- [ ] Download note
- [ ] Create discussion
- [ ] Join study group
- [ ] Admin panel accessible
- [ ] Dark mode works
- [ ] Responsive on mobile

**Integration**:
- [ ] Frontend can call backend APIs
- [ ] CORS working properly
- [ ] Socket.IO connected
- [ ] File uploads work
- [ ] Email verification sent
- [ ] Google OAuth works

---

## 📊 Step 8: Monitor and Maintain

### Render Dashboard:
- View logs: Click service → "Logs" tab
- Monitor metrics: CPU, Memory, Response time
- Auto-deploys: On every git push to main branch

### Vercel Dashboard:
- View deployments: Click project → "Deployments"
- Analytics: Click "Analytics" tab
- Logs: Click deployment → "Runtime Logs"

### MongoDB Atlas:
- Monitor connections: "Metrics" tab
- Database size: "Collections" tab
- Performance: "Performance Advisor"

---

## 🐛 Troubleshooting

### Backend Issues:

**Problem**: Service crashes on startup
```bash
# Solution: Check Render logs
# Common issues:
# 1. Wrong MongoDB URI
# 2. Missing environment variables
# 3. Port conflicts (use process.env.PORT)
```

**Problem**: MongoDB connection fails
```bash
# Solution:
# 1. Check MongoDB Atlas Network Access (allow 0.0.0.0/0)
# 2. Verify connection string in environment variables
# 3. Check MongoDB Atlas cluster status
```

**Problem**: 500 errors on API calls
```bash
# Solution: Check Render logs for error details
# Common causes:
# 1. Missing environment variables
# 2. Cloudinary credentials incorrect
# 3. Database connection lost
```

### Frontend Issues:

**Problem**: API calls fail (CORS errors)
```bash
# Solution:
# 1. Update CLIENT_URL in backend environment
# 2. Redeploy backend
# 3. Clear browser cache
```

**Problem**: Environment variables not working
```bash
# Solution:
# 1. Ensure variables start with VITE_
# 2. Redeploy frontend after adding variables
# 3. Check Vercel project settings → Environment Variables
```

**Problem**: 404 on page refresh
```bash
# Solution: Vercel handles this automatically
# If issue persists, check vercel.json rewrites
```

---

## 🔄 Continuous Deployment

Both Vercel and Render auto-deploy on git push:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Automatic deployments:
# - Vercel: Frontend deploys automatically
# - Render: Backend deploys automatically
# - Takes 2-5 minutes each
```

---

## 💰 Cost Estimate

### Free Tier (Recommended for Start):

| Service | Free Tier | Limits |
|---------|-----------|--------|
| **Vercel** | Free | 100GB bandwidth/month |
| **Render** | Free | 750 hours/month, sleeps after inactivity |
| **MongoDB Atlas** | Free | 512MB storage, shared cluster |
| **Cloudinary** | Free | 25 GB storage, 25 GB bandwidth/month |

**Total**: $0/month ✅

### Paid Tier (For Production Scale):

| Service | Cost | Features |
|---------|------|----------|
| **Vercel Pro** | $20/month | Unlimited bandwidth, better performance |
| **Render Starter** | $7/month | Always-on, faster instances |
| **MongoDB Atlas M10** | $57/month | Dedicated cluster, backups |
| **Cloudinary Plus** | $89/month | 150GB storage, 300GB bandwidth |

**Total**: ~$173/month for professional setup

---

## 🎯 Production Optimization

### Backend Optimizations:

1. **Enable Compression**:
```javascript
const compression = require('compression');
app.use(compression());
```

2. **Add Response Caching**:
```javascript
app.use((req, res, next) => {
  res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
  next();
});
```

3. **Database Indexing** (already done in models)

### Frontend Optimizations:

1. **Lazy Loading** (already implemented)
2. **Image Optimization** via Cloudinary
3. **Code Splitting** (Vite handles this)

---

## ✅ Deployment Complete!

### Your Live URLs:
- **Frontend**: https://enginotes-hub.vercel.app
- **Backend**: https://enginotes-hub-api.onrender.com
- **API Docs**: https://enginotes-hub-api.onrender.com/health

### Admin Access:
- **URL**: https://enginotes-hub.vercel.app/admin
- **Email**: admin@enginotes.com
- **Password**: admin123

**🎉 Congratulations! Your app is live!**

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Setup](https://www.mongodb.com/docs/atlas/)
- [Cloudinary Integration](https://cloudinary.com/documentation)

---

## 🔒 Security Reminders

1. **Change default admin password** after first login
2. **Rotate JWT secrets** periodically
3. **Enable 2FA** on all service accounts
4. **Monitor logs** for suspicious activity
5. **Keep dependencies updated**: `npm audit fix`
6. **Use strong passwords** for all accounts
7. **Enable MongoDB Atlas backups**

**Your application is production-ready! 🚀**
