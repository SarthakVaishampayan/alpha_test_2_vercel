import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Route Imports
import authRoutes from "./routes/auth.js";
import habitRoutes from "./routes/habits.js";
import sessionRoutes from "./routes/sessions.js";
import taskRoutes from "./routes/tasks.js";
import reminderRoutes from "./routes/reminders.js";
import subjectRoutes from "./routes/subjects.js";
import dailyGoalRoutes from "./routes/dailyGoal.js";
import marksRoutes from "./routes/marks.js";
import linksRoutes from "./routes/links.js";

dotenv.config();

const app = express();

// ─── CORS ─────────────────────────────────────────────────────────────────────
// Set CLIENT_URL in Vercel env to your deployed frontend URL
// e.g. https://studybuddy.vercel.app
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow requests with no origin (curl, Postman, mobile apps)
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

// ─── MongoDB Connection (serverless-safe with caching) ────────────────────────
// In serverless environments, module state is reused between warm invocations.
// We cache the connection so we don't open a new one on every request.
let isConnected = false;

const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return; // Already connected — reuse the existing connection
  }

  const mongoUri =
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/studybuddy";

  try {
    mongoose.set("strictQuery", false);

    await mongoose.connect(mongoUri, {
      // These settings help with serverless connection reuse
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    isConnected = true;
    console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
    console.log(`🗄️  DB Name: ${mongoose.connection.name}`);
  } catch (error) {
    isConnected = false;
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Do NOT call process.exit() — in serverless this kills the function host
    throw error;
  }
};

// Middleware: ensure DB is connected before every API request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("DB middleware error:", error.message);
    res.status(503).json({
      success: false,
      message: "Database unavailable. Please try again later.",
    });
  }
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/daily-goal", dailyGoalRoutes);
app.use("/api/marks", marksRoutes);
app.use("/api/links", linksRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "online",
    message: "StudyBuddy API is running",
    environment: process.env.NODE_ENV || "development",
    dbState:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

// ─── 404 fallback for unknown API routes ─────────────────────────────────────
app.use("/api/*", (req, res) => {
  res.status(404).json({ success: false, message: "API route not found" });
});

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// ─── Local Dev Server ─────────────────────────────────────────────────────────
// process.env.VERCEL is automatically set to "1" by Vercel's build system.
// When running locally with `npm run dev` or `npm start`, it won't be set,
// so the server will start normally.
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;

  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`🧪 Health: http://localhost:${PORT}/api/health`);
        console.log(
          `🌐 Allowed origins: ${
            allowedOrigins.length ? allowedOrigins.join(", ") : "(none set)"
          }`,
        );
      });
    })
    .catch((err) => {
      console.error("Failed to start server:", err.message);
    });
}

// ─── Export for Vercel Serverless ─────────────────────────────────────────────
// Vercel's @vercel/node runtime imports this file and calls the default export
// as a serverless function handler (it's compatible with Express apps).
export default app;
