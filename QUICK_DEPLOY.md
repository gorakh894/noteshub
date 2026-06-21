# ⚡ Quick Deploy Guide

The fastest way to deploy EngiNotes Hub to production.

---

## 🚀 5-Minute Deployment

### Prerequisites
- GitHub account
- Vercel account (free)
- Render account (free)
- MongoDB Atlas cluster running

---

## Step 1: Push to GitHub (2 minutes)

```bash
# In your project root
git init
git add .
git commit -m "Initial commit"

# Create new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/enginotes-hub.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy Backend to Render (2 minutes)

1. Go to https://render.com/
2. **New +** → **Web Service**
3. Connect GitHub → Select `enginotes-hub`
4. **Configure**:
   - Root Directory: `server`
   - Build: `npm install`
   - Start: `npm start`
5. **Add Environment Variables** (copy-paste):

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=YOUR_MONGODB_URI_HERE
JWT_SECRET=generate_a_32_character_secret_key_here
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=generate_another_32_character_secret
JWT_REFRESH_EXPIRE=30d
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
CLIENT_URL=https://WILL_UPDATE_AFTER_FRONTEND_DEPLOY
```

6. **Create Web Service**
7. **Copy your API URL**: `https://enginotes-hub-api.onrender.com`

---

## Step 3: Deploy Frontend to Vercel (1 minute)

1. Go to https://vercel.com/
2. **New Project** → Import `enginotes-hub`
3. **Configure**:
   - Root Directory: `client`
   - Framework: Vite
   - Build: `npm run build`
   - Output: `dist`
4. **Add Environment Variables**:

```env
VITE_API_URL=https://YOUR_RENDER_URL.onrender.com/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_SOCKET_URL=https://YOUR_RENDER_URL.onrender.com
```

5. **Deploy**
6. **Copy your Frontend URL**: `https://enginotes-hub.vercel.app`

---

## Step 4: Update Backend CLIENT_URL

1. Go back to **Render**
2. Select your backend service
3. **Environment** tab
4. Update: `CLIENT_URL=https://your-vercel-url.vercel.app`
5. **Save** (auto-redeploys)

---

## ✅ Done! Test Your App

Visit: `https://your-app.vercel.app`

**Admin Login**:
- Email: `admin@enginotes.com`
- Password: `admin123`

---

## 🔧 Generate Secrets

### JWT Secret (Node.js):
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Or use online:
- https://randomkeygen.com/
- Select "CodeIgniter Encryption Keys" (256-bit)

---

## 🐛 Common Issues

**Backend won't start?**
- Check Render logs
- Verify MongoDB URI is correct
- Ensure all environment variables are set

**Frontend can't connect to backend?**
- Check VITE_API_URL has `/api` at the end
- Verify CLIENT_URL in backend matches Vercel URL
- Wait for backend redeploy after updating CLIENT_URL

**CORS errors?**
- Update CLIENT_URL in Render
- Redeploy backend
- Clear browser cache

---

## 📱 Share Your App

Your app is live at:
- **Frontend**: https://your-app.vercel.app
- **API**: https://your-api.onrender.com
- **Admin**: https://your-app.vercel.app/admin

**Total Time**: ~5-10 minutes ⚡

---

## 🎯 Next Steps

1. ✅ Change admin password
2. ✅ Configure Google OAuth redirect URIs
3. ✅ Test all features
4. ✅ Invite users
5. ✅ Monitor logs

**Your app is LIVE! 🎉**
