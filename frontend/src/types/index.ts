// Shared TypeScript interfaces used across the whole app

export interface User {
  id: string;
  email: string;
  username: string;
  is_active: boolean;
  created_at: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface VerifyResponse {
  authenticated: boolean;
  similarity_score: number;
}

export interface ApiErrorDetail {
  msg: string;
  [key: string]: unknown;
}

export interface ApiError {
  detail: string | ApiErrorDetail[];
}
