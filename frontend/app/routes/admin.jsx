import AdminPage from "../components/pages/AdminPage";
import { apiEndpoints } from "../utils/appUrls";
import { apiRequest } from "../utils/apiRequest";
import { useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import { pagePaths } from "../utils/appUrls";
import { notificationContext } from "../context/notificationContext";

export default function Admin() {
  const { showNotification } = useContext(notificationContext);
  const navigate = useNavigate();
  useEffect(() => {
    async function checkAdminUser() {
      const { resData, errorMessage } = await apiRequest({
        url: apiEndpoints.IS_USER_ADMIN,
        method: "get",
      });

      if (errorMessage) {
        showNotification(errorMessage || "No admin access!", "error");
        navigate(pagePaths.home.path, { replace: true });
      }
    }
    checkAdminUser();
  }, []);

  return <AdminPage />;
}
