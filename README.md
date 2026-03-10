# StudyBuddy 📚

A full-stack MERN productivity app for students — featuring a study timer, habit tracker, task manager, analytics, subject tracker, marks logger, and more.

---

## Tech Stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Frontend  | React 19, Vite 7, React Router 7, Bootstrap 5   |
| Backend   | Node.js, Express 5, Mongoose 8                  |
| Database  | MongoDB Atlas                                   |
| Auth      | JWT (jsonwebtoken + bcryptjs)                   |
| Charts    | Recharts                                        |
| Icons     | Lucide React                                    |
| Hosting   | Vercel (frontend + backend, separately)         |

---

## Project Structure

```
alpha-test-2-vercel/
├── backend/                  # Express API (deployed as Vercel Serverless)
│   ├── api/
│   │   └── index.js          # ← Vercel serverless entry point
│   ├── middleware/
│   │   └── auth.js
│   ├── models/               # Mongoose schemas
│   │   ├── User.js
│   │   ├── Habit.js
│   │   ├── StudySession.js
│   │   ├── Task.js
│   │   ├── Reminder.js
│   │   ├── Subject.js
│   │   ├── DailyGoal.js
│   │   ├── Mark.js
│   │   └── Link.js
│   ├── routes/               # Express routers
│   │   ├── auth.js
│   │   ├── habits.js
│   │   ├── sessions.js
│   │   ├── tasks.js
│   │   ├── reminders.js
│   │   ├── subjects.js
│   │   ├── dailyGoal.js
│   │   ├── marks.js
│   │   └── links.js
│   ├── server.js             # Express app (serverless-compatible)
│   ├── vercel.json           # Backend Vercel config
│   ├── .env.example          # Environment variable template
│   └── package.json
│
├── frontend/                 # React + Vite SPA (deployed as Vercel Static)
│   ├── src/
│   │   ├── components/
│   │   ├── context/          # Auth, Timer, Notification contexts
│   │   ├── lib/api.js        # Shared fetch helper
│   │   ├── pages/
│   │   ├── styles/
│   │   └── utils/
│   ├── vercel.json           # Frontend Vercel config (SPA routing)
│   ├── vite.config.js
│   ├── .env.example          # Environment variable template
│   └── package.json
│
└── vercel.json               # (Optional) Root monorepo config
```

---

## Features

- **Dashboard** — Study stopwatch/countdown timer, habit tracker, quick tasks, reminders, weekly bar chart
- **Analytics** — Weekly study hours, daily goal vs. actual, streak tracking, calendar heatmap
- **Subjects** — Subject cards with topics checklist and progress
- **Your Space** — Reminders board, marks/grades logger per subject, saved links
- **Profile** — User info, bio, study goal
- **Settings** — Update name/bio, change password, logout
- **About** — Contact/feedback form

---

## Local Development

### Prerequisites

- Node.js ≥ 18
- A MongoDB Atlas account (free tier works) or local MongoDB

---

### 1. Clone the repo

```bash
git clone https://github.com/your-username/studybuddy.git
cd studybuddy
```

---

### 2. Set up the Backend

```bash
cd backend
npm install
```

Copy the env template and fill in your values:

```bash
cp .env.example .env
```

Edit `backend/.env`:

```env
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/studybuddy?retryWrites=true&w=majority
JWT_SECRET=your_long_random_secret_here
CLIENT_URL=http://localhost:5173
PORT=5000
NODE_ENV=development
```

Start the backend:

```bash
npm run dev      # uses nodemon for hot-reload
# or
npm start        # plain node
```

The API will be available at `http://localhost:5000`.  
Health check: `http://localhost:5000/api/health`

---

### 3. Set up the Frontend

```bash
cd frontend
npm install
```

Copy the env template:

```bash
cp .env.example .env.local
```

Edit `frontend/.env.local`:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Deploying to Vercel

The recommended approach is **two separate Vercel projects** — one for the backend, one for the frontend. This gives each its own URL, logs, and environment variables.

