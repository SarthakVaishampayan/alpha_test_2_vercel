# 🚀 START HERE — Deploy StudyBuddy to Vercel

Welcome! This guide will help you deploy your **StudyBuddy** app to Vercel in the fastest way possible.

---

## 📖 Choose Your Path

### 🏃 **I want to deploy ASAP (10 minutes)**
→ Follow **[QUICK_START.md](./QUICK_START.md)**

Quick checklist of essential steps with minimal explanation.

---

### 📋 **I want a step-by-step guide with details**
→ Follow **[DEPLOYMENT.md](./DEPLOYMENT.md)**

Comprehensive walkthrough with screenshots, troubleshooting, and explanations.

---

### ✅ **I want an interactive checklist**
→ Follow **[CHECKLIST.md](./CHECKLIST.md)**

Fill-in-the-blanks checklist you can print or complete as you go.

---

### 🔧 **I need help with environment variables**
→ Read **[ENV_SETUP.md](./ENV_SETUP.md)**

Complete reference for all environment variables with examples.

---

### 📚 **I want to understand the architecture**
→ Read **[OPTION_B_SUMMARY.md](./OPTION_B_SUMMARY.md)**

Detailed explanation of how the monorepo deployment works.

---

## 🎯 What is Option B?

**Option B = Monorepo Deployment**

- **One Vercel project** hosts both frontend and backend
- **One URL** for everything (e.g., `https://studybuddy.vercel.app`)
- API accessible at `/api/*`
- Frontend accessible at all other routes

---

## 🛠️ What You'll Need

Before starting, make sure you have:

- [ ] **GitHub account** — To host your code
- [ ] **Vercel account** — Sign up free at [vercel.com](https://vercel.com)
- [ ] **MongoDB Atlas account** — Sign up free at [mongodb.com](https://mongodb.com)
- [ ] **15 minutes** — That's all it takes!

---

## 🚦 Quick Path (TL;DR)

If you're experienced with Vercel and MongoDB:

1. **MongoDB Atlas:**
   - Create free cluster
   - Add user + password
   - Network Access: `0.0.0.0/0`
   - Copy connection string

2. **GitHub:**
   - Push this repo to GitHub

3. **Vercel:**
   - Import repo (root directory = `.`)
   - Add environment variables:
     - `MONGODB_URI` = your connection string
     - `JWT_SECRET` = random 64-char string
     - `VITE_API_URL` = leave blank initially
     - `CLIENT_URL` = leave blank initially
   - Deploy
   - Update `VITE_API_URL` and `CLIENT_URL` to your Vercel URL
   - Redeploy

4. **Done!** Visit your URL and test.

---

## 📁 Project Structure

```
alpha-test-2-vercel/
│
├── backend/              # Express API (serverless)
│   ├── api/
│   │   └── index.js      # Vercel entry point
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API routes
│   └── server.js         # Express app
│
├── frontend/             # React + Vite SPA
│   ├── src/
│   │   ├── pages/        # React pages
│   │   ├── components/   # React components
│   │   └── context/      # State management
│   └── vite.config.js    # Build config
│
├── vercel.json           # ← Monorepo orchestration
│
└── Documentation/
    ├── START_HERE.md     # ← You are here
    ├── QUICK_START.md    # 10-minute guide
    ├── DEPLOYMENT.md     # Detailed guide
    ├── CHECKLIST.md      # Interactive checklist
    ├── ENV_SETUP.md      # Environment variables
    └── OPTION_B_SUMMARY.md  # Architecture explanation
```

---

## ✨ Features After Deployment

Your deployed app will have:

- ✅ **Study Timer** — Stopwatch + countdown with session logging
- ✅ **Habit Tracker** — Daily habit tracking with streaks
- ✅ **Task Manager** — Todo list with pending count
- ✅ **Analytics** — Weekly study hours, goal tracking, calendar heatmap
- ✅ **Subjects** — Subject cards with topic checklists
- ✅ **Marks Logger** — Track exam scores per subject
- ✅ **Links Saver** — Save useful study resources
- ✅ **User Profiles** — Bio, study goals, account settings
- ✅ **Authentication** — JWT-based secure login/registration

---

## 🔑 Environment Variables Needed

### Backend (5 variables)
- `MONGODB_URI` — Your MongoDB Atlas connection string
- `JWT_SECRET` — Random 64-character string
- `CLIENT_URL` — Your Vercel URL (for CORS)
- `NODE_ENV` — `production`
- `PORT` — (optional, local dev only)

### Frontend (1 variable)
- `VITE_API_URL` — Your Vercel URL (same as `CLIENT_URL`)

📖 **Full reference:** [ENV_SETUP.md](./ENV_SETUP.md)

---

## 🎯 Recommended Path for First-Time Deployers

### Step 1: Read QUICK_START.md (5 minutes)
Get familiar with the overall process.

### Step 2: Follow DEPLOYMENT.md (20 minutes)
Complete the deployment with detailed guidance.

### Step 3: Use CHECKLIST.md (while deploying)
Track your progress and ensure nothing is missed.

---

## 🆘 If Something Goes Wrong

### Common Issues & Quick Fixes

| Problem | Solution |
|---------|----------|
| "CORS blocked" | Update `CLIENT_URL` to match your Vercel URL exactly (no trailing `/`) |
| "Database unavailable" | Check MongoDB URI, verify Network Access allows `0.0.0.0/0` |
| Blank page after deploy | Set `VITE_API_URL` before build, redeploy if set after |
| API returns 404 | Verify `vercel.json` exists in root and has correct routing |

📖 **Full troubleshooting guide:** [DEPLOYMENT.md](./DEPLOYMENT.md#troubleshooting)

---

## 📊 After Deployment

Once your app is live:

### Monitor Your App
- **Vercel Dashboard** → Functions → View backend logs
- **Vercel Dashboard** → Analytics → Monitor traffic
- Enable Speed Insights for performance data

### Make Updates
```bash
git add .
git commit -m "Your changes"
git push
```
Vercel automatically redeploys on every push to `main`.

### Add Custom Domain (Optional)
1. Vercel → Settings → Domains
2. Add your domain
3. Update `CLIENT_URL` and `VITE_API_URL`
4. Redeploy

---

## 📚 Additional Resources

- **[README.md](./README.md)** — Complete project documentation
- **[MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)** — Database setup help
- **[Vercel Docs](https://vercel.com/docs)** — Platform documentation
- **[Vite Docs](https://vitejs.dev/)** — Frontend build tool

---

## 🎉 Ready to Deploy?

Pick your guide and let's get started:

### 🏃 Fast Track
**[QUICK_START.md](./QUICK_START.md)** → 10 minutes

### 📖 Detailed Guide  
**[DEPLOYMENT.md](./DEPLOYMENT.md)** → 20-30 minutes

### ✅ Interactive Checklist
**[CHECKLIST.md](./CHECKLIST.md)** → Step-by-step

---

**Good luck! Your StudyBuddy app will be live on the internet in just a few minutes. 🚀**