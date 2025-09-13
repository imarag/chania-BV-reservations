import axios from "axios";
import { getAccessToken } from "./authentication";
import { apiEndpoints } from "./appUrls";
import { refreshAccessToken } from "./authentication";

export async function apiRequest({
  url,
  method = "get",
  requestData = null,
  customHeaders = {},
  timeoutMs = 30000,
  signal,
  responseType = "json",
} = {}) {
  const methodLower = method.toLowerCase().trim();
  const isFormData = requestData instanceof FormData;
  const hasBody = methodLower !== "get" && requestData != null;

  // headers
  const headers = { ...customHeaders };
  if (hasBody && !isFormData) {
    headers["Content-Type"] = "application/json";
  }

  // if we have an access token use it to authenticate with Bearer
  let accessToken = getAccessToken();

  // if (!token && url !== apiEndpoints.REFRESH_TOKEN) {
  //   token = await refreshAccessToken();
  // }
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  } else {
    refreshAccessToken();
  }

  // a to perform the request
  async function doRequest(hdrs = headers) {
    return axios({
      url,
      method: methodLower,
      params: methodLower === "get" ? (requestData ?? undefined) : undefined,
      data: methodLower !== "get" ? (requestData ?? undefined) : undefined,
      headers: hdrs,
      responseType,
      signal,
      timeout: timeoutMs,
      withCredentials: true, // so cookies (refresh) are sent when needed
    });
  }

  try {
    const res = await doRequest();
    return {
      resData: res.data,
      resError: null,
      canceled: false,
      resStatus: res.status,
    };
  } catch (error) {
    if (
      error?.name === "CanceledError" ||
      error?.name === "AbortError" ||
      error?.code === "ERR_CANCELED"
    ) {
      console.warn("aborted!");
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
      resStatus: status,
    };

    // const status = error?.response?.status ?? null;

    // // If unauthorized (likely expired access token), try refresh once and retry
    // if (status === 401) {
    //   const newAccessToken = await refreshAccessToken();
    //   if (newAccessToken) {
    //     const retryHeaders = {
    //       ...headers,
    //       Authorization: `Bearer ${newAccessToken}`,
    //     };
    //     try {
    //       const res = await doRequest(retryHeaders);
    //       return {
    //         resData: res.data,
    //         resError: null,
    //         canceled: false,
    //         resStatus: res.status,
    //       };
    //     } catch (error) {
    //       console.error(error);
    //       // fall through to error formatting
    //     }
    //   }
    // }
  }
}
