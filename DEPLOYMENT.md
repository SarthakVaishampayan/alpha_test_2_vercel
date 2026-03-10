# StudyBuddy — Monorepo Deployment to Vercel (Option B)

This guide walks you through deploying **both frontend and backend** from a **single Vercel project** using the monorepo configuration.

---

## 📋 Prerequisites

- A GitHub account (or GitLab/Bitbucket)
- A Vercel account (free tier works) — [vercel.com](https://vercel.com)
- A MongoDB Atlas account (free tier works) — [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Your code pushed to a Git repository

---

## Step 1: Set Up MongoDB Atlas

### 1.1 Create a Cluster

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Sign in or create a free account
3. Click **"Build a Database"** → Choose **"M0 Free"** tier
4. Select a cloud provider and region (choose one closest to your users)
5. Click **"Create Cluster"** (this takes 3-5 minutes)

### 1.2 Create a Database User

1. In the left sidebar, click **"Database Access"**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Set a username (e.g., `studybuddy-user`)
5. Click **"Autogenerate Secure Password"** and **copy it** (save it somewhere safe)
6. Under **"Database User Privileges"**, select **"Read and write to any database"**
7. Click **"Add User"**

### 1.3 Allow Network Access

1. In the left sidebar, click **"Network Access"**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (adds `0.0.0.0/0`)
   > ⚠️ This is required for Vercel's dynamic IPs. It's safe if you use strong passwords.
4. Click **"Confirm"**

### 1.4 Get Your Connection String

1. Go back to **"Database"** in the left sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string — it looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<username>` with your database username
6. Replace `<password>` with the password you saved earlier
7. Add your database name before the `?` — for example:
   ```
   mongodb+srv://studybuddy-user:YourPassword123@cluster0.xxxxx.mongodb.net/studybuddy?retryWrites=true&w=majority
   ```

✅ **Save this complete connection string — you'll need it in Step 3.**

---

## Step 2: Push Your Code to GitHub

If you haven't already pushed your code:

```bash
cd E:\Projects\alpha-test-2-vercel

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - StudyBuddy monorepo"

# Create a new repository on GitHub (do this in your browser first)
# Then link it:
git remote add origin https://github.com/YOUR_USERNAME/studybuddy.git

# Push
git branch -M main
git push -u origin main
```

✅ **Your code is now on GitHub.**

---

## Step 3: Deploy to Vercel

### 3.1 Create a New Vercel Project

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Find your `studybuddy` repository and click **"Import"**

### 3.2 Configure the Project

Vercel will auto-detect the `vercel.json` at the root. You should see:

- **Framework Preset**: Other
- **Root Directory**: `.` (leave as is — the root)
- **Build Command**: Auto-detected
- **Output Directory**: Auto-detected

> ✅ **Do NOT change the root directory.** The monorepo config handles both frontend and backend from the root.

### 3.3 Add Environment Variables

Click **"Environment Variables"** and add the following:

| Name              | Value                                                      | Target Environments       |
|-------------------|------------------------------------------------------------|---------------------------|
| `MONGODB_URI`     | Your MongoDB Atlas connection string from Step 1.4         | Production, Preview, Dev  |
| `JWT_SECRET`      | A long random string (see below)                           | Production, Preview, Dev  |
| `CLIENT_URL`      | `https://your-project-name.vercel.app` (see note below)    | Production                |
| `VITE_API_URL`    | `https://your-project-name.vercel.app`                     | Production, Preview, Dev  |
| `NODE_ENV`        | `production`                                               | Production                |

#### How to generate `JWT_SECRET`:

Open your terminal and run:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output (a long random string) and use it as `JWT_SECRET`.

#### About `CLIENT_URL` and `VITE_API_URL`:

You don't know your Vercel URL yet, so:

1. **First deployment**: Leave `CLIENT_URL` blank or set it to `*` (wildcard — allows all origins temporarily)
2. After the first deploy, Vercel will give you a URL like `https://studybuddy-abc123.vercel.app`
3. Go back to **Settings → Environment Variables** → Update `CLIENT_URL` and `VITE_API_URL` to that URL
4. **Redeploy** (see Step 3.5)

### 3.4 Deploy

Click **"Deploy"**

Vercel will:
1. Build the frontend (`npm run build` in `frontend/`)
2. Build the backend serverless function (`backend/api/index.js`)
3. Deploy everything

This takes about 2-3 minutes.

### 3.5 Get Your Deployment URL

Once deployed, Vercel shows your URL:

```
https://studybuddy-abc123.vercel.app
```

**Copy this URL.**

### 3.6 Update Environment Variables

1. Go to your project → **Settings** → **Environment Variables**
2. Find `CLIENT_URL` → Click **Edit** → Set value to `https://studybuddy-abc123.vercel.app` (your actual URL, no trailing slash)
3. Find `VITE_API_URL` → Click **Edit** → Set value to `https://studybuddy-abc123.vercel.app`
4. Click **Save**

### 3.7 Redeploy

After updating environment variables:

1. Go to the **Deployments** tab
2. Click the **three dots (⋯)** on the latest deployment
3. Click **"Redeploy"**
4. Check **"Use existing Build Cache"** → Click **"Redeploy"**

✅ **Your app is now fully deployed!**

---

## Step 4: Verify Deployment

### 4.1 Test the Backend

Visit:

```
https://your-project-name.vercel.app/api/health
```

You should see:

```json
{
  "status": "online",
  "message": "StudyBuddy API is running",
  "environment": "production",
  "dbState": "connected",
  "timestamp": "2024-01-15T12:34:56.789Z"
}
```

If `dbState` is `"disconnected"`, check your `MONGODB_URI` environment variable.

### 4.2 Test the Frontend

Visit:

```
https://your-project-name.vercel.app
```

You should see the StudyBuddy login page.

### 4.3 Create an Account

1. Click **"New here? Create account"**
2. Register with a test email and password
3. You should be redirected to the Dashboard

✅ **If you see the dashboard, everything is working!**

---

## Step 5: Custom Domain (Optional)

1. Go to your Vercel project → **Settings** → **Domains**
2. Add your custom domain (e.g., `studybuddy.yourdomain.com`)
3. Follow Vercel's DNS instructions
4. After the domain is active:
   - Go to **Environment Variables**
   - Update `CLIENT_URL` and `VITE_API_URL` to your custom domain
   - **Redeploy**

---

## 🔧 Troubleshooting

### Problem: "CORS blocked for origin"

**Cause**: `CLIENT_URL` doesn't match your actual Vercel URL.

**Fix**:
1. Check your deployment URL (e.g., `https://studybuddy-abc123.vercel.app`)
2. Go to Settings → Environment Variables
3. Set `CLIENT_URL` to **exactly** that URL (no trailing slash)
4. Redeploy

---

### Problem: "Database unavailable"

**Cause**: MongoDB connection failed.

**Fix**:
1. Verify your `MONGODB_URI` is correct
2. In MongoDB Atlas, check:
   - Network Access has `0.0.0.0/0` allowed
   - Database user credentials are correct
   - The database name is included in the connection string
3. Test the connection string locally:
   ```bash
   cd backend
   node -e "require('mongoose').connect('YOUR_MONGODB_URI').then(() => console.log('✅ Connected')).catch(e => console.log('❌', e.message))"
   ```

---

### Problem: Blank page after deployment

**Cause**: `VITE_API_URL` was not set before the build.

**Fix**:
1. Vite bakes environment variables into the bundle at **build time**
2. Go to Settings → Environment Variables
3. Make sure `VITE_API_URL` is set to your Vercel URL
4. **Redeploy** (this triggers a new build with the correct env var)

---

### Problem: API returns 404 for all routes

**Cause**: Vercel routing misconfigured.

**Fix**:
1. Make sure `vercel.json` exists at the **root** of your repo
2. Make sure it has this routing config:
   ```json
   "routes": [
     { "src": "/api/(.*)", "dest": "backend/api/index.js" },
     { "handle": "filesystem" },
     { "src": "/(.*)", "dest": "frontend/index.html" }
   ]
   ```
3. Redeploy

---

### Problem: "Cannot find module" errors in backend

**Cause**: Missing dependencies or incorrect import paths.

**Fix**:
1. Make sure all backend dependencies are in `backend/package.json`
2. Make sure all imports use `.js` extensions:
   ```js
   import authRoutes from "./routes/auth.js";  // ✅ Good
   import authRoutes from "./routes/auth";      // ❌ Bad (breaks in ES modules)
   ```
3. Redeploy

---

## 📊 Monitoring Your Deployment

- **Logs**: Vercel Dashboard → Your Project → **Functions** → Click a function → View logs
- **Analytics**: Vercel Dashboard → Your Project → **Analytics**
- **Speed Insights**: Enable in Vercel settings for performance monitoring

---

## 🔄 Making Updates

After making code changes:

```bash
git add .
git commit -m "Your update description"
git push
```

Vercel automatically redeploys on every push to the `main` branch.

---

## 🎉 You're Done!

Your StudyBuddy app is now live at:

```
https://your-project-name.vercel.app
```

Both frontend and backend are running from a **single Vercel project** using the monorepo configuration.

---

## 📚 Additional Resources

- [Vercel Monorepo Documentation](https://vercel.com/docs/monorepos)
- [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

---

**Need help?** Check the main [README.md](./README.md) for API documentation and local development setup.