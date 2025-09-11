import { useState, useEffect, useMemo, useCallback } from "react";
import { CurrentUserContext } from "../../context/CurrentUserContext";
import { apiRequest } from "../../utils/apiRequest";
import { apiEndpoints } from "../../utils/appUrls";
import Loading from "../ui/Loading";
import { setAccessToken, clearAccessToken } from "../../utils/authentication";

export default function CurrentUserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function updateAccessFromRefreshToken() {
      setLoading(true);
      // get a new access token
      const { resData, resError } = await apiRequest({
        url: apiEndpoints.REFRESH_TOKEN,
        method: "POST",
      });

      clearAccessToken();

      if (!mounted) {
        return;
      }

      if (resError || !resData?.access_token) {
        console.error(`Cannot update access token: ${resError}`);
        setLoading(false);
        return;
      }
      console.warn("saving access token", resData);

      setAccessToken(resData.access_token);
      setLoading(false);
    }
    updateAccessFromRefreshToken();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    async function fetchCurrentUser() {
      const { resData, resError } = await apiRequest({
        url: apiEndpoints.GET_CURRENT_USER,
      });

      if (!mounted) {
        return;
      }

      if (resError) {
        console.error(`Cannot get the current user: ${resError}`);
        setCurrentUser(null);
        setLoading(false);
        return;
      }
      console.warn("setting current user");
      setCurrentUser(resData);
      setLoading(false);
    }
    fetchCurrentUser();
    return () => {
      mounted = false;
    };
  }, []);

  const value = useMemo(() => ({ currentUser, setCurrentUser }), [
    currentUser,
    setCurrentUser,
  ]);

  if (loading) {
    return <Loading />;
  }

  return (
    <CurrentUserContext.Provider value={value}>
      {children}
    </CurrentUserContext.Provider>
  );
}
