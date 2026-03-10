# 🚀 Quick Start — Deploy to Vercel in 10 Minutes

TL;DR: Get StudyBuddy running on Vercel with minimal reading.

---

## Prerequisites

- GitHub account
- Vercel account (sign up free at [vercel.com](https://vercel.com))
- MongoDB Atlas account (sign up free at [mongodb.com](https://mongodb.com))

---

## Step 1: MongoDB Setup (3 minutes)

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) → **Create** → Free M0 cluster
2. **Database Access** → Add user → Save username/password
3. **Network Access** → Add IP → `0.0.0.0/0` (Allow from anywhere)
4. **Connect** → Drivers → Copy connection string
5. Replace `<username>`, `<password>`, add database name:
   ```
   mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/studybuddy?retryWrites=true&w=majority
   ```

Save this connection string for Step 3.

---

## Step 2: Push to GitHub (2 minutes)

```bash
cd E:\Projects\alpha-test-2-vercel

# Create repo on GitHub first, then:
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy to Vercel (5 minutes)

### 3.1 Create Project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Root Directory: **`.`** (keep as root)
4. Click **Environment Variables**

### 3.2 Add Environment Variables

Generate JWT secret first:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Add these variables (all environments):

| Variable      | Value                                          |
|---------------|------------------------------------------------|
| MONGODB_URI   | Your connection string from Step 1             |
| JWT_SECRET    | The random string you just generated           |
| CLIENT_URL    | Leave blank for now                            |
| VITE_API_URL  | Leave blank for now                            |
| NODE_ENV      | `production`                                   |

### 3.3 Deploy

Click **Deploy** → Wait 2-3 minutes

### 3.4 Update URLs

After deployment completes:

1. Copy your URL: `https://your-project.vercel.app`
2. Go to **Settings** → **Environment Variables**
3. Set `CLIENT_URL` = your URL (no trailing slash)
4. Set `VITE_API_URL` = your URL (same as above)
5. Go to **Deployments** → **⋯** → **Redeploy**

---

## Step 4: Verify (1 minute)

### Backend
Visit: `https://your-project.vercel.app/api/health`

Should see:
```json
{
  "status": "online",
  "dbState": "connected"
}
```

### Frontend
Visit: `https://your-project.vercel.app`

Register a new account → Should see Dashboard

---

## ✅ Done!

Your app is live. Updates deploy automatically on every `git push`.

---

## 🆘 Problems?

### "CORS blocked"
- Check `CLIENT_URL` matches your Vercel URL exactly (no trailing slash)
- Redeploy after fixing

### "Database unavailable"
- Check MongoDB URI is correct
- Verify MongoDB Network Access allows `0.0.0.0/0`

### Blank page
- Make sure `VITE_API_URL` was set before deploying
- If you set it after, redeploy

---

## 📚 Need More Details?

- Full deployment guide: [DEPLOYMENT.md](./DEPLOYMENT.md)
- Step-by-step checklist: [CHECKLIST.md](./CHECKLIST.md)
- Environment variables reference: [ENV_SETUP.md](./ENV_SETUP.md)
- Complete documentation: [README.md](./README.md)