// File: frontend/src/lib/api.js
// ─────────────────────────────────────────────────────────────────────────────
// Shared API helper used across the app.
//
// VITE_API_URL is the base URL of the backend:
//   - Local dev:  http://localhost:5000   (set in frontend/.env.local)
//   - Production: https://your-backend.vercel.app  (set in Vercel dashboard)
//
// All pages use `import.meta.env.VITE_API_URL` directly, so we keep the same
// variable here for consistency (previously this file used VITE_API_BASE).
// ─────────────────────────────────────────────────────────────────────────────

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const apiJson = async (
  path,
  { token, method = "GET", body, extraHeaders } = {},
) => {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(extraHeaders || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  return { res, data };
};
