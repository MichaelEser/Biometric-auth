// Zustand global store for authentication state
// State: user, accessToken, status ("loading"|"authenticated"|"guest")
// Actions: setAuth(), clearAuth()
import { create } from "zustand";
import type { User } from "../types";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  status: "loading" | "authenticated" | "guest";
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  status: "loading",

  setAuth: (user, accessToken, refreshToken) => {
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
    set({ user, accessToken, status: "authenticated" });
  },

  clearAuth: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    set({ user: null, accessToken: null, status: "guest" });
  },
}));