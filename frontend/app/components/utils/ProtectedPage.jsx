import { useContext, useEffect } from "react";
import { NotificationContext } from "../../context/NotificationContext";
import { CurrentUserContext } from "../../context/CurrentUserContext";
import { useNavigate } from "react-router";
import { pagePaths } from "../../utils/appUrls";

export default function ProtectedPage({ children }) {
  const navigate = useNavigate();

  const currentUser = useContext(CurrentUserContext);
  console.log(
    currentUser,
    "&&&&",
    currentUser?.can_make_reservation === false,
    currentUser?.can_make_reservation
  );
  const { showNotification } = useContext(NotificationContext);

  useEffect(() => {
    if (!currentUser) {
      showNotification("Please log in to access this page.", "error");
      navigate(pagePaths.login.path, { replace: true });
    }
  }, []);

  return <>{children}</>;
}
