# Option B: Monorepo Deployment Summary

## 🎯 What is Option B?

**Option B** deploys both the frontend and backend from a **single Vercel project** using a monorepo configuration.

- **One repository** = One Vercel project
- **One URL** for everything (e.g., `https://studybuddy.vercel.app`)
- Frontend at `/` 
- Backend API at `/api/*`

---

## 📁 Project Structure

```
alpha-test-2-vercel/
├── backend/                      # Express API
│   ├── api/
│   │   └── index.js              # ← Vercel serverless entry point
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js                 # ← Serverless-compatible Express app
│   ├── vercel.json               # Backend-specific config (can be used standalone)
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
├── frontend/                     # React + Vite SPA
│   ├── src/
│   ├── public/
│   ├── vite.config.js            # Build optimization + dev proxy
│   ├── vercel.json               # Frontend-specific config (can be used standalone)
│   ├── .env.example
│   ├── .env.local                # Local dev environment
│   ├── .gitignore
│   └── package.json
│
├── vercel.json                   # ← ROOT: Monorepo orchestration
├── .gitignore                    # Root gitignore
├── README.md                     # Complete project documentation
├── DEPLOYMENT.md                 # Step-by-step Option B deployment guide
├── CHECKLIST.md                  # Deployment checklist
├── ENV_SETUP.md                  # Environment variables reference
├── QUICK_START.md                # 10-minute deployment guide
└── OPTION_B_SUMMARY.md           # This file
```

---

## 🔧 What Was Changed/Created

### Backend Changes

#### 1. `backend/server.js` — Serverless-Ready Express App

