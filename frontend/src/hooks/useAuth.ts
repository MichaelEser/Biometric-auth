// Custom hook — wraps Zustand authStore
// Returns: user, isAuthenticated, isLoading, login(), register(), logout()
// Handles silent token refresh automatically before expiry
import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import * as authApi from "../api/auth";
import { isExpired, msUntilRefresh } from "../lib/token";

export function useAuth() {
  const { user, accessToken, status, setAuth, clearAuth } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token || isExpired(token)) {
      clearAuth();
      return;
    }

    authApi
      .getCurrentUser({ headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        const refreshToken = localStorage.getItem("refresh_token") || "";
        setAuth(res.data, token, refreshToken);

        const ms = msUntilRefresh(token);
        if (ms > 0) {
          setTimeout(async () => {
            try {
              const refreshRes = await authApi.refreshTokens(refreshToken);
              setAuth(res.data, refreshRes.data.access_token, refreshRes.data.refresh_token);
            } catch {
              clearAuth();
            }
          }, ms);
        }
      })
      .catch(() => {
        clearAuth();
      });
  }, []);

  async function login(email: string, password: string, imageb64: string) {
    // The backend verifies both factors before returning usable tokens.
    const tokenRes = await authApi.login(email, password, imageb64);
    const { access_token, refresh_token } = tokenRes.data;
    const authHeader = { headers: { Authorization: `Bearer ${access_token}` } };
    const userRes = await authApi.getCurrentUser(authHeader);

    setAuth(userRes.data, access_token, refresh_token);
  }

  async function register(email: string, username: string, password: string, imageb64: string) {
    // Account creation and face enrollment are one backend transaction.
    const tokenRes = await authApi.register(email, username, password, imageb64);
    const { access_token, refresh_token } = tokenRes.data;
    const authHeader = { headers: { Authorization: `Bearer ${access_token}` } };
    const userRes = await authApi.getCurrentUser(authHeader);

    setAuth(userRes.data, access_token, refresh_token);
  }

  async function logout() {
    try {
      await authApi.logout();
    } finally {
      clearAuth();
    }
  }

  return { user, accessToken, status, login, register, logout };
}
