// JWT client-side utilities:
//   decodeToken(jwt)          -> payload object, or null if malformed
//   getExpiresAt(jwt)         -> Date, or null if malformed
//   msUntilRefresh(jwt)       -> milliseconds (refresh 60s before expiry)
//   isExpired(jwt)            -> bool
//
// JWTs are base64URL-encoded ('-'/'_' instead of '+'/'/', no padding).
// Calling the browser's atob() directly on that segment throws an
// InvalidCharacterError whenever the token happens to contain '-' or '_'
// (i.e. unpredictably, depending on the token's content) — and with no
// error boundary around the app, that throw during the mount-time auth
// check was enough to unmount the whole React tree and expose the near-
// black page background. decodeToken now normalizes to standard base64
// and never throws.

function base64UrlDecode(segment: string): string {
  const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  return atob(padded);
}

export function decodeToken(token: string): Record<string, any> | null {
  try {
    const segment = token.split(".")[1];
    if (!segment) return null;
    return JSON.parse(base64UrlDecode(segment));
  } catch {
    return null;
  }
}

export function getExpiresAt(token: string): Date | null {
  const payload = decodeToken(token);
  if (!payload || typeof payload.exp !== "number") return null;
  return new Date(payload.exp * 1000);
}

export function isExpired(token: string): boolean {
  const expiresAt = getExpiresAt(token);
  return expiresAt === null || expiresAt < new Date();
}

export function msUntilRefresh(token: string): number {
  const expiresAt = getExpiresAt(token);
  if (expiresAt === null) return -1;
  const refreshAt = new Date(expiresAt.getTime() - 60 * 1000);
  return refreshAt.getTime() - Date.now();
}
