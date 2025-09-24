import { useState } from "react";
import Button from "../ui/Button";
import { waitSec } from "../../utils/fetch-tools";

export default function DataFetchRetry({
  errorMessage,
  retryFetchDataFunc,
  setData,
  setError,
}) {
  const [loading, setLoading] = useState(false);

  async function handleFetch() {
    setLoading(true);

    await waitSec(2);

    const { resData, resError } = await retryFetchDataFunc();

    setLoading(false);

    if (resError) {
      setError(resError);
      setData([]);
      return;
    }

    setError(null);
    setData(resData);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-error">{errorMessage}</p>
      <Button onClick={handleFetch} disabled={loading}>
        {loading ? "Retrying..." : "Try again"}
      </Button>
    </div>
  );
}
