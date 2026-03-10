# Environment Variables Setup Guide

Quick reference for all environment variables needed for StudyBuddy deployment.

---

## 📋 Overview

| Variable       | Used By  | Required | Where to Set                          |
|----------------|----------|----------|---------------------------------------|
| `MONGODB_URI`  | Backend  | ✅ Yes   | Backend `.env` (local) / Vercel       |
| `JWT_SECRET`   | Backend  | ✅ Yes   | Backend `.env` (local) / Vercel       |
| `CLIENT_URL`   | Backend  | ✅ Yes   | Backend `.env` (local) / Vercel       |
| `PORT`         | Backend  | No       | Backend `.env` (local only)           |
| `NODE_ENV`     | Backend  | No       | Backend `.env` / Vercel               |
| `VITE_API_URL` | Frontend | ✅ Yes   | Frontend `.env.local` (local) / Vercel |

---

## 🖥️ Local Development Setup

### Backend (`backend/.env`)

Create `backend/.env` from the template:

```bash
cd backend
cp .env.example .env
```

Then edit `backend/.env`:

```env
# MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://your-user:your-password@cluster0.xxxxx.mongodb.net/studybuddy?retryWrites=true&w=majority

# JWT secret (generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
JWT_SECRET=your_super_secret_jwt_key_min_32_chars_long_random_string_here

# Frontend URL for CORS
CLIENT_URL=http://localhost:5173

# Server port (local dev only)
PORT=5000

# Environment
NODE_ENV=development
```

---

### Frontend (`frontend/.env.local`)

Create `frontend/.env.local`:

```bash
cd frontend
cp .env.example .env.local
```

Then edit `frontend/.env.local`:

```env
# Backend API URL
VITE_API_URL=http://localhost:5000
```

---

## ☁️ Vercel (Production) Setup

When deploying to Vercel, add these environment variables in the Vercel Dashboard:

**Project Settings → Environment Variables**

### Required Variables

| Variable       | Value Example                                              | Notes                                  |
|----------------|------------------------------------------------------------|----------------------------------------|
| `MONGODB_URI`  | `mongodb+srv://user:pass@cluster0.xxx.mongodb.net/studybuddy?retryWrites=true&w=majority` | Get from MongoDB Atlas |
| `JWT_SECRET`   | `a1b2c3d4e5f6...` (64+ char random string)                 | Generate with command below            |
| `CLIENT_URL`   | `https://studybuddy.vercel.app`                            | Your deployed Vercel URL (no `/`)      |
| `VITE_API_URL` | `https://studybuddy.vercel.app`                            | Same as CLIENT_URL for monorepo        |
| `NODE_ENV`     | `production`                                               | Vercel usually sets this automatically |

---

## 🔐 Generating JWT_SECRET

Use one of these methods to generate a secure random string:

### Method 1: Node.js (Recommended)

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Method 2: OpenSSL

```bash
openssl rand -hex 64
```

### Method 3: Online Generator

Visit: https://generate-secret.vercel.app/64

⚠️ **Important**: Never share or commit your JWT_SECRET to git!

---

## 🗄️ MongoDB Atlas Connection String

### Format

```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

### How to Get It

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Click your cluster → **Connect** → **Connect your application**
3. Copy the connection string
4. Replace:
   - `<username>` → your database user (e.g., `studybuddy-user`)
   - `<password>` → your database password
   - `<database>` → your database name (e.g., `studybuddy`)

### Example

```
mongodb+srv://studybuddy-user:MySecurePass123@cluster0.abc123.mongodb.net/studybuddy?retryWrites=true&w=majority
```

⚠️ **Security Notes**:
- Password must be URL-encoded if it contains special characters
- In MongoDB Atlas, go to **Network Access** → Allow `0.0.0.0/0` for Vercel

---

## 🌐 CLIENT_URL vs VITE_API_URL

### Monorepo Deployment (Option B)

Both should be **the same** — your single Vercel project URL:

```env
CLIENT_URL=https://studybuddy.vercel.app
VITE_API_URL=https://studybuddy.vercel.app
```

### Separate Projects (Option A)

They should be **different**:

```env
# Backend project
CLIENT_URL=https://studybuddy-frontend.vercel.app

# Frontend project
VITE_API_URL=https://studybuddy-backend.vercel.app
```

---

## ✅ Verification Checklist

### Local Development

- [ ] `backend/.env` exists and has all required variables
- [ ] `frontend/.env.local` exists and has `VITE_API_URL`
- [ ] MongoDB URI includes database name
- [ ] JWT_SECRET is at least 32 characters
- [ ] CLIENT_URL points to `http://localhost:5173`
- [ ] VITE_API_URL points to `http://localhost:5000`

### Vercel Production

- [ ] All environment variables added in Vercel Dashboard
- [ ] MongoDB Atlas Network Access allows `0.0.0.0/0`
- [ ] CLIENT_URL matches your deployed URL (no trailing `/`)
- [ ] VITE_API_URL matches your deployed URL
- [ ] JWT_SECRET is different from local development
- [ ] Redeployed after setting environment variables

---

## 🚨 Common Mistakes

### ❌ Trailing slash in URLs

```env
# WRONG
CLIENT_URL=https://studybuddy.vercel.app/

# CORRECT
CLIENT_URL=https://studybuddy.vercel.app
```

### ❌ Missing database name in MONGODB_URI

```env
# WRONG
mongodb+srv://user:pass@cluster0.xxx.mongodb.net/?retryWrites=true

# CORRECT
mongodb+srv://user:pass@cluster0.xxx.mongodb.net/studybuddy?retryWrites=true
```

### ❌ Setting VITE_API_URL after build

Vite bakes env vars into the bundle at **build time**.

If you set `VITE_API_URL` after deploying, you **must redeploy** for it to take effect.

### ❌ Using same JWT_SECRET in local and production

**Always use different secrets** for local dev vs production.

### ❌ Forgetting to URL-encode special characters in passwords

If your MongoDB password is `P@ss#123`, encode it as `P%40ss%23123`.

Use: https://www.urlencoder.org/

---

## 🔄 Updating Environment Variables

### Locally

1. Edit `.env` or `.env.local`
2. Restart the dev server

### On Vercel

1. Dashboard → Your Project → **Settings** → **Environment Variables**
2. Edit the variable
3. Click **Save**
4. Go to **Deployments** → Click **⋯** → **Redeploy**

⚠️ **Important**: Environment variable changes don't take effect until you redeploy!

---

## 📚 Further Reading

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [MongoDB Connection String Format](https://www.mongodb.com/docs/manual/reference/connection-string/)

---

**Need help?** Check [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step deployment instructions.