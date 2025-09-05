export function saveToken(token) {
  if (!token) {
    console.warn("No token provided to save");
    return;
  }
  localStorage.setItem("token", token);
}

// Get token from localStorage
export function getToken() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("No token found in localStorage");
    return null;
  }
  return token;
}

// Optional: remove token (for logout)
export function removeToken() {
  localStorage.removeItem("token");
}
