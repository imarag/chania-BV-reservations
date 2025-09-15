import AdminPage from "../components/pages/AdminPage";
import { apiEndpoints, pagePaths } from "../utils/appUrls";
import { apiRequest } from "../utils/apiRequest";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useNotification } from "../context/NotificationContext";
import { createPageMeta } from "../utils/page-info";
import Loading from "../components/ui/Loading";

export function meta() {
  const title = "Admin";
  const description = "Admin tools and management.";
  return createPageMeta(title, description);
}

export default function Admin() {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  // check user admin privileges
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function checkAdminUser() {
      const { resData, resError, canceled, resStatus } = await apiRequest({
        url: apiEndpoints.VALIDATE_USER_ADMIN,
      });
      if (!mounted || canceled) return;

      if (resError) {
        showNotification("You do not have admin access.", "error");
        navigate(pagePaths.home.path, { replace: true });
        return;
      }

      setChecking(false);
    }

    checkAdminUser();

    return () => {
      mounted = false;
    };
  }, [navigate, showNotification]);

  if (checking) return <Loading />;

  return <AdminPage />;
}
