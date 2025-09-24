import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import Notification from "../utils/Notification";
import { NotificationContext } from "../../context/NotificationContext";

export default function NotificationProvider({ children }) {
  // { message: string, type: string, show: boolean }
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "info") => {
    setNotification({ message, type, show: true });
  };

  const hideNotification = () => {
    setNotification((prev) => (prev ? { ...prev, show: false } : null));
  };

  const value = useMemo(() => ({ showNotification }), [showNotification]);

  return (
    <>
      <NotificationContext.Provider value={value}>
        {children}
      </NotificationContext.Provider>
      <Notification
        message={notification?.message}
        type={notification?.type}
        show={notification?.show}
        hideNotification={hideNotification}
      />
    </>
  );
}
