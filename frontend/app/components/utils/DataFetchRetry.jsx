import { useState } from "react";
import Button from "../ui/Button";
import { waitSec } from "../../utils/fetch-tools";

export default function DataFetchRetry({ errorMessage, retryFetchDataFunc }) {
  const [fetchLoading, setFetchLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  async function handleFetch() {
    setFetchLoading(true);
    setLocalError(null);

    await waitSec(2);

    try {
      await retryFetchDataFunc();
    } catch (err) {
      setLocalError(err.message || "Failed to fetch data.");
    }

    setFetchLoading(false);
  }

  return (
    <div className="size-full flex flex-col justify-center items-center gap-4">
      <div className="flex flex-col justify-center items-center gap-4">
        <p className="text-error">{localError || errorMessage}</p>
        <Button onClick={handleFetch} disabled={fetchLoading}>
          {fetchLoading ? "Retrying..." : "Try again"}
        </Button>
      </div>
    </div>
  );
}
