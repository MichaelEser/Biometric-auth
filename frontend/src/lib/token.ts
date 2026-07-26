// JWT client-side utilities:
//   decodeToken(jwt)          -> payload object
//   getExpiresAt(jwt)         -> Date
//   msUntilRefresh(jwt)       -> milliseconds (refresh 60s before expiry)
//   isExpired(jwt)            -> bool
export function decodeToken(token: string): Record<string, any> {
  const base64 = token.split(".")[1];
  const decoded = atob(base64);
  return JSON.parse(decoded);
}

export function getExpiresAt(token: string): Date {
  const payload = decodeToken(token);
  return new Date(payload.exp * 1000);
}

export function isExpired(token: string): boolean {
  return getExpiresAt(token) < new Date();
}

export function msUntilRefresh(token: string): number {
  const expiresAt = getExpiresAt(token);
  const refreshAt = new Date(expiresAt.getTime() - 60 * 1000);
  return refreshAt.getTime() - Date.now();
}