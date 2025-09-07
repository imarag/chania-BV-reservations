import { useEffect, useState } from "react";
import { apiRequest } from "../../utils/apiRequest";
import { apiEndpoints } from "../../utils/appUrls";
import { CurrentUserContext } from "../../context/CurrentUserContext";

export default function CurrentUserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchCurrentUser() {
      const { resData, canceled } = await apiRequest({
        url: apiEndpoints.GET_CURRENT_USER,
        method: "get",
        signal: controller.signal,
      });

      if (!canceled) {
        setCurrentUser(resData ?? null);
      }
    }
    fetchCurrentUser();
    return () => controller.abort();
  }, []);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      {children}
    </CurrentUserContext.Provider>
  );
}
