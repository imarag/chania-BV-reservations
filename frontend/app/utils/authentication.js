const KEY = "app:jwt_access_token";
const storages = ["session", "local"];

function getStorage(persist = "session") {
  if (typeof window === "undefined") return null;
  if (!storages.includes(persist)) persist = "session";
  return persist === "session" ? window.sessionStorage : window.localStorage;
}

export function saveToken(token, persist = "session") {
  if (!token || typeof window === "undefined") return false;
  const store = getStorage(persist);
  if (!store) return false;
  try {
    store.setItem(KEY, token);
    return true;
  } catch {
    return false;
  }
}

export function getToken() {
  if (typeof window === "undefined") return null;
  try {
    return (
      window.sessionStorage.getItem(KEY) || window.localStorage.getItem(KEY)
    );
  } catch {
    return null;
  }
}

export function removeToken() {
  if (typeof window === "undefined") return false;
  let removedToken = false;
  try {
    window.sessionStorage.removeItem(KEY);
    removedToken = true;
  } catch {
    console.error("cannot remove token");
  }
  try {
    window.localStorage.removeItem(KEY);
    removedToken = true;
  } catch {
    console.error("cannot remove token");
  }
  return removedToken;
}
