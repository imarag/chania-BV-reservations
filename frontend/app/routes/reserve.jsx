import ReservePage from "../components/pages/ReservePage";
import { useSearchParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { pagePaths } from "../utils/appUrls";
import { createPageMeta } from "../utils/page-info";
import { useNotification } from "../context/NotificationContext";
import { apiRequest } from "../utils/apiRequest";
import { apiEndpoints } from "../utils/appUrls";
import { useGlobalLoading } from "../context/GlobalLoadingContext";

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
  const { globalLoading, setGlobalLoading } = useGlobalLoading();

  useEffect(() => {
    let mounted = true;

    async function checkUserCanMakeReservation() {
      setGlobalLoading(true);

      const { resData, resError } = await apiRequest({
        url: apiEndpoints.VALIDATE_USER_CREATE_RESERVATION,
      });

      setGlobalLoading(false);

      if (!mounted) return;

      if (resError) {
        showNotification(resError, "error");
        navigate(pagePaths.home.path, { replace: true });
        return;
      }
    }
    checkUserCanMakeReservation();

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
