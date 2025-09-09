import { useState, useEffect, useMemo, useCallback } from "react";
import { CurrentUserContext } from "../../context/CurrentUserContext";
import { useNotification } from "../../context/NotificationContext";
import { apiRequest } from "../../utils/apiRequest";
import { apiEndpoints } from "../../utils/appUrls";

export default function CurrentUserProvider({ children }) {
  const { showNotification } = useNotification();
  const [currentUser, setCurrentUser] = useState(null);

  const fetchCurrentUser = useCallback(async () => {
    const { resData, resError, canceled } = await apiRequest({
      url: apiEndpoints.GET_CURRENT_USER,
    });
    if (canceled) return;

    setCurrentUser(resData);
  }, [showNotification]);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const value = useMemo(
    () => ({ currentUser, refreshUser: fetchCurrentUser }),
    [currentUser, fetchCurrentUser]
  );

  return (
    <CurrentUserContext.Provider value={value}>
      {children}
    </CurrentUserContext.Provider>
  );
}
