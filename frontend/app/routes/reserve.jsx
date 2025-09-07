import ReservePage from "../components/pages/ReservePage";
import { useSearchParams } from "react-router";
import { useContext, useEffect } from "react";
import { NotificationContext } from "../context/NotificationContext";
import { CurrentUserContext } from "../context/CurrentUserContext";
import { useNavigate } from "react-router";
import { pagePaths } from "../utils/appUrls";

export function meta() {
  return [
    { title: "Register - React Router App" },
    {
      name: "description",
      content:
        "Create an account to access your data and manage your preferences.",
    },
  ];
}

export default function Reserve() {
  const [reserveParams] = useSearchParams();
  const navigate = useNavigate();
  const { showNotification } = useContext(NotificationContext);
  const currentUser = useContext(CurrentUserContext);
  useEffect(() => {
    if (currentUser && currentUser.can_make_reservation === false) {
      showNotification(
        "You cannot book another court because you already have a reservation.",
        "error"
      );
      navigate(pagePaths.home.path, { replace: true });
    }
  }, []);

  return (
    <ReservePage
      courtId={reserveParams.get("court_id")}
      timeslotId={reserveParams.get("timeslot_id")}
      userId={reserveParams.get("user_id")}
    />
  );
}
