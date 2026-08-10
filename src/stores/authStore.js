const USER_KEY = "edutrack_user";
const TOKEN_KEY = "edutrack_auth_token";
const LEGACY_TOKEN_KEY = "edutrack_demo_token";

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
}

export function setAuthSession(user, token) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.removeItem(LEGACY_TOKEN_KEY);
}

export function updateStoredUser(patch) {
  const user = getStoredUser();
  if (!user) return null;
  const updated = { ...user, ...patch };
  localStorage.setItem(USER_KEY, JSON.stringify(updated));
  return updated;
}

export function clearAuthSession() {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(LEGACY_TOKEN_KEY);
}

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY) || localStorage.getItem(LEGACY_TOKEN_KEY);
}

export function hasAuthSession() {
  return Boolean(getStoredUser() && getAuthToken());
}