---

### Step 1 — MongoDB Atlas Setup

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) and create a free cluster.
2. Under **Database Access**, create a user with read/write permissions.
3. Under **Network Access**, add `0.0.0.0/0` to allow connections from Vercel's dynamic IPs.
4. Click **Connect → Drivers** and copy your connection string:
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/studybuddy?retryWrites=true&w=majority
   ```

---

### Step 2 — Deploy the Backend

1. Push your code to GitHub (or GitLab / Bitbucket).

2. Go to [vercel.com](https://vercel.com) → **Add New Project**.

3. Import your repository.

4. Set the **Root Directory** to `backend`.

5. Vercel will auto-detect the `vercel.json` inside `backend/` and configure the serverless build.

6. Under **Environment Variables**, add:

   | Variable       | Value                                                      |
   |----------------|------------------------------------------------------------|
   | `MONGODB_URI`  | `mongodb+srv://user:pass@cluster0.xxx.mongodb.net/studybuddy?retryWrites=true&w=majority` |
   | `JWT_SECRET`   | A long random string (min 32 chars)                        |
   | `CLIENT_URL`   | *(leave blank for now — fill in after frontend is deployed)* |
   | `NODE_ENV`     | `production`                                               |

7. Click **Deploy**.

8. Once deployed, copy your backend URL — it will look like:
   ```
   https://studybuddy-backend.vercel.app
   ```

