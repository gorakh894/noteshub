# 🔗 URL Configuration Guide

Complete guide for configuring frontend and backend URLs.

---

## 📍 Where to Change URLs

### 1️⃣ **Backend URL (Frontend connects to Backend)**

**File**: `client/.env`

```env
# Change these to point to your backend
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

**For Production** (after deploying backend):
```env
VITE_API_URL=https://your-backend.onrender.com/api
VITE_SOCKET_URL=https://your-backend.onrender.com
```

---

### 2️⃣ **Frontend URL (Backend allows Frontend)**

**File**: `server/.env`

```env
# Change this to your frontend URL
CLIENT_URL=http://localhost:5173
```

**For Production** (after deploying frontend):
```env
CLIENT_URL=https://your-app.vercel.app
```

---

## 🔄 Complete Configuration Table

| Environment | Frontend URL | Backend URL | Where to Configure |
|-------------|-------------|-------------|-------------------|
| **Local Dev** | http://localhost:5173 | http://localhost:5000 | Already set! ✅ |
| **Production** | https://your-app.vercel.app | https://your-api.onrender.com | Update after deployment |

---

## 📝 Step-by-Step Configuration

### For Local Development (Current Setup ✅)

**Frontend** (`client/.env`):
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

**Backend** (`server/.env`):
```env
CLIENT_URL=http://localhost:5173
MONGODB_URI=your_mongodb_uri
# ... other variables
```

**Status**: ✅ Already configured for local development!

---

### For Production (After Deployment)

**Step 1: Deploy Backend to Render**
- You'll get URL like: `https://enginotes-hub-api.onrender.com`

**Step 2: Update Frontend Environment**

Create `client/.env.production`:
```env
VITE_API_URL=https://enginotes-hub-api.onrender.com/api
VITE_SOCKET_URL=https://enginotes-hub-api.onrender.com
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

**Or in Vercel Dashboard**:
- Go to Project Settings → Environment Variables
- Add:
  - `VITE_API_URL` = `https://your-backend.onrender.com/api`
  - `VITE_SOCKET_URL` = `https://your-backend.onrender.com`

**Step 3: Update Backend Environment**

In Render Dashboard:
- Go to your service → Environment
- Update `CLIENT_URL` = `https://your-app.vercel.app`
- Save (will auto-redeploy)

---

## ✅ How to Confirm Connection

### Method 1: Browser Console

1. **Open your frontend**: http://localhost:5173
2. **Press F12** (open DevTools)
3. **Go to Console tab**
4. **Look for**:
   - ✅ No CORS errors
   - ✅ No "Network Error" messages
   - ✅ API calls succeeding (200 status)

### Method 2: Network Tab

1. **Open DevTools** (F12)
2. **Go to Network tab**
3. **Try to login or browse notes**
4. **Check requests**:
   - ✅ Requests going to `http://localhost:5000/api/...`
   - ✅ Status: 200 (success) or 401 (auth required - normal)
   - ❌ Status: 500 (server error)
   - ❌ Failed to fetch (connection issue)

### Method 3: Test API Directly

Open browser and visit:
```
http://localhost:5000/health
```

**Should see**:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Method 4: Test Frontend API Call

**Open browser console** (F12) on your frontend and run:
```javascript
fetch('http://localhost:5000/api/notes')
  .then(r => r.json())
  .then(data => console.log('✅ Connected! Data:', data))
  .catch(err => console.error('❌ Connection failed:', err))
```

**Should see**: Notes data or empty array (if no notes yet)

---

## 🧪 Connection Test Checklist

### Local Development:

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Can visit http://localhost:5000/health (shows OK)
- [ ] Can visit http://localhost:5173 (frontend loads)
- [ ] No CORS errors in browser console
- [ ] Login/register attempts reach backend
- [ ] MongoDB connected (check backend terminal)

### Production:

- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] `VITE_API_URL` points to Render backend
- [ ] `CLIENT_URL` points to Vercel frontend
- [ ] Can visit backend health endpoint
- [ ] Frontend loads without errors
- [ ] API calls working (test login)
- [ ] No CORS errors

---

## 🐛 Common Connection Issues

### Issue 1: CORS Error

**Error in Console**:
```
Access to fetch at 'http://localhost:5000/api/notes' from origin 
'http://localhost:5173' has been blocked by CORS policy
```

