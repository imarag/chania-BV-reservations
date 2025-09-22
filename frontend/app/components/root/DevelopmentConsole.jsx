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

  async function clearAccessToken() {
    const { resData, resError } = await apiRequest({
      url: apiEndpoints.LOGOUT_USER,
      method: "POST",
    });
    alert("Succesfully cleared the access token");
  }

  function clearCurrentUser() {
    setCurrentUser(null);
    alert("Current user cleared succesfully!");
  }

  async function getAccessToken() {
    const { resData, resError } = await apiRequest({
      url: apiEndpoints.GET_ACCESS_TOKEN,
    });
    if (resData) {
      alert(resData);
    } else {
      alert(`NO REFRESH TOKEN FOUND`);
    }
  }

  return (
    <div className="z-50 fixed left-0 bottom-10 right-0 flex items-center justify-center gap-4">
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
        onClick={getAccessToken}
      >
        get access token
      </button>
      <button
        className="btn btn-error btn-outline btn-xs"
        onClick={clearAccessToken}
      >
        clear access token
      </button>
    </div>
  );
}
