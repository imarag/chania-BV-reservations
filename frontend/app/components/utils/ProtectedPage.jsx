import { useEffect, useState } from "react";
import { useNotification } from "../../context/NotificationContext";
import { useCurrentUser } from "../../context/CurrentUserContext";
import { useNavigate } from "react-router";
import { pagePaths } from "../../utils/appUrls";
import { Outlet } from "react-router";
import { apiEndpoints } from "../../utils/appUrls";
import Loading from "../ui/Loading";
import { apiRequest } from "../../utils/apiRequest";

export default function ProtectedPage() {
  const navigate = useNavigate();

  const { currentUser, setCurrentUser } = useCurrentUser();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchCurrentUser() {
      setLoading(true);

      const { resData, resError } = await apiRequest({
        url: apiEndpoints.GET_CURRENT_USER,
      });

      if (!mounted) return;

      setLoading(false);

      if (resError) {
        setCurrentUser(null);
        showNotification("Please log in to access this page.", "error");
        navigate(pagePaths.login.path, { replace: true });
        return;
      }

      setCurrentUser(resData);
    }
    fetchCurrentUser();
    return () => (mounted = false);
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
