import { useEffect, useState } from "react";
import { AppUrls } from "../utils/enumerators";
export default function AuthLinks() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(AppUrls.GetSessionUserAPI)
      .then(res => res.json())
      .then(data => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(AppUrls.LogoutAPI);
      if (res.ok) {
        setUser(null);
        window.location.href = AppUrls.HomePage; // Redirect to home page after logout
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return user ? (
    <>
      <p className="ms-auto">Welcome {user.email}</p>
      <a className="underline" href={AppUrls.LogoutAPI} onClick={handleLogout}>Logout</a>
    </>
  ) : (
    <>
      <a className="underline ms-auto" href={AppUrls.LoginPage}>Login</a>
      <a className="underline" href={AppUrls.RegisterPage}>Register</a>
    </>
  );
}
