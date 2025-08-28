import axios from "axios";

export async function apiRequest({
    url,
    method = "get",
    requestData = {},
    customHeaders = {},
}) {
    try {
        const isFormData = requestData instanceof FormData;
        console.log("API Request:", {
            url,
            method,
            requestData,
            customHeaders,
        });

        const headers = {
            ...customHeaders,
        };

        if (typeof requestData === "object" && !isFormData) {
            headers["Content-Type"] = "application/json";
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
