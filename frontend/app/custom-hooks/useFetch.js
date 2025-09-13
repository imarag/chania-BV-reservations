import { useEffect, useState } from "react";

export default function useFetch({
  makeRequest,
  deps = [],
  initialData = null,
  successMessage = null,
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [data, setData] = useState(initialData);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      setLoading(true);
      setError(null);
      setSuccess(null);

      try {
        const { resData, resError, canceled } = await makeRequest(
          controller.signal
        );

        if (resError) {
          setError(resError);
          setSuccess(null);
          return;
        }

        setData(resData);
        if (successMessage) setSuccess(successMessage);
      } catch (err) {
        setError(msg);
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    return () => {
      controller.abort();
    };
  }, [makeRequest, ...deps]);

  return { data, setData, loading, error, success };
}
