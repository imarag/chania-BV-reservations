import { useState, useEffect } from "react";
import { currentUserContext } from "../../context/currentUserContext";
import { apiRequest } from "../../utils/apiRequest";
import { apiEndpoints } from "../../utils/appUrls";

export default function currentUserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    async function fetchCurrentUser() {
      const { resData: user } = await apiRequest({
        url: apiEndpoints.GET_CURRENT_USER,
        method: "get",
      });
      setCurrentUser(user);
    }
    fetchCurrentUser();
  }, []);
  return (
    <currentUserContext.Provider value={currentUser}>
      {children}
    </currentUserContext.Provider>
  );
}
