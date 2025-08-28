import { useEffect } from "react";
import { apiRequest } from "../../utils/apiRequest";
import { apiEndpoints, pagePaths } from "../../utils/appUrls";

export default function ProtectedPage({ children }) {
    useEffect(() => {
        async function fetch_current_user() {
            const { resData, errorMessage } = await apiRequest({
                url: apiEndpoints.GET_CURRENT_USER,
                method: "get",
            });

            if (!resData) {
                window.location.replace(pagePaths.login.path);
            }
        }
        fetch_current_user();
    }, []);

    return <>{children}</>;
}
