let storageAvailable = true;

export const TOKEN_STORAGE_KEY = 'smartwaste_token';

export function getToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!storageAvailable) {
    return null;
  }

  try {
    return window.localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    storageAvailable = false;
    return null;
  }
}

export function setToken(token: string | null): void {
  if (typeof window === 'undefined') {
    return;
  }

  if (!storageAvailable) {
    return;
  }

  try {
    if (token) {
      window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  } catch {
    storageAvailable = false;
  }
}
