import ReservePage from "../components/pages/ReservePage";
import { useSearchParams, useNavigate } from "react-router";
import { useEffect } from "react";
import { pagePaths } from "../utils/appUrls";
import { createPageMeta } from "../utils/page-info";
import { useNotification } from "../context/NotificationContext";
import { useCurrentUser } from "../context/CurrentUserContext";

export function meta() {
  const title = "Reserve a Court";
  const description =
    "Book a volleyball court and manage your reservations with Chania BV.";
  return createPageMeta(title, description);
}

export default function Reserve() {
  const [reserveParams] = useSearchParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { currentUser } = useCurrentUser();

  useEffect(() => {
    if (currentUser && currentUser.can_make_reservation === false) {
      showNotification(
        "You cannot book another court because you already have a reservation.",
        "error"
      );
      navigate(pagePaths.home.path, { replace: true });
    }
  }, [currentUser, showNotification, navigate]);

  return (
    <ReservePage
      courtId={reserveParams.get("court_id")}
      timeslotId={reserveParams.get("timeslot_id")}
      userId={reserveParams.get("user_id")}
    />
  );
}
