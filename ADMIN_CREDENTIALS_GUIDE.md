# 👑 Admin Credentials Guide

How to set your own admin email and password.

---

## 🎯 Quick Method - Change in Seeder

### Step 1: Edit the Seeder File

**File**: `server/utils/seeder.js`

**Find this section** (around line 119):

```javascript
// Create admin user
const admin = await User.create({
  name: 'Admin User',                    // ← Change this
  email: 'admin@enginotes.com',          // ← Change this
  password: 'admin123',                  // ← Change this
  role: 'admin',
  branch: 'IT',
  year: 'Final',
  isEmailVerified: true,
  contributionScore: 500,
  badges: [
    { name: 'First Upload', icon: '📝' },
    { name: 'Top Contributor', icon: '🏆' },
    { name: 'Scholar', icon: '🎓' },
  ]
});
```

### Step 2: Update Admin Details

**Change to your details**:

```javascript
// Create admin user
const admin = await User.create({
  name: 'Your Full Name',               // ← Your name
  email: 'your.email@example.com',      // ← Your email
  password: 'YourSecurePassword123!',   // ← Your password
  role: 'admin',
  branch: 'IT',                          // ← Your branch
  year: 'Final',                         // ← Your year
  isEmailVerified: true,
  contributionScore: 500,
  badges: [
    { name: 'First Upload', icon: '📝' },
    { name: 'Top Contributor', icon: '🏆' },
    { name: 'Scholar', icon: '🎓' },
  ]
});
```

### Step 3: Re-run the Seeder

```bash
cd server
node utils/seeder.js
```

**Output**:
```
✅ Database seeded successfully!
📧 Admin login: your.email@example.com
🔑 Admin password: YourSecurePassword123!
```

### Step 4: Login with New Credentials

1. Go to: http://localhost:5173/login
2. Email: **your.email@example.com**
3. Password: **YourSecurePassword123!**
4. Access admin panel: http://localhost:5173/admin

---

## 🔐 Method 2: Change Password After Login

If you've already seeded the database:

### Option A: Via Profile Page

1. Login with current admin credentials
2. Go to **Profile** → **Change Password**
3. Enter old password: `admin123`
4. Enter new password
5. Save

### Option B: Via Database (MongoDB Compass/Atlas)

1. Open MongoDB Compass or Atlas
2. Find `users` collection
3. Find document with `role: "admin"`
4. Update `email` and/or regenerate password hash

**To generate password hash**:

```javascript
// In Node.js console or create a script
const bcrypt = require('bcryptjs');
const hash = await bcrypt.hash('YourNewPassword', 12);
console.log(hash); // Copy this hash to MongoDB
```

---

## 📋 Complete Example

### Before (Default):
```javascript
{
  name: 'Admin User',
  email: 'admin@enginotes.com',
  password: 'admin123',
  role: 'admin'
}
```

### After (Your Custom Admin):
```javascript
{
  name: 'Gorakh Hembade',
  email: 'gorakhahembade@gmail.com',
  password: 'MySecurePassword123!',
  role: 'admin'
}
```

---

## 🔄 Full Steps to Change Admin

### 1. Edit Seeder
**File**: `server/utils/seeder.js`

```javascript
const admin = await User.create({
  name: 'Gorakh Hembade',                     // Your name
  email: 'gorakhahembade@gmail.com',          // Your email
  password: 'YourPassword123!',               // Your password
  role: 'admin',
  branch: 'IT',
  year: 'Final',
  isEmailVerified: true,
  contributionScore: 500,
  badges: [
    { name: 'First Upload', icon: '📝' },
    { name: 'Top Contributor', icon: '🏆' },
    { name: 'Scholar', icon: '🎓' },
  ]
});
```

### 2. Clear Old Data & Reseed

```bash
# In server directory
cd server

# Run seeder (this will delete old admin and create new one)
node utils/seeder.js
```

### 3. Login with New Credentials

- URL: http://localhost:5173/login
- Email: Your new email
- Password: Your new password

### 4. Verify Admin Access

- Go to: http://localhost:5173/admin
- Should see admin dashboard ✅

---

## 🔒 Password Security Tips

### Use Strong Passwords:
- ✅ At least 12 characters
- ✅ Mix of uppercase and lowercase
- ✅ Include numbers and symbols
- ✅ Not common words or patterns

### Examples:
- ❌ Weak: `admin123`, `password`, `123456`
- ✅ Strong: `MyAdmin@2024!Secure`, `EngiNotes#Admin99`

---

## 🎯 Multiple Admins

Want multiple admin accounts? Add more in the seeder:

```javascript
// Create multiple admins
const admin1 = await User.create({
  name: 'Primary Admin',
  email: 'admin1@enginotes.com',
  password: 'SecurePass123!',
  role: 'admin',
  // ... other fields
});

const admin2 = await User.create({
  name: 'Secondary Admin',
  email: 'admin2@enginotes.com',
  password: 'AnotherPass456!',
  role: 'admin',
  // ... other fields
});
```

---

## 🐛 Troubleshooting

### Issue 1: "Email already exists"

**Solution**: The seeder clears all data first. If you see this error:
```bash
# Clear database manually
# In MongoDB Compass/Atlas: Delete all documents in 'users' collection
# Or run seeder again (it clears automatically)
node utils/seeder.js
```

### Issue 2: Can't login with new credentials

**Check**:
1. Did you run the seeder after editing?
2. Is the password at least 6 characters?
3. Did you use the correct email format?
4. Check server logs for errors

### Issue 3: Old admin still exists

**Solution**:
```bash
# Seeder deletes ALL users before creating new ones
# Make sure you ran: node utils/seeder.js
# Check MongoDB to verify old admin is gone
```

---

## 📊 After Changing Admin

### What Changes:
- ✅ Admin email changed
- ✅ Admin password changed  
- ✅ Admin name changed
- ✅ Can login with new credentials
- ✅ Admin panel accessible

### What Stays Same:
- ✅ Admin role (still admin)
- ✅ Admin privileges
- ✅ Sample notes and data
- ✅ All other users

---

## ✅ Verification Checklist

After changing admin credentials:

- [ ] Edited `server/utils/seeder.js`
- [ ] Changed name, email, password
- [ ] Ran `node utils/seeder.js`
- [ ] Saw success message
- [ ] Can login with new email
- [ ] New password works
- [ ] Can access `/admin` panel
- [ ] Old credentials don't work

---

## 🚀 For Production

Before deploying to production:

1. **Change admin credentials** in seeder
2. **Use strong password** (not admin123!)
3. **Use real email** (for password reset)
4. **Run seeder** on production database ONCE
5. **Delete seeder** or protect it (optional)

---

## 📝 Summary

### Change Admin Email/Password:

**File**: `server/utils/seeder.js` (line ~119)

**Change**:
```javascript
email: 'admin@enginotes.com',     // ← Your email
password: 'admin123',             // ← Your password
```

**Re-run**:
```bash
cd server
node utils/seeder.js
```

**Login**:
- URL: http://localhost:5173/login
- Use your new credentials

**Done! You have a new admin account! 👑**
