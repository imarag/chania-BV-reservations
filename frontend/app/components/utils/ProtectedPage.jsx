import { useEffect, useState } from "react";
import { apiRequest } from "../../utils/apiRequest";
import { apiEndpoints, pagePaths } from "../../utils/appUrls";
import { currentUserContext } from "../../context/currentUserContext.js";

export default function ProtectedPage({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        async function fetch_current_user() {
            const { resData } = await apiRequest({
                url: apiEndpoints.GET_CURRENT_USER,
                method: "get",
            });

            if (!resData) {
                window.location.replace(pagePaths.login.path);
            } else {
                setUser(resData);
            }
        }
        fetch_current_user();
    }, []);

    if (!user) return null;
    return (
        <currentUserContext.Provider value={user}>
            {children}
        </currentUserContext.Provider>
    );
}
