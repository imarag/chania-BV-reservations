import {
  getAccessToken,
  clearAccessToken,
  setAccessToken,
} from "../../utils/authentication";
import { useCurrentUser } from "../../context/CurrentUserContext";
import { apiRequest } from "../../utils/apiRequest";
import { apiEndpoints } from "../../utils/appUrls";

export default function DevelopmentConsole() {
  const { currentUser, setCurrentUser } = useCurrentUser();

  function getCurrentUser() {
    if (currentUser) {
      let currentUserString = "";
      Object.keys(currentUser).forEach((key) => {
        currentUserString += `${key}: ${currentUser[key]}\n`;
      });
      alert(currentUserString);
    } else {
      alert("NO CURRENT USER FOUND");
    }
  }

  function getAccessTokenValue() {
    const token = getAccessToken();
    if (token) {
      alert(token);
    } else {
      alert("THERE IS NO ACCESS TOKEN");
    }
  }

  function clearAccessTokenValue() {
    clearAccessToken();
    alert("Succesfully cleared the access token");
  }

  async function createAccessToken() {
    const { resData, resError } = await apiRequest({
      url: apiEndpoints.REFRESH_TOKEN,
      method: "POST",
    });

    if (resError) {
      alert(`CANNOT CREATE ACCESS TOKEN: ${resError}`);
    } else {
      setAccessToken(resData.access_token);
      let accessTokenString = "";
      Object.keys(resData).forEach((key) => {
        accessTokenString += `${key}: ${resData[key]}\n`;
      });
      alert(`Access token created succesfully!:\n${accessTokenString}`);
    }
  }

  function clearCurrentUser() {
    setCurrentUser(null);
    alert("Current user cleared succesfully!");
  }

  async function getRefreshToken() {
    const { resData, resError } = await apiRequest({
      url: apiEndpoints.GET_REFRESH_TOKEN,
    });
    if (resData) {
      alert(resData);
    } else {
      alert(`NO REFRESH TOKEN FOUND`);
    }
  }

  return (
    <div className="fixed left-0 bottom-10 right-0 flex items-center justify-center gap-4">
      <button
        className="btn btn-primary btn-outline btn-xs"
        onClick={getCurrentUser}
      >
        get current user
      </button>
      <button
        className="btn btn-error btn-outline btn-xs"
        onClick={clearCurrentUser}
      >
        clear current user
      </button>
      <button
        className="btn btn-primary btn-outline btn-xs"
        onClick={getAccessTokenValue}
      >
        get access token
      </button>
      <button
        className="btn btn-error btn-outline btn-xs"
        onClick={clearAccessTokenValue}
      >
        clear access token
      </button>
      <button
        className="btn btn-secondary btn-outline btn-xs"
        onClick={createAccessToken}
      >
        create access token
      </button>
      <button
        className="btn btn-primary btn-outline btn-xs"
        onClick={getRefreshToken}
      >
        get refresh token
      </button>
    </div>
  );
}
