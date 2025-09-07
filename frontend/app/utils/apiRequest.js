// utils/apiRequest.js
import axios from "axios";
import { getToken } from "./authentication";

export async function apiRequest({
  url,
  method = "get",
  requestData = {},
  customHeaders = {},
  signal, // ✅ accept AbortController signal
}) {
  try {
    const isFormData = requestData instanceof FormData;

    const headers = { ...customHeaders };
    if (typeof requestData === "object" && !isFormData) {
      headers["Content-Type"] = "application/json";
    }

    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await axios({
      url,
      method,
      data: requestData,
      responseType: "json",
      headers,
      signal, // ✅ pass the signal to axios (v1 supports this)
    });

    return {
      resData: response.data,
      errorMessage: null,
      canceled: false,
      status: response.status,
    };
  } catch (error) {
    // ✅ Axios cancellation check (works with AbortController)
    if (
      axios.isCancel?.(error) ||
      error?.name === "CanceledError" ||
      error?.code === "ERR_CANCELED"
    ) {
      return {
        resData: null,
        errorMessage: null,
        canceled: true,
        status: null,
      };
    }

    const globalErrorMessage =
      error?.response?.data?.error_message ||
      error?.response?.data?.detail ||
      error?.message ||
      "An unexpected error occurred. Please try again later.";

    return {
      resData: null,
      errorMessage: globalErrorMessage,
      canceled: false,
      status: error?.response?.status ?? null,
    };
  }
}
