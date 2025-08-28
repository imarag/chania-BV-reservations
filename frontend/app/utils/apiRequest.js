import axios from "axios";
import { getToken } from "./authentication";

export async function apiRequest({
    url,
    method = "get",
    requestData = {},
    customHeaders = {},
}) {
    try {
        const isFormData = requestData instanceof FormData;

        const headers = {
            ...customHeaders,
        };

        // Add Content-Type for JSON data
        if (typeof requestData === "object" && !isFormData) {
            headers["Content-Type"] = "application/json";
        }

        // Add Authorization header if token exists
        const token = getToken();
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await axios({
            url,
            method,
            data: requestData,
            responseType: "json",
            headers: headers,
        });

        return { resData: response.data, errorMessage: null };
    } catch (error) {
        const globalErrorMessage =
            error?.response?.data?.error_message ||
            error?.response?.data?.detail ||
            error?.message ||
            "An unexpected error occurred. Please try again later.";

        return { resData: null, errorMessage: globalErrorMessage };
    }
}
