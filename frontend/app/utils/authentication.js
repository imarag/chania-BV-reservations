import { apiRequest } from "./apiRequest";
import { apiEndpoints } from "./appUrls";
import axios from "axios";
let ACCESS_TOKEN = null;

export function setAccessToken(token) {
  ACCESS_TOKEN = token || null;
}

export function getAccessToken() {
  return ACCESS_TOKEN;
}

export function clearAccessToken() {
  ACCESS_TOKEN = null;
}

/**
 * Try to mint an access token using the refresh cookie.
 * Call this once on app startup (new tab / reload).
 * Returns true if logged in, false otherwise.
 */
export async function initAccessToken() {
  try {
    const { resData, resError } = await apiRequest({
      url: apiEndpoints.REFRESH_TOKEN,
      status: "POST",
    });

    if (resError) {
      return false;
    }

    setAccessToken(resData.access_token);
    return true;
  } catch {
    clearAccessToken();
    return false;
  }
}

export async function refreshAccessToken() {
  try {
    const res = await axios.post(
      apiEndpoints.REFRESH_TOKEN,
      {},
      { withCredentials: true }
    );
    const token = res?.data?.access_token;
    if (token) setAccessToken(token);
    return token ?? null;
  } catch {
    clearAccessToken();
    return null;
  }
}
