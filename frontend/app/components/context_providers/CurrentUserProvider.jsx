import { useState, useEffect, useMemo, useCallback } from "react";
import { CurrentUserContext } from "../../context/CurrentUserContext";
import { apiRequest } from "../../utils/apiRequest";
import { apiEndpoints } from "../../utils/appUrls";
import Loading from "../ui/Loading";
import { setAccessToken, clearAccessToken } from "../../utils/authentication";

export default function CurrentUserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the logged-in user's profile (requires a valid access token)
  const refreshUser = useCallback(async () => {
    const { resData, resError } = await apiRequest({
      url: apiEndpoints.GET_CURRENT_USER,
    });

    if (resError) {
      setCurrentUser(null);
      return;
    }

    setCurrentUser(resData);
  }, []);

  // On mount: try to mint an access token using the refresh cookie, then load user
  useEffect(() => {
    let mounted = true;

    (async () => {
      // Ask backend to use refresh cookie and mint a new access token
      const { resData, resError } = await apiRequest({
        url: apiEndpoints.REFRESH_TOKEN,
        method: "POST",
      });

      if (resError || !resData?.access_token) {
        clearAccessToken();
        if (mounted) {
          setCurrentUser(null);
          setLoading(false);
        }
        return;
      }
      console.warn("saving access token", resData);
      // Save the short-lived access token (in memory / where your util stores it)
      setAccessToken(resData.access_token);

      // Reuse refreshUser to populate the context
      if (mounted) {
        await refreshUser();
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [refreshUser]);

  useEffect(() => {
    let mounted = true;
    async function fetchCurrentUser() {
      const { resData, resError } = await apiRequest({
        url: apiEndpoints.GET_CURRENT_USER,
      });

      if (!mounted) {
        return;
      }

      if (resError) {
        setCurrentUser(null);
        return;
      }

      setCurrentUser(resData);
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
