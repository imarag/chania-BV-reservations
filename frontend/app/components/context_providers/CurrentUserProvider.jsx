import { useState, useEffect, useMemo, useCallback } from "react";
import { CurrentUserContext } from "../../context/CurrentUserContext";
import { apiRequest } from "../../utils/apiRequest";
import { apiEndpoints } from "../../utils/appUrls";

export default function CurrentUserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchCurrentUser() {
      setLoading(true);
      const { resData, resError } = await apiRequest({
        url: apiEndpoints.GET_CURRENT_USER,
      });

      if (!mounted) {
        return;
      }

      setLoading(false);

      if (resError) {
        setCurrentUser(null);
        return;
      }

      setCurrentUser(resData);
    }
    fetchCurrentUser();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </CurrentUserContext.Provider>
  );
}
