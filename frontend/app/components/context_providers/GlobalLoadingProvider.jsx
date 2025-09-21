import { useState } from "react";
import { GlobalLoadingContext } from "../../context/GlobalLoadingContext";
import Spinner from "../ui/Spinner";

export default function CurrentUserProvider({ children }) {
  const [globalLoading, setGlobalLoading] = useState(false);

  return (
    <>
      <GlobalLoadingContext.Provider
        value={{ globalLoading, setGlobalLoading }}
      >
        {children}
      </GlobalLoadingContext.Provider>
      {globalLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Spinner size="extraLarge" />
        </div>
      )}
    </>
  );
}
