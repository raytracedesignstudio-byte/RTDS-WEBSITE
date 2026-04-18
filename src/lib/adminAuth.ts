const ADMIN_TOKEN_KEY = "rtds-admin-token";

export function getAdminToken(): string {
  if (typeof window === "undefined") {
    return "";
  }
  return localStorage.getItem(ADMIN_TOKEN_KEY) || "";
}

export function setAdminToken(token: string): void {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken(): void {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export function hasAdminToken(): boolean {
  return getAdminToken().length > 0;
}
