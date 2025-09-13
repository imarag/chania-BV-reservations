import { useEffect, useState } from "react";
import { useNotification } from "../../context/NotificationContext";
import { useCurrentUser } from "../../context/CurrentUserContext";
import { useNavigate } from "react-router";
import { pagePaths } from "../../utils/appUrls";
import { Outlet } from "react-router";
import { apiEndpoints } from "../../utils/appUrls";
import Loading from "../ui/Loading";

export default function ProtectedPage() {
  const navigate = useNavigate();

  const { currentUser, setCurrentUser } = useCurrentUser();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    async function fetchCurrentUser() {
      const { resData, resError } = await apiRequest({
        url: apiEndpoints.GET_CURRENT_USER,
      });

      if (resError) {
        console.error(`Cannot get the current user: ${resError}`);
        setCurrentUser(null);
        setLoading(false);
        showNotification("Please log in to access this page.", "error");
        navigate(pagePaths.login.path, { replace: true });
        return;
      }

      console.warn("setting current user");
      setCurrentUser(resData);
      setLoading(false);
    }
    fetchCurrentUser();
    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-4 items-center">
        <p>Authenticating user...</p>
        <Loading />
      </div>
    );
  }

  return <Outlet />;
}
