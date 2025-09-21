import axios from "axios";

export async function apiRequest({
  url,
  method = "get",
  requestData = null,
  customHeaders = {},
  timeoutMs = 30000,
  signal,
  responseType = "json",
} = {}) {
  const methodLower = String(method).toLowerCase().trim();
  const isFormData =
    typeof FormData !== "undefined" && requestData instanceof FormData;
  const hasBody = methodLower !== "get" && requestData != null;

  // headers
  const headers = { ...customHeaders };
  // Only set JSON content-type when sending a non-FormData body
  if (hasBody && !isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  try {
    const res = await axios({
      url,
      method: methodLower,
      params: methodLower === "get" ? requestData ?? undefined : undefined,
      data: methodLower !== "get" ? requestData ?? undefined : undefined,
      headers,
      responseType,
      signal,
      timeout: timeoutMs,
      withCredentials: true,
    });

    return {
      resData: res.data,
      resError: null,
      canceled: false,
      resStatus: res.status,
      resHeaders: res.headers,
    };
  } catch (error) {
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
      resStatus: error?.response?.status,
      resHeaders: error?.response?.headers,
    };
  }
}
