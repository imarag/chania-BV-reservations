import { useState } from "react";
import Button from "../ui/Button";
import { waitSec } from "../../utils/fetch-tools";
export default function FetchErrorMessage({
  errorMessage,
  fetchFunc,
  setData,
  setError,
}) {
  const [loading, setLoading] = useState(false);

  async function handleFetch() {
    setLoading(true);
    await waitSec(2);
    const { resData, resError, canceled } = await fetchFunc();
    setLoading(false);

    if (canceled) return;

    if (resError) {
      return;
    }
    setError(null);
    setData(resData);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-red-500">{errorMessage}</p>
      <Button onClick={handleFetch} disabled={loading}>
        {loading ? "Retrying..." : "Try again"}
      </Button>
    </div>
  );
}
