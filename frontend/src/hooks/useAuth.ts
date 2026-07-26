// Custom hook — wraps Zustand authStore
// Returns: user, isAuthenticated, isLoading, login(), logout()
// Handles silent token refresh automatically before expiry
import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import api from "../lib/axios";
import { isExpired, msUntilRefresh } from "../lib/token";

export function useAuth() {
  const { user, accessToken, status, setAuth, clearAuth } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token || isExpired(token)) {
      clearAuth();
      return;
    }

    api.get("/users/me").then((res) => {
      const refreshToken = localStorage.getItem("refresh_token") || "";
      setAuth(res.data, token, refreshToken);

      const ms = msUntilRefresh(token);
      if (ms > 0) {
        setTimeout(async () => {
          try {
            const refreshRes = await api.post("/auth/token/refresh", {
              refresh_token: refreshToken,
            });
            setAuth(res.data, refreshRes.data.access_token, refreshRes.data.refresh_token);
          } catch {
            clearAuth();
          }
        }, ms);
      }
    }).catch(() => {
      clearAuth();
    });
  }, []);

  async function login(email: string, password: string, imageb64: string) {
    const tokenRes = await api.post("/auth/login", { email, password });
    const { access_token, refresh_token } = tokenRes.data;
    localStorage.setItem("access_token", access_token);

    await api.post("/biometric/verify", { image_b64: imageb64 });

    const userRes = await api.get("/users/me");
    setAuth(userRes.data, access_token, refresh_token);
  }

  async function register(email: string, username: string, password: string, imageb64: string) {
    const tokenRes = await api.post("/auth/register", { email, username, password });
    const { access_token, refresh_token } = tokenRes.data;
    localStorage.setItem("access_token", access_token);

    await api.post("/biometric/enroll", { image_b64: imageb64 });

    const userRes = await api.get("/users/me");
    setAuth(userRes.data, access_token, refresh_token);
  }

  async function logout() {
    try {
      await api.post("/auth/logout");
    } finally {
      clearAuth();
    }
  }

  return { user, accessToken, status, login, register, logout };
}