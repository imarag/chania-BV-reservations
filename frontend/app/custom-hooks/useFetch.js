import { useEffect, useState } from "react";
import { apiRequest } from "../utils/apiRequest";

export default function useFetch({
  url,
  method = "get",
  requestData = null,
  headers = {},
  successMessage = null,
  initialData = null,
  showNotification = () => {},
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // string | null
  const [success, setSuccess] = useState(null); // string | null
  const [data, setData] = useState(initialData);

  useEffect(() => {
    if (!url) return;
    const controller = new AbortController();

    async function fetchData() {
      setLoading(true);
      setError(null);
      setSuccess(null);
      const { resData, resError, canceled } = await apiRequest({
        url,
        method,
        requestData,
        customHeaders: headers,
        responseType: "json",
        signal: controller.signal,
      });
      // If request was aborted (deps changed or unmounted), do nothing.
      if (canceled) return;

      if (resError) {
        setError(resError);
        setSuccess(null);
        setLoading(false);
        showNotification(resError, "error");
        return;
      }

      setData(resData);
      setSuccess(successMessage || "Request successful");
      setLoading(false);
    }

    fetchData();
    return () => {
      controller.abort();
    };
  }, [url, method, requestData, JSON.stringify(headers), successMessage]);

  return { data, setData, loading, error, success };
}
