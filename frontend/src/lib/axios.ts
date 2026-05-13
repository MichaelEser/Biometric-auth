// Shared Axios instance with:
//   baseURL = /api (proxied to backend via Vite)
//   request interceptor  — attaches Authorization: Bearer <token>
//   response interceptor — on 401: call refreshTokens(), retry once
//   on refresh fail      — clearAuth(), redirect to /login
