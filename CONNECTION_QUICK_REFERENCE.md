# 🔗 Connection Quick Reference

## 📍 Where to Change URLs

### Change Backend URL (Frontend → Backend)
**File**: `client/.env`
```env
VITE_API_URL=http://localhost:5000/api     # For local
# VITE_API_URL=https://your-api.onrender.com/api  # For production
```

### Change Frontend URL (Backend allows Frontend)
**File**: `server/.env`
```env
CLIENT_URL=http://localhost:5173           # For local
# CLIENT_URL=https://your-app.vercel.app   # For production
```

---

## ✅ Test Connection (5 seconds)

### 1. Check Backend is Running
Open browser: http://localhost:5000/health

**Expected**: 
```json
{"status":"OK","timestamp":"..."}
```

### 2. Check Frontend is Running
Open browser: http://localhost:5173

**Expected**: Website loads

### 3. Check Console for Errors
Press **F12** → **Console** tab

**Expected**: 
- ✅ No red CORS errors
- ✅ No "Network Error"
- ✅ No "Failed to fetch"

### 4. Test API Call
In browser console (F12), paste:
```javascript
fetch('http://localhost:5000/api/notes').then(r=>r.json()).then(d=>console.log('✅ Connected!',d)).catch(e=>console.log('❌ Error:',e))
```

**Expected**: `✅ Connected!` with data

---

## 🎯 Current Configuration

### Local Development (Default):
```
Frontend: http://localhost:5173
Backend:  http://localhost:5000
Status:   ✅ Working
```

### Files Already Configured:
- ✅ `client/.env` → Points to localhost:5000
- ✅ `server/.env` → Allows localhost:5173

**No changes needed for local development!**

---

## 🚀 For Production

After deploying:

### Update Frontend (Vercel):
```env
VITE_API_URL=https://YOUR-API.onrender.com/api
```

### Update Backend (Render):
```env
CLIENT_URL=https://YOUR-APP.vercel.app
```

---

## 🐛 Connection Not Working?

### Quick Fix:
```bash
# 1. Stop both servers (Ctrl+C)
# 2. Restart backend
cd server
npm run dev

# 3. Restart frontend (new terminal)
cd client  
npm run dev

# 4. Clear browser cache (Ctrl+Shift+Delete)
# 5. Test: http://localhost:5000/health
```

---

## 📊 Connection Status

**Check your browser console right now:**

✅ **Connected**: No errors, API calls work
❌ **Not Connected**: CORS errors or "Failed to fetch"

**All working? You're ready to deploy! 🎉**
