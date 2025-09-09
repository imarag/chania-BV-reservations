import { useEffect } from "react";
import { useNotification } from "../../context/NotificationContext";
import { useCurrentUser } from "../../context/CurrentUserContext";
import { useNavigate } from "react-router";
import { pagePaths } from "../../utils/appUrls";
import { Outlet } from "react-router";

export default function ProtectedPage() {
  const navigate = useNavigate();

  const { currentUser } = useCurrentUser();
  const { showNotification } = useNotification();

  useEffect(() => {
    if (!currentUser) {
      showNotification("Please log in to access this page.", "error");
      navigate(pagePaths.login.path, { replace: true });
    }
  }, []);

  return <Outlet />;
}