9. Go back to the backend project → **Settings → Environment Variables** → update `CLIENT_URL` with your frontend URL (you'll have it after Step 3). Then **Redeploy**.

---

### Step 3 — Deploy the Frontend

1. Go to [vercel.com](https://vercel.com) → **Add New Project**.

2. Import the same repository.

3. Set the **Root Directory** to `frontend`.

4. Vercel will detect it as a Vite project and use `npm run build` automatically.

5. Under **Environment Variables**, add:

   | Variable       | Value                                        |
   |----------------|----------------------------------------------|
   | `VITE_API_URL` | `https://studybuddy-backend.vercel.app`      |

   > **Important:** Vite bakes env variables into the bundle at build time.  
   > You must set `VITE_API_URL` **before** deploying — not after.

6. Click **Deploy**.

7. Your frontend URL will look like:
   ```
   https://studybuddy.vercel.app
   ```

8. Copy this URL and go back to your **backend** project → **Settings → Environment Variables** → set `CLIENT_URL` to this URL → **Redeploy** the backend.

---

### Step 4 — Verify Deployment

- Open `https://studybuddy.vercel.app` and register a new account.
- Check `https://studybuddy-backend.vercel.app/api/health` — you should see:
  ```json
  {
    "status": "online",
    "message": "StudyBuddy API is running",
    "dbState": "connected"
  }
  ```

---

## Environment Variables Reference

### Backend (`backend/.env`)

| Variable       | Required | Description                                      |
|----------------|----------|--------------------------------------------------|
| `MONGODB_URI`  | ✅ Yes   | MongoDB Atlas connection string                  |
| `JWT_SECRET`   | ✅ Yes   | Secret for signing JWT tokens (min 32 chars)     |
| `CLIENT_URL`   | ✅ Yes   | Frontend URL for CORS whitelist                  |
| `PORT`         | No       | Local dev port (default: 5000). Vercel ignores.  |
| `NODE_ENV`     | No       | `development` locally, `production` on Vercel   |

### Frontend (`frontend/.env.local`)

| Variable       | Required | Description                                      |
|----------------|----------|--------------------------------------------------|
| `VITE_API_URL` | ✅ Yes   | Base URL of the backend API (no trailing slash)  |

---

## API Endpoints

| Method | Route                            | Auth | Description                     |
|--------|----------------------------------|------|---------------------------------|
| POST   | `/api/auth/register`             | No   | Register a new user             |
| POST   | `/api/auth/login`                | No   | Login and receive a JWT token   |
| GET    | `/api/auth/me`                   | ✅   | Get current user profile        |
| PATCH  | `/api/auth/update`               | ✅   | Update name, bio, study goal    |
| PATCH  | `/api/auth/change-password`      | ✅   | Change password                 |
| GET    | `/api/habits`                    | ✅   | List all habits                 |
| POST   | `/api/habits`                    | ✅   | Create a habit                  |
| PATCH  | `/api/habits/:id/toggle`         | ✅   | Toggle today's completion       |
| DELETE | `/api/habits/:id`                | ✅   | Delete a habit                  |
| GET    | `/api/habits/:id/calendar`       | ✅   | Monthly completion calendar     |
| POST   | `/api/sessions`                  | ✅   | Log a study session             |
| GET    | `/api/sessions/today`            | ✅   | Today's total + % vs yesterday  |
| GET    | `/api/sessions/weekly-stats`     | ✅   | Last 7 days bar chart data      |
| GET    | `/api/tasks`                     | ✅   | List all tasks                  |
| POST   | `/api/tasks`                     | ✅   | Create a task                   |
| PATCH  | `/api/tasks/:id/toggle`          | ✅   | Toggle task completion          |
| DELETE | `/api/tasks/:id`                 | ✅   | Delete a task                   |
| GET    | `/api/reminders`                 | ✅   | List all reminders              |
| POST   | `/api/reminders`                 | ✅   | Create a reminder               |
| DELETE | `/api/reminders/:id`             | ✅   | Delete a reminder               |
| GET    | `/api/subjects`                  | ✅   | List all subjects               |
| POST   | `/api/subjects`                  | ✅   | Create a subject                |
| DELETE | `/api/subjects/:id`              | ✅   | Delete a subject                |
| POST   | `/api/subjects/:id/topics`       | ✅   | Add topic to subject            |
| PATCH  | `/api/subjects/:id/topics/:tid`  | ✅   | Toggle topic completion         |
| DELETE | `/api/subjects/:id/topics/:tid`  | ✅   | Delete topic                    |
| POST   | `/api/daily-goal`                | ✅   | Set daily study goal            |
| GET    | `/api/daily-goal/today`          | ✅   | Today's goal + logged time      |
| GET    | `/api/daily-goal/day`            | ✅   | Goal for a specific date        |
| GET    | `/api/daily-goal/week`           | ✅   | Last 7 days goal vs actual      |
| GET    | `/api/daily-goal/month`          | ✅   | Goal dates for a month          |
| GET    | `/api/daily-goal/streak`         | ✅   | Current + longest streak        |
| GET    | `/api/marks`                     | ✅   | List marks (filter by subject)  |
| POST   | `/api/marks`                     | ✅   | Add a marks entry               |
| DELETE | `/api/marks/:id`                 | ✅   | Delete a marks entry            |
| GET    | `/api/links`                     | ✅   | List saved links                |
| POST   | `/api/links`                     | ✅   | Save a link                     |
| DELETE | `/api/links/:id`                 | ✅   | Delete a link                   |
| GET    | `/api/health`                    | No   | Health check                    |

---

## Common Deployment Issues

### "CORS blocked for origin"
- Make sure `CLIENT_URL` in your backend environment variables exactly matches your frontend Vercel URL (no trailing slash).
- Redeploy the backend after updating `CLIENT_URL`.

### "Database unavailable"
- Check that your MongoDB Atlas cluster is running.
- Verify that `0.0.0.0/0` is added to the Network Access allowlist in Atlas.
- Confirm that `MONGODB_URI` is correctly set in the Vercel backend environment variables.

### Blank page on frontend after deploy
- Make sure `VITE_API_URL` was set **before** the build, not after. If you set it after, trigger a redeploy.
- Check the browser console for network errors — the API calls may be failing.

### API returns 404 on all routes
- Confirm that the backend's **Root Directory** in Vercel is set to `backend` (not the repo root).
- Verify that `backend/vercel.json` exists and routes everything to `api/index.js`.

---

## License

MIT