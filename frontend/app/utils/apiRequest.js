import axios from "axios";
import { getToken } from "./authentication";

export async function apiRequest({
  url,
  method = "get",
  requestData = null,
  customHeaders = {},
  timeoutMs = 30000, // milliseconds
  signal = undefined,
  responseType = "json",
}) {
  try {
    const methodLower = method.toLowerCase();

    const isFormData = requestData instanceof FormData;
    const hasBody = methodLower !== "get" && requestData != null;

    const headers = { ...customHeaders };

    // Only set JSON content-type when sending a body and not FormData
    if (hasBody && !isFormData) {
      headers["Content-Type"] = "application/json";
    }

    // Add JWT unless caller already provided Authorization
    const token = getToken();
    if (token && !headers.Authorization) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await axios({
      url,
      method: methodLower,
      params: methodLower === "get" ? requestData ?? undefined : undefined, // query string for GET
      data: methodLower !== "get" ? requestData ?? undefined : undefined, // request body for non-GET
      headers,
      responseType, // always a string (e.g., "json", "blob", "arraybuffer")
      signal, // enables AbortController cancellation
      timeout: timeoutMs, // ms
    });

    return {
      resData: res.data,
      resError: null,
      canceled: false,
      resStatus: res.status,
    };
  } catch (error) {
    // Aborted via AbortController
    if (
      error?.name === "CanceledError" ||
      error?.name === "AbortError" ||
      error?.code === "ERR_CANCELED"
    ) {
      return {
        resData: null,
        resError: null,
        canceled: true,
        resStatus: null,
      };
    }

    const msg =
      error?.response?.data?.error_message ??
      error?.response?.data?.detail ??
      error?.response?.data?.message ??
      error?.message ??
      "An unexpected error occurred. Please try again later.";

    return {
      resData: null,
      resError: msg,
      canceled: false,
      resStatus: error?.response?.status ?? null,
    };
  }
}
