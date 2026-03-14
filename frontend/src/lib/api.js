// Shared API helper used across the app.
//
// For local development, set:
//   VITE_API_URL=http://localhost:5000
//
// For single-project Vercel monorepo deploys, leave VITE_API_URL unset or empty
// so requests default to the same origin and hit /api/* on the same domain.

const rawApiBase = import.meta.env.VITE_API_URL;
const API_BASE =
  typeof rawApiBase === "string" && rawApiBase.trim().length > 0
    ? rawApiBase.trim().replace(/\/+$/, "")
    : "";

export const apiJson = async (
  path,
  { token, method = "GET", body, extraHeaders } = {},
) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  const res = await fetch(`${API_BASE}${normalizedPath}`, {
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

export { API_BASE };
