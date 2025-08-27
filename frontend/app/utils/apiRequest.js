import axios from "axios";

export async function apiRequest({
    url,
    method = "get",
    requestData = {},
    customHeaders = {},
}) {
    try {
        const isFormData = requestData instanceof FormData;

        const response = await axios({
            url,
            method,
            data: requestData,
            responseType: "json",
            headers: {
                "Content-Type": isFormData
                    ? "multipart/form-data"
                    : "application/json",
                ...customHeaders,
            },
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
