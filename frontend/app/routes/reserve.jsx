import ReservePage from "../components/pages/ReservePage";
import { useSearchParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { pagePaths } from "../utils/appUrls";
import { createPageMeta } from "../utils/page-info";
import { useNotification } from "../context/NotificationContext";
import { apiRequest } from "../utils/apiRequest";
import { apiEndpoints } from "../utils/appUrls";
import { useGlobalLoading } from "../context/GlobalLoadingContext";
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
  const { currentUser, setCurrentUser } = useCurrentUser();
  const { globalLoading, setGlobalLoading } = useGlobalLoading();

  useEffect(() => {
    let mounted = true;
    console.log("current user2", currentUser);
    async function checkUserCanMakeReservation() {
      setGlobalLoading(true);
      const { resData, resError } = await apiRequest({
        url: apiEndpoints.VALIDATE_USER_CREATE_RESERVATION,
      });

      await new Promise((r) => setTimeout(r, 3000)); // to avoid flickering

      setGlobalLoading(false);

      if (!mounted) return;

      if (resError) {
        showNotification(resError, "error");
        navigate(pagePaths.home.path, { replace: true });
        return;
      }
    }
    console.log("current user", currentUser);
    if (!currentUser.can_make_reservation) {
      console.log("user is alrady checked");
      checkUserCanMakeReservation();
    }

    return () => {
      mounted = false;
    };
  }, [navigate, showNotification]);

  return (
    <ReservePage
      courtId={reserveParams.get("court_id")}
      timeslotId={reserveParams.get("timeslot_id")}
      userId={reserveParams.get("user_id")}
    />
  );
}
