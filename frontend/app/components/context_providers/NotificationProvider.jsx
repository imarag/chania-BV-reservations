import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import Notification from "../utils/Notification";
import { NotificationContext } from "../../context/NotificationContext";

export default function NotificationProvider({ children }) {
  // { message: string, type: "info" | "success" | "error" }
  const [notification, setNotification] = useState(null);
  const timerRef = useRef(null);

  const hideNotification = useCallback(() => {
    setNotification(null);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const showNotification = useCallback(
    (message, type = "info", duration = 5000) => {
      if (timerRef.current) clearTimeout(timerRef.current);

      setNotification({ message, type });

      timerRef.current = setTimeout(() => {
        setNotification(null);
        timerRef.current = null;
      }, duration);
    },
    []
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const value = useMemo(() => ({ showNotification, hideNotification }), [
    showNotification,
    hideNotification,
  ]);

  return (
    <>
      <NotificationContext.Provider value={value}>
        {children}
      </NotificationContext.Provider>
      {notification && (
        <Notification {...notification} onClose={hideNotification} />
      )}
    </>
  );
}
