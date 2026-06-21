# 📤 Push to GitHub - Step by Step

## 🎯 Prerequisites

- [x] GitHub account created
- [x] Git installed on your computer
- [ ] GitHub repository created (we'll do this together)

---

## 📝 Step 1: Initialize Git Repository

Open terminal in your project root (`enginotes-hub` folder) and run:

```bash
git init
```

**Output**: `Initialized empty Git repository in ...`

---

## 📋 Step 2: Configure Git (First Time Only)

If you haven't configured Git before:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

## ✅ Step 3: Stage All Files

```bash
git add .
```

This stages all your files for commit. The `.gitignore` will exclude:
- `node_modules/`
- `.env` files
- `dist/` folders
- Log files

---

## 💾 Step 4: Create Initial Commit

```bash
git commit -m "Initial commit: EngiNotes Hub - Full MERN Stack Application"
```

**Output**: Shows files committed

---

## 🌐 Step 5: Create GitHub Repository

### Option A: Via GitHub Website (Recommended)

1. Go to https://github.com/
2. Click **"+"** (top right) → **"New repository"**
3. **Repository name**: `enginotes-hub`
4. **Description**: "MERN stack application for engineering students to share notes and collaborate"
5. **Visibility**: Public (or Private)
6. **DO NOT** initialize with README, .gitignore, or license
7. Click **"Create repository"**

### Option B: Via GitHub CLI

```bash
gh repo create enginotes-hub --public --source=. --remote=origin
```

---

## 🔗 Step 6: Connect Local Repository to GitHub

Copy the commands from GitHub's "Quick setup" page, or use:

```bash
git remote add origin https://github.com/YOUR_USERNAME/enginotes-hub.git
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

---

## 🌿 Step 7: Rename Branch to Main

```bash
git branch -M main
```

---

## 🚀 Step 8: Push to GitHub

```bash
git push -u origin main
```

**First time?** GitHub will ask for authentication:
- **Username**: Your GitHub username
- **Password**: Use a Personal Access Token (not your password!)

---

## 🔑 Creating Personal Access Token (If Needed)

If push fails due to authentication:

1. Go to https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. **Note**: "EngiNotes Hub Deployment"
4. **Expiration**: 90 days (or your choice)
5. **Select scopes**: Check `repo` (full control)
6. Click **"Generate token"**
7. **Copy the token** (you won't see it again!)
8. Use this token as your password when pushing

---

## ✅ Verify Upload

Go to your GitHub repository:
```
https://github.com/YOUR_USERNAME/enginotes-hub
```

You should see:
- ✅ All your code files
- ✅ Both `client/` and `server/` folders
- ✅ Documentation files
- ✅ `.gitignore` file
- ❌ No `node_modules/` (excluded)
- ❌ No `.env` files (excluded)

---

## 📝 Step 9: Update README (Optional)

Rename and update the GitHub README:

```bash
# In project root
mv README_GITHUB.md README.md

# Update it with your details:
# - Replace YOUR_USERNAME with your GitHub username
# - Add your email
# - Add screenshots after deployment

# Commit and push
git add README.md
git commit -m "Update README for GitHub"
git push
```

---

## 🎯 What Gets Pushed

### ✅ Included:
- All source code (client + server)
- Package.json files
- Configuration files
- Documentation files
- .gitignore file

### ❌ Excluded (by .gitignore):
- node_modules/ folders
- .env files (sensitive data)
- dist/ build folders
- Log files
- OS files (.DS_Store, etc.)

---

## 🔄 Future Updates

After making changes to your code:

```bash
# 1. Stage changes
git add .

# 2. Commit with message
git commit -m "Add new feature: XYZ"

# 3. Push to GitHub
git push
```

---

## 🐛 Common Issues

### Issue 1: "repository not found"
```bash
# Solution: Check remote URL
git remote -v

# If wrong, remove and re-add
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/enginotes-hub.git
```

### Issue 2: "Authentication failed"
- Use Personal Access Token instead of password
- Or use GitHub CLI: `gh auth login`

### Issue 3: "! [rejected] main -> main (fetch first)"
```bash
# Someone else made changes, pull first
git pull origin main --rebase
git push
```

### Issue 4: Large files rejected
```bash
# GitHub has 100MB file limit
# Check which files are large:
find . -size +50M

# Add large files to .gitignore if needed
```

---

## ✅ Success Checklist

- [ ] Git initialized
- [ ] Files committed locally
- [ ] GitHub repository created
- [ ] Remote added to local repo
- [ ] Code pushed to GitHub
- [ ] Repository visible on GitHub.com
- [ ] README updated with your details
- [ ] .env files NOT in repository (verify!)

---

## 🎉 Next Steps

Now that your code is on GitHub:

1. ✅ **Deploy Backend** to Render
   - See `DEPLOYMENT_GUIDE.md`
   
2. ✅ **Deploy Frontend** to Vercel
   - See `DEPLOYMENT_GUIDE.md`

3. ✅ **Share** your repository
   - Add collaborators
   - Share the link

---

## 📞 Need Help?

**Common Commands**:
```bash
git status              # Check current status
git log                 # View commit history
git remote -v           # View remote repositories
git branch             # List branches
git add -A             # Stage all changes
git commit -m "msg"    # Commit with message
git push               # Push to GitHub
```

**GitHub Repository URL**:
```
https://github.com/YOUR_USERNAME/enginotes-hub
```

**Done! Your code is now on GitHub! 🎊**
