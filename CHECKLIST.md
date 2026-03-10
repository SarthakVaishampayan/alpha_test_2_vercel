# 🚀 StudyBuddy Deployment Checklist

Use this checklist to deploy your StudyBuddy app to Vercel using the monorepo configuration (Option B).

---

## ✅ Phase 1: Pre-Deployment Setup

### Local Development Verification

- [ ] Backend runs locally on `http://localhost:5000`
  ```bash
  cd backend
  npm install
  npm run dev
  ```

- [ ] Frontend runs locally on `http://localhost:5173`
  ```bash
  cd frontend
  npm install
  npm run dev
  ```

- [ ] Can register and login successfully at `http://localhost:5173`

- [ ] Backend health check works: `http://localhost:5000/api/health`

---

## ✅ Phase 2: MongoDB Atlas Setup

### Create Database

- [ ] Signed up for MongoDB Atlas at [cloud.mongodb.com](https://cloud.mongodb.com)

- [ ] Created a free M0 cluster (takes 3-5 minutes)

- [ ] Selected a cloud provider and region

### Database User

- [ ] Created a database user:
  - Username: `___________________`
  - Password: `___________________` (saved securely)

- [ ] Set user privileges to **"Read and write to any database"**

### Network Access

- [ ] Added IP Address allowlist entry: `0.0.0.0/0` (Allow access from anywhere)

- [ ] Confirmed the network access rule is active

### Connection String

- [ ] Got the connection string from: **Connect → Drivers**

- [ ] Replaced `<username>` with actual username

- [ ] Replaced `<password>` with actual password

- [ ] Added database name before `?` (e.g., `/studybuddy?retryWrites=true`)

- [ ] Final connection string saved:
  ```
  mongodb+srv://_____________:_____________@cluster0._____.mongodb.net/studybuddy?retryWrites=true&w=majority
  ```

---

## ✅ Phase 3: Git Repository Setup

### Push to GitHub

- [ ] Created a GitHub repository (public or private)

- [ ] Repository URL: `https://github.com/_____________/_____________`

- [ ] Verified `.gitignore` excludes:
  - `node_modules/`
  - `.env` and `.env.local`
  - `frontend/dist/`
  - `.vercel/`

- [ ] Pushed code to GitHub:
  ```bash
  git init
  git add .
  git commit -m "Initial commit - StudyBuddy monorepo"
  git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
  git branch -M main
  git push -u origin main
  ```

---

## ✅ Phase 4: Vercel Project Setup

### Create Project

- [ ] Logged into [vercel.com/dashboard](https://vercel.com/dashboard)

- [ ] Clicked **"Add New..."** → **"Project"**

- [ ] Imported the GitHub repository

### Project Configuration

- [ ] Framework Preset: **Other** (auto-detected)

- [ ] Root Directory: **`.`** (the root — don't change this)

- [ ] Build Command: Auto-detected from `vercel.json`

- [ ] Output Directory: Auto-detected from `vercel.json`

---

## ✅ Phase 5: Environment Variables Setup

### Generate JWT Secret

- [ ] Generated JWT_SECRET using:
  ```bash
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```

- [ ] JWT_SECRET saved: `________________________________________`

### Add Variables to Vercel

In **Environment Variables** section, add these (all environments: Production, Preview, Development):

- [ ] `MONGODB_URI`
  - Value: Your MongoDB connection string from Phase 2
  - Target: Production, Preview, Development

- [ ] `JWT_SECRET`
  - Value: The random string you generated above
  - Target: Production, Preview, Development

- [ ] `NODE_ENV`
  - Value: `production`
  - Target: Production only

- [ ] `CLIENT_URL`
  - Value: Leave blank for now (will update after first deploy)
  - Target: Production, Preview, Development

- [ ] `VITE_API_URL`
  - Value: Leave blank for now (will update after first deploy)
  - Target: Production, Preview, Development

---

## ✅ Phase 6: Initial Deployment

### Deploy

- [ ] Clicked **"Deploy"** button

- [ ] Waited for build to complete (2-3 minutes)

- [ ] Build succeeded (no errors)

- [ ] Deployment URL received: `https://_____________________.vercel.app`

---

## ✅ Phase 7: Update Environment Variables

### Update URLs

- [ ] Copied deployment URL from Phase 6

- [ ] Went to **Settings** → **Environment Variables**

- [ ] Updated `CLIENT_URL`:
  - Value: `https://YOUR_PROJECT_NAME.vercel.app` (no trailing slash)
  - Saved changes

- [ ] Updated `VITE_API_URL`:
  - Value: `https://YOUR_PROJECT_NAME.vercel.app` (same as CLIENT_URL)
  - Saved changes

### Redeploy

- [ ] Went to **Deployments** tab

- [ ] Clicked **⋯** (three dots) on the latest deployment

- [ ] Clicked **"Redeploy"**

- [ ] Selected **"Use existing Build Cache"**

- [ ] Clicked **"Redeploy"** button

- [ ] Waited for redeployment to complete

---

## ✅ Phase 8: Verification

### Backend Health Check

- [ ] Visited: `https://YOUR_PROJECT_NAME.vercel.app/api/health`

- [ ] Response shows:
  ```json
  {
    "status": "online",
    "message": "StudyBuddy API is running",
    "environment": "production",
    "dbState": "connected",
    "timestamp": "..."
  }
  ```

- [ ] `dbState` is `"connected"` (not `"disconnected"`)

### Frontend

- [ ] Visited: `https://YOUR_PROJECT_NAME.vercel.app`

- [ ] Login page loads correctly

- [ ] No console errors in browser DevTools (F12)

### Full User Flow

- [ ] Clicked **"New here? Create account"**

- [ ] Registered a test account:
  - Name: `___________________`
  - Email: `___________________`
  - Password: `___________________`

- [ ] Successfully redirected to Dashboard after registration

- [ ] Dashboard loads with:
  - Study timer/stopwatch
  - Habit tracker card
  - Tasks card
  - Weekly bar chart

- [ ] Logged out successfully

- [ ] Logged back in with same credentials

- [ ] All features accessible:
  - [ ] Dashboard
  - [ ] Analytics
  - [ ] Subjects
  - [ ] Your Space
  - [ ] Profile
  - [ ] Settings
  - [ ] About

---

## ✅ Phase 9: Final Checks

### Security

- [ ] JWT_SECRET is different from local development

- [ ] MongoDB Atlas has Network Access set to `0.0.0.0/0`

- [ ] Database user has strong password (min 12 characters)

- [ ] `.env` and `.env.local` files are in `.gitignore`

- [ ] Real `.env` files are NOT pushed to GitHub

### Performance

- [ ] Initial page load is under 3 seconds

- [ ] API response times are under 1 second

- [ ] No JavaScript errors in browser console

### Documentation

- [ ] Project README.md is up to date

- [ ] Deployment URL documented: `___________________`

- [ ] MongoDB cluster name documented: `___________________`

- [ ] Vercel project name documented: `___________________`

---

## 🎉 Deployment Complete!

Your StudyBuddy app is live at:

**`https://___________________________.vercel.app`**

---

## 📝 Post-Deployment Notes

### Custom Domain (Optional)

To add a custom domain:

1. Go to Vercel project → **Settings** → **Domains**
2. Add your domain (e.g., `studybuddy.yourdomain.com`)
3. Follow DNS configuration instructions
4. Update `CLIENT_URL` and `VITE_API_URL` to your custom domain
5. Redeploy

### Monitoring

- [ ] Set up Vercel Analytics (Settings → Analytics)
- [ ] Enable Speed Insights (Settings → Speed Insights)
- [ ] Monitor function logs (Deployments → Functions → View logs)

### Future Updates

To deploy updates:

```bash
git add .
git commit -m "Your update description"
git push
```

Vercel automatically redeploys on every push to `main` branch.

---

## 🆘 Troubleshooting

If something went wrong, check:

- [ ] All environment variables are set correctly (no typos)
- [ ] MongoDB URI includes database name: `/studybuddy?retryWrites=true`
- [ ] CLIENT_URL has no trailing slash
- [ ] VITE_API_URL matches your Vercel URL exactly
- [ ] Redeployed after setting environment variables
- [ ] MongoDB Network Access allows `0.0.0.0/0`
- [ ] No build errors in Vercel deployment logs

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed troubleshooting steps.

---

**Checklist completed on:** `____/____/________`

**Deployed by:** `_____________________`

**Production URL:** `https://___________________________.vercel.app`
