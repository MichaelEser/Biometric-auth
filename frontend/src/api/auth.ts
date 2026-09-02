// All auth HTTP calls via the shared Axios instance in lib/axios.ts
import type { AxiosRequestConfig } from "axios";
import api from "../lib/axios";
import type { TokenResponse } from "../types";

export function register(email: string, username: string, password: string, imageB64: string) {
  return api.post<TokenResponse>("/auth/register", { email, username, password, image_b64: imageB64 });
}

export function login(email: string, password: string, imageB64: string) {
  return api.post<TokenResponse>("/auth/login", { email, password, image_b64: imageB64 });
}

export function logout() {
  return api.post("/auth/logout");
}

export function refreshTokens(refreshToken: string) {
  return api.post<TokenResponse>("/auth/token/refresh", { refresh_token: refreshToken });
}

export function getCurrentUser(config?: AxiosRequestConfig) {
  return api.get("/users/me", config);
}
