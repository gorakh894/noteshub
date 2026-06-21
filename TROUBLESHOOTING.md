# Troubleshooting Guide

## MongoDB Atlas Connection Issues

### Problem: Server crashes with DNS or connection errors

**Error Messages:**
- `querySrv ENOTFOUND _mongodb._tcp.cluster.mongodb.net`
- `Could not connect to any servers in your MongoDB Atlas cluster`
- IP whitelist error

### Solutions:

#### Option 1: Fix MongoDB Atlas IP Whitelist (Recommended)

1. **Login to MongoDB Atlas**
   - Go to https://cloud.mongodb.com/
   - Sign in with your account

2. **Add IP to Whitelist**
   - Click on "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Choose one of:
     - **"Add Current IP Address"** - Adds your current IP
     - **"Allow Access from Anywhere"** - Adds 0.0.0.0/0 (for testing only)
   - Click "Confirm"

3. **Wait 2-3 minutes** for changes to propagate

4. **Restart the server**
   ```bash
   cd server
   npm run dev
   ```

#### Option 2: Use Local MongoDB

1. **Download MongoDB Community Server**
   - Windows: https://www.mongodb.com/try/download/community
   - Install with default settings
   - MongoDB Compass (GUI) will be installed automatically

2. **Start MongoDB Service**
   - Windows: Starts automatically as a service
   - Or run: `mongod` in terminal

3. **Update Environment Variable**
   - Edit `server/.env`
   - Change the MONGODB_URI line to:
   ```
   MONGODB_URI=mongodb://localhost:27017/enginotes
   ```

4. **Restart the server**
   ```bash
   cd server
   npm run dev
   ```

#### Option 3: Check Network/Firewall

- **Corporate Networks**: May block MongoDB ports (27017)
- **VPN**: Try disconnecting/connecting VPN
- **Antivirus/Firewall**: May need to allow Node.js connections
- **DNS Issues**: Try switching DNS servers (Google DNS: 8.8.8.8)

## Server Not Starting

### Check if port 5000 is in use:
```bash
# Windows
netstat -ano | findstr :5000

# If occupied, kill the process or change PORT in .env
```

### Node modules issues:
```bash
cd server
rm -rf node_modules package-lock.json
npm install
```

## Client Build Errors

### Clear cache and reinstall:
```bash
cd client
rm -rf node_modules package-lock.json dist
npm install
npm run dev
```

### Vite port conflict:
```bash
# Change port in vite.config.js or kill process on port 5173
netstat -ano | findstr :5173
```

## Google OAuth Not Working

1. **Check Google Console**
   - Verify redirect URIs include: `http://localhost:5173`
   - OAuth consent screen is configured

2. **Update credentials in `.env` files**
   - Same GOOGLE_CLIENT_ID in both server/.env and client/.env
   - GOOGLE_CLIENT_SECRET only in server/.env

## Cloudinary Upload Fails

1. **Verify credentials** in `server/.env`:
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

2. **Check Cloudinary dashboard**: https://cloudinary.com/console

3. **File size limits**: Default is 10MB (configurable in server.js)

## Email Verification Not Working

### Gmail SMTP Setup:

1. **Enable 2-Factor Authentication** on your Google Account

2. **Generate App Password**:
   - Go to: https://myaccount.google.com/security
   - Select "2-Step Verification"
   - Scroll down to "App passwords"
   - Generate password for "Mail" app
   - Use this password in `EMAIL_PASS` (not your regular password)

3. **Update server/.env**:
   ```
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your.email@gmail.com
   EMAIL_PASS=your_16_char_app_password
   ```

## CORS Errors

If you see CORS errors in browser console:

1. **Check CLIENT_URL** in `server/.env`:
   ```
   CLIENT_URL=http://localhost:5173
   ```

2. **Check VITE_API_URL** in `client/.env`:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Restart both servers** after changing .env files

## Socket.IO Connection Failed

1. **Verify VITE_SOCKET_URL** in `client/.env`:
   ```
   VITE_SOCKET_URL=http://localhost:5000
   ```

2. **Check server logs** for Socket.IO initialization

3. **Browser console** should show socket connection status

## Database Seeding

After MongoDB connects successfully:

```bash
cd server
npm run seed
```

This creates sample:
- Admin user (admin@enginotes.com / Admin@123)
- Regular users
- Sample notes
- Question papers
- Discussions
- Study groups

## Common Issues Checklist

- [ ] Node.js version >= 18
- [ ] Both .env files configured
- [ ] MongoDB connection working
- [ ] No port conflicts
- [ ] Cloudinary credentials valid
- [ ] Google OAuth credentials configured
- [ ] Network/firewall not blocking connections
- [ ] Both dev servers running

## Getting Help

1. Check browser console for errors
2. Check server terminal for error logs
3. Check MongoDB Atlas connection status
4. Verify all environment variables
5. Try the health endpoint: http://localhost:5000/health

## Production Deployment Issues

### Vercel (Frontend)

- Ensure `VITE_API_URL` points to production backend
- Add all environment variables in Vercel dashboard
- Set build command: `npm run build`
- Set output directory: `dist`

### Render (Backend)

- Add all environment variables in Render dashboard
- Use production MongoDB Atlas cluster
- Add Render IP to MongoDB whitelist
- Set build command: `npm install`
- Set start command: `npm start`

## Still Having Issues?

Create an issue with:
- Error message (full stack trace)
- Node.js version (`node --version`)
- Operating system
- Steps to reproduce
- Screenshots if applicable
