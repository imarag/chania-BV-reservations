import { useState } from "react";
import Notification from "../utils/Notification";
import { notificationContext } from "../../context/notificationContext";

export default function NotificationProvider({ children }) {
  const [notification, setNotification] = useState(null);

  // showNotification sets the message and auto-clears it after 3s
  function showNotification(message, type = "info") {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  }

  return (
    <>
      <notificationContext.Provider value={{ showNotification }}>
        {children}
      </notificationContext.Provider>
      {notification && <Notification {...notification} />}
    </>
  );
}
