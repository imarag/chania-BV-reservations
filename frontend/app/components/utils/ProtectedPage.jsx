import { useContext, useEffect } from "react";
import { notificationContext } from "../../context/notificationContext";
import { currentUserContext } from "../../context/currentUserContext";
import { useNavigate } from "react-router";
import { pagePaths } from "../../utils/appUrls";

export default function ProtectedPage({ children }) {
  const navigate = useNavigate();

  const { currentUser } = useContext(currentUserContext);
  const { showNotification } = useContext(notificationContext);

  useEffect(() => {
    if (!currentUser) {
      showNotification("Please log in to access this page.", "error");
      navigate(pagePaths.login.path, { replace: true });
    } else if (!currentUser?.can_create_reservation) {
      showNotification(
        "You cannot book another court because you already have a reservation.",
        "error"
      );
      navigate(pagePaths.home.path, { replace: true });
    }
  }, []);

  return <>{children}</>;
}
