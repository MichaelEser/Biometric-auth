// Custom hook — wraps Zustand authStore
// Returns: user, isAuthenticated, isLoading, login(), register(), logout()
// Handles silent token refresh automatically before expiry
import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import * as authApi from "../api/auth";
import * as biometricApi from "../api/biometric";
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
    const tokenRes = await authApi.login(email, password);
    const { access_token, refresh_token } = tokenRes.data;
    const authHeader = { headers: { Authorization: `Bearer ${access_token}` } };

    // Hold the token in memory until biometric verification also
    // succeeds. Persisting it to localStorage right after the password
    // check (as before) left a fully usable access token behind even
    // when the face scan failed or was never completed.
    await biometricApi.verifyFace(imageb64, authHeader);
    const userRes = await authApi.getCurrentUser(authHeader);

    setAuth(userRes.data, access_token, refresh_token);
  }

  async function register(email: string, username: string, password: string, imageb64: string) {
    const tokenRes = await authApi.register(email, username, password);
    const { access_token, refresh_token } = tokenRes.data;
    const authHeader = { headers: { Authorization: `Bearer ${access_token}` } };

    // Same reasoning as login(): don't persist tokens until enrollment
    // has actually succeeded.
    await biometricApi.enrollFace(imageb64, authHeader);
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
