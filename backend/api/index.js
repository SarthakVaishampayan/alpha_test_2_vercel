// File: backend/api/index.js
// ─────────────────────────────────────────────────────────────────────────────
// Vercel Serverless Entry Point
//
// Vercel's @vercel/node runtime looks for a default export from the file
// specified in vercel.json. It passes (req, res) to it on every request.
// Express apps are fully compatible with this interface.
//
// The DB connection is handled lazily inside server.js via the middleware,
// so cold starts will connect on the first request and warm invocations
// will reuse the cached connection automatically.
// ─────────────────────────────────────────────────────────────────────────────

import app from "../server.js";

export default app;