**Solution**:
1. Check `server/.env` has `CLIENT_URL=http://localhost:5173`
2. Restart backend server
3. Clear browser cache

---

### Issue 2: Network Error / Failed to Fetch

**Error**: `TypeError: Failed to fetch`

**Solution**:
1. **Check backend is running**:
   ```bash
   curl http://localhost:5000/health
   ```
2. **Check frontend .env**:
   - Make sure `VITE_API_URL=http://localhost:5000/api`
3. **Restart frontend** (Vite needs restart for .env changes)

---

### Issue 3: 404 Not Found

**Error**: `GET http://localhost:5000/api/notes 404`

**Solution**:
1. Backend routes not loaded properly
2. Check backend terminal for errors
3. Restart backend server

---

### Issue 4: Connection Refused

**Error**: `ERR_CONNECTION_REFUSED`

**Solution**:
1. **Backend not running** - start it:
   ```bash
   cd server
   npm run dev
   ```
2. **Wrong port** - check `server/.env` has `PORT=5000`

---

## 🔍 Quick Diagnostics

### Check Current Configuration:

**Frontend**:
```bash
cd client
cat .env
# Should show: VITE_API_URL=http://localhost:5000/api
```

**Backend**:
```bash
cd server
cat .env | grep CLIENT_URL
# Should show: CLIENT_URL=http://localhost:5173
```

### Test Backend Health:

```bash
# Using curl
curl http://localhost:5000/health

# Using browser
# Visit: http://localhost:5000/health
```

**Expected**: `{"status":"OK","timestamp":"..."}`

### Test Frontend Environment:

Open browser console on http://localhost:5173 and run:
```javascript
console.log('API URL:', import.meta.env.VITE_API_URL)
console.log('Socket URL:', import.meta.env.VITE_SOCKET_URL)
```

**Expected**:
```
API URL: http://localhost:5000/api
Socket URL: http://localhost:5000
```

---

## 📊 Connection Status Check

### ✅ Everything Connected Properly:

**Frontend Console**:
- No errors
- API calls succeeding
- Data loading

**Backend Terminal**:
```
✅ Server running in development mode on port 5000
✅ MongoDB Connected: cluster0...
```

**Browser**:
- Website loads
- Can browse notes (even if empty)
- Can see login/register forms
- No red errors in console

---

### ❌ Connection Issues:

**Signs of Problems**:
- CORS errors in console
- "Network Error" messages
- API calls timing out
- 500 Internal Server Error
- Backend not responding
- MongoDB not connected

**Fix**:
1. Stop both servers (Ctrl+C)
2. Check environment variables
3. Restart backend first: `cd server && npm run dev`
4. Then frontend: `cd client && npm run dev`
4. Clear browser cache
5. Test health endpoint
6. Try again

---

## 🎯 Summary

### Local Development URLs:
```
Frontend: http://localhost:5173
Backend:  http://localhost:5000
API:      http://localhost:5000/api
Health:   http://localhost:5000/health
```

### Configuration Files:
```
Frontend URL → server/.env (CLIENT_URL)
Backend URL  → client/.env (VITE_API_URL, VITE_SOCKET_URL)
```

### Test Connection:
```bash
# 1. Test backend health
curl http://localhost:5000/health

# 2. Open frontend
http://localhost:5173

# 3. Check browser console (F12)
# Should have no CORS errors
```

---

## 🚀 For Production

After deployment:

1. **Get URLs from deployment**:
   - Backend: `https://your-api.onrender.com`
   - Frontend: `https://your-app.vercel.app`

2. **Update Vercel** (Frontend):
   - Add env var: `VITE_API_URL=https://your-api.onrender.com/api`

3. **Update Render** (Backend):
   - Add env var: `CLIENT_URL=https://your-app.vercel.app`

4. **Test production connection**:
   - Visit: `https://your-api.onrender.com/health`
   - Visit: `https://your-app.vercel.app`
   - Check browser console for errors

---

## ✅ Connection Confirmed!

When everything works:
- ✅ Backend health endpoint responds
- ✅ Frontend loads without errors
- ✅ No CORS errors
- ✅ Can see notes (or empty state)
- ✅ Login/register forms appear
- ✅ API calls visible in Network tab

**You're all connected! 🎉**
