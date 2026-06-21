# 🚀 Deployment Checklist

Quick reference checklist for deploying EngiNotes Hub to production.

---

## ✅ Pre-Deployment (Do This First)

- [ ] Test application locally - everything works
- [ ] MongoDB Atlas account created
- [ ] MongoDB IP whitelist: 0.0.0.0/0 (allow all)
- [ ] Cloudinary account set up
- [ ] Google OAuth configured (optional)
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] All sensitive data in `.env` files (not in code)

---

## 🗄️ Database Setup

- [ ] MongoDB Atlas cluster created
- [ ] Network Access configured (0.0.0.0/0)
- [ ] Database user created with read/write permissions
- [ ] Connection string copied
- [ ] Test connection from local machine
- [ ] (Optional) Seed production database

---

## 🖥️ Backend Deployment (Render)

### Account Setup
- [ ] Render account created (https://render.com)
- [ ] GitHub connected to Render
- [ ] Repository authorized

### Service Configuration
- [ ] New Web Service created
- [ ] Repository: `enginotes-hub` connected
- [ ] Root Directory: `server`
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`
- [ ] Instance Type: Free or Starter

### Environment Variables
- [ ] `NODE_ENV=production`
- [ ] `PORT=5000`
- [ ] `MONGODB_URI` (from Atlas)
- [ ] `JWT_SECRET` (32+ chars)
- [ ] `JWT_EXPIRE=7d`
- [ ] `JWT_REFRESH_SECRET` (32+ chars)
- [ ] `JWT_REFRESH_EXPIRE=30d`
- [ ] `GOOGLE_CLIENT_ID`
- [ ] `GOOGLE_CLIENT_SECRET`
- [ ] `CLOUDINARY_CLOUD_NAME`
- [ ] `CLOUDINARY_API_KEY`
- [ ] `CLOUDINARY_API_SECRET`
- [ ] `EMAIL_HOST=smtp.gmail.com`
- [ ] `EMAIL_PORT=587`
- [ ] `EMAIL_USER`
- [ ] `EMAIL_PASS` (Gmail app password)
- [ ] `CLIENT_URL` (will update after frontend deploy)

### Deployment
- [ ] Click "Create Web Service"
- [ ] Wait for build to complete (5-10 min)
- [ ] Service URL noted: `https://your-api.onrender.com`
- [ ] Test health endpoint: `/health`
- [ ] Check logs for errors
- [ ] Verify MongoDB connection in logs

---

## 🌐 Frontend Deployment (Vercel)

### Account Setup
- [ ] Vercel account created (https://vercel.com)
- [ ] GitHub connected to Vercel
- [ ] Repository authorized

### Project Configuration
- [ ] New Project created
- [ ] Repository: `enginotes-hub` imported
- [ ] Framework: Vite
- [ ] Root Directory: `client`
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`

### Environment Variables
- [ ] `VITE_API_URL` (Render backend URL + `/api`)
- [ ] `VITE_GOOGLE_CLIENT_ID`
- [ ] `VITE_SOCKET_URL` (Render backend URL)

### Deployment
- [ ] Click "Deploy"
- [ ] Wait for build (2-5 min)
- [ ] Frontend URL noted: `https://your-app.vercel.app`
- [ ] Website loads successfully
- [ ] No console errors

---

## 🔄 Update Backend with Frontend URL

- [ ] Go to Render dashboard
- [ ] Open backend service
- [ ] Environment tab
- [ ] Update `CLIENT_URL` with Vercel URL
- [ ] Save changes
- [ ] Wait for redeploy
- [ ] Test CORS - API calls from frontend work

---

## 🔐 Google OAuth (Optional)

- [ ] Google Cloud Console opened
- [ ] OAuth Client ID selected
- [ ] Authorized JavaScript origins added:
  - `https://your-app.vercel.app`
- [ ] Authorized redirect URIs added:
  - `https://your-app.vercel.app`
  - `https://your-app.vercel.app/auth/callback`
- [ ] Changes saved
- [ ] Test Google Sign-In

---

## 🧪 Testing Production

### Backend Tests
- [ ] Health endpoint responds: `GET /health`
- [ ] Notes API works: `GET /api/notes`
- [ ] MongoDB connected (check logs)
- [ ] No errors in Render logs
- [ ] API response time acceptable

### Frontend Tests
- [ ] Homepage loads
- [ ] Registration works
- [ ] Login works
- [ ] Dashboard loads
- [ ] Upload note works
- [ ] Download note works
- [ ] Browse notes works
- [ ] Create discussion works
- [ ] Admin panel accessible
- [ ] Dark mode toggle works
- [ ] Mobile responsive

### Integration Tests
- [ ] API calls succeed (no CORS errors)
- [ ] File upload to Cloudinary works
- [ ] Email verification sent
- [ ] Socket.IO connects
- [ ] Real-time features work
- [ ] Notifications appear
- [ ] Search functionality works
- [ ] Filters work properly

---

## 📊 Monitoring Setup

### Render
- [ ] Logs accessible
- [ ] Metrics viewed
- [ ] Auto-deploy configured
- [ ] Alerts set up (optional)

### Vercel
- [ ] Deployments visible
- [ ] Analytics configured
- [ ] Domain added (optional)
- [ ] Preview deployments enabled

### MongoDB Atlas
- [ ] Metrics dashboard checked
- [ ] Backup configured (optional)
- [ ] Alerts set up (optional)

---

## 🔒 Security

- [ ] Default admin password changed
- [ ] Strong passwords used everywhere
- [ ] 2FA enabled on all services
- [ ] `.env` files in `.gitignore`
- [ ] No secrets in repository
- [ ] HTTPS enabled (auto on Vercel/Render)
- [ ] MongoDB network access secured
- [ ] API rate limiting enabled

---

## 📝 Documentation

- [ ] Production URLs documented
- [ ] Admin credentials saved securely
- [ ] Environment variables backed up (securely)
- [ ] Deployment process documented
- [ ] Team members informed

---

## 🎯 Post-Deployment

- [ ] Test with real users
- [ ] Monitor error logs daily
- [ ] Check performance metrics
- [ ] Gather user feedback
- [ ] Plan improvements
- [ ] Set up CI/CD (optional)
- [ ] Configure custom domain (optional)
- [ ] Set up email notifications for errors

---

## 🚨 Rollback Plan

If deployment fails:
- [ ] Vercel: Rollback to previous deployment (one click)
- [ ] Render: Rollback via git revert and push
- [ ] MongoDB: Restore from backup if needed
- [ ] Test rollback before issues arise

---

## 📞 Support Resources

- **Vercel Support**: https://vercel.com/support
- **Render Support**: https://render.com/docs/support
- **MongoDB Support**: https://www.mongodb.com/support
- **Cloudinary Support**: https://support.cloudinary.com/

---

## ✅ Deployment Complete!

**Production URLs**:
- Frontend: `https://______________.vercel.app`
- Backend: `https://______________.onrender.com`
- Admin: `https://______________.vercel.app/admin`

**Admin Access**:
- Email: `admin@enginotes.com`
- Password: `admin123` *(change this!)*

**Status**: 🎉 **LIVE IN PRODUCTION!**

---

## 📈 Next Steps

1. Share with users
2. Monitor usage
3. Collect feedback
4. Fix bugs
5. Add features
6. Scale as needed

**Congratulations on your deployment! 🚀**