**Problems Fixed:**
- ❌ `process.exit(1)` killed Lambda host on DB errors
- ❌ `app.listen()` always called (doesn't work in serverless)
- ❌ No connection caching (new connection per request)

**Solutions:**
- ✅ Removed `process.exit()` — errors are thrown instead
- ✅ Conditional `app.listen()` — only runs locally (checks `!process.env.VERCEL`)
- ✅ MongoDB connection caching with `isConnected` flag
- ✅ DB connection middleware — connects lazily on first request
- ✅ `export default app` — makes app importable by Vercel

**Key Code:**
```javascript
// Cached connection
let isConnected = false;

const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return; // Reuse existing connection
  }
  await mongoose.connect(mongoUri);
  isConnected = true;
};

// Only listen locally
if (!process.env.VERCEL) {
  app.listen(PORT);
}

// Export for Vercel
export default app;
```

#### 2. `backend/api/index.js` — Serverless Entry Point

**Created:** New file that Vercel calls as a serverless function.

```javascript
import app from "../server.js";
export default app;
```

Vercel routes all `/api/*` requests to this function.

#### 3. `backend/vercel.json` — Backend Routing Config

**Created:** Tells Vercel to use `@vercel/node` runtime.

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "api/index.js"
    }
  ]
}
```

#### 4. `backend/.env.example` — Environment Variable Template

**Created:** Documents all required backend env vars:
- `MONGODB_URI`
- `JWT_SECRET`
- `CLIENT_URL`
- `PORT`
- `NODE_ENV`

#### 5. `backend/.gitignore`

**Created:** Excludes:
- `node_modules/`
- `.env*` files
- logs
- `.vercel/`

---

### Frontend Changes

#### 1. `frontend/src/lib/api.js` — Fixed Environment Variable

**Problem:** Used `VITE_API_BASE` while all other files used `VITE_API_URL`.

**Fixed:** Changed to `VITE_API_URL` for consistency:
```javascript
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
```

#### 2. `frontend/vite.config.js` — Build Optimization

**Created:** Full Vite config with:
- Dev server proxy (`/api/*` → backend)
- Build output directory (`dist`)
- Code splitting (router, recharts, lucide)
- Source maps disabled for production
- Preview server config

**Key Features:**
```javascript
server: {
  proxy: {
    "/api": {
      target: backendUrl,
      changeOrigin: true,
    },
  },
},
build: {
  outDir: "dist",
  rollupOptions: {
    output: {
      manualChunks: {
        "vendor-router": ["react-router-dom"],
        "vendor-recharts": ["recharts"],
        "vendor-lucide": ["lucide-react"],
      },
    },
  },
}
```

#### 3. `frontend/vercel.json` — SPA Routing

**Created:** Catch-all rewrite for React Router:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Ensures `/dashboard`, `/analytics`, etc. work on direct access.

#### 4. `frontend/.env.example` & `frontend/.env.local`

**Created:**
- `.env.example` — Template with documentation
- `.env.local` — Local dev config (points to `http://localhost:5000`)

#### 5. `frontend/.gitignore` — Updated

**Added:**
- `.env*` files
- `.vercel/`

---

### Root Configuration

#### 1. `vercel.json` — Monorepo Orchestration (ROOT)

**Updated:** This is the **master config** that Vercel reads when deploying from the repo root.

```json
{
  "version": 2,
  "name": "studybuddy",
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "frontend/dist"
      }
    },
    {
      "src": "backend/api/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/api/index.js"
    },
    {
      "handle": "filesystem"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/index.html"
    }
  ]
}
```

**How it works:**

1. **Builds** section:
   - Frontend: `@vercel/static-build` compiles Vite app → `frontend/dist/`
   - Backend: `@vercel/node` creates serverless function from `backend/api/index.js`

2. **Routes** section (evaluated in order):
   - `/api/*` → Backend serverless function
   - `filesystem` → Check if a static file exists (CSS, JS, images)
   - `/*` → Fallback to `frontend/index.html` (SPA catch-all)

#### 2. `.gitignore` — Root Level

**Created:** Comprehensive gitignore for entire monorepo:
- `node_modules/` (backend + frontend)
- `.env*` files (anywhere)
- `frontend/dist/`
- `.vercel/`

#### 3. Documentation Files

**Created:**
- `README.md` — Complete project documentation
- `DEPLOYMENT.md` — Step-by-step deployment guide
- `CHECKLIST.md` — Interactive deployment checklist
- `ENV_SETUP.md` — Environment variables reference
- `QUICK_START.md` — 10-minute quick start
- `OPTION_B_SUMMARY.md` — This file

---

## 🔀 Request Flow (How It Works)

### 1. Frontend Request (e.g., `https://studybuddy.vercel.app/dashboard`)

```
User requests /dashboard
    ↓
Vercel checks routes in order:
    ↓
1. Does it match /api/*? → No
    ↓
2. Does /dashboard file exist? → No (React SPA)
    ↓
3. Fallback → frontend/index.html
    ↓
Browser loads React → React Router handles /dashboard
```

### 2. API Request (e.g., `https://studybuddy.vercel.app/api/auth/login`)

```
User requests /api/auth/login
    ↓
Vercel checks routes in order:
    ↓
1. Does it match /api/*? → Yes!
    ↓
Route to backend/api/index.js (serverless function)
    ↓
backend/api/index.js imports server.js
    ↓
Express app handles /api/auth/login route
    ↓
DB connection middleware connects to MongoDB
    ↓
/api/auth/login route handler executes
    ↓
Response sent back to user
```

### 3. Static Asset (e.g., `https://studybuddy.vercel.app/assets/index-ABC123.js`)

```
User requests /assets/index-ABC123.js
    ↓
Vercel checks routes in order:
    ↓
1. Does it match /api/*? → No
    ↓
2. Does /assets/index-ABC123.js file exist? → Yes!
    ↓
Serve the static file directly (no function call)
    ↓
Browser caches with long TTL (immutable)
```

---

## 🌐 Environment Variables

### Required Variables (set in Vercel Dashboard)

| Variable       | Value Example                                | Used By           |
|----------------|----------------------------------------------|-------------------|
| `MONGODB_URI`  | `mongodb+srv://user:pass@cluster.net/db`     | Backend           |
| `JWT_SECRET`   | `a1b2c3...` (64+ chars)                      | Backend           |
| `CLIENT_URL`   | `https://studybuddy.vercel.app`              | Backend (CORS)    |
| `VITE_API_URL` | `https://studybuddy.vercel.app`              | Frontend          |
| `NODE_ENV`     | `production`                                 | Backend           |

**Important:** For Option B, `CLIENT_URL` and `VITE_API_URL` should be **the same** (your single Vercel URL).

---

## ✅ Advantages of Option B

### 1. **Single URL**
- Users only see one domain
- No CORS complexity for same-origin requests
- Easier to share (one link)

### 2. **Simplified Deployment**
- One `git push` updates both frontend and backend
- One Vercel project to manage
- Single dashboard for logs and analytics

### 3. **Cost Effective**
- Free tier covers both frontend and backend
- No need for separate projects

### 4. **Easier Configuration**
- Only one set of environment variables
- `CLIENT_URL` and `VITE_API_URL` are identical

### 5. **Built-in Routing**
- Vercel handles `/api/*` → backend, `/*` → frontend
- No need for separate reverse proxy setup

---

## 🔄 Deployment Workflow

### Initial Deployment

1. Push code to GitHub
2. Import repo to Vercel (root directory = `.`)
3. Add environment variables
4. Deploy
5. Update `CLIENT_URL` and `VITE_API_URL` to deployed URL
6. Redeploy

### Future Updates

```bash
# Make changes to frontend or backend
git add .
git commit -m "Update: ..."
git push
```

Vercel automatically:
1. Detects the push
2. Rebuilds frontend
3. Rebuilds backend serverless function
4. Deploys both atomically
5. Updates live site

---

## 🎯 Quick Reference

### Local Development

```bash
# Terminal 1 - Backend
cd backend
npm run dev  # Runs on http://localhost:5000

# Terminal 2 - Frontend
cd frontend
npm run dev  # Runs on http://localhost:5173
```

### Production URLs

- **Frontend:** `https://studybuddy.vercel.app`
- **API:** `https://studybuddy.vercel.app/api/*`
- **Health Check:** `https://studybuddy.vercel.app/api/health`

### Vercel Dashboard

- **Deployments:** See build logs
- **Functions:** See backend serverless logs
- **Settings → Environment Variables:** Manage env vars
- **Analytics:** Monitor traffic

---

## 📚 Next Steps

1. Follow [QUICK_START.md](./QUICK_START.md) for fastest deployment
2. Or use [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed step-by-step guide
3. Or use [CHECKLIST.md](./CHECKLIST.md) for interactive checklist
4. Refer to [ENV_SETUP.md](./ENV_SETUP.md) for environment variable help

---

## 🆘 Common Issues & Solutions

### "CORS blocked"
- Ensure `CLIENT_URL` matches your Vercel URL exactly (no trailing slash)
- Redeploy after updating

### "Database unavailable"
- Check `MONGODB_URI` is correct
- Verify MongoDB Network Access allows `0.0.0.0/0`

### Blank frontend page
- `VITE_API_URL` must be set **before** build
- If set after, trigger a redeploy

### API returns 404
- Verify `backend/api/index.js` exists
- Check `vercel.json` routes `/api/*` to `backend/api/index.js`

---

**Option B is now fully configured and ready to deploy! 🚀**