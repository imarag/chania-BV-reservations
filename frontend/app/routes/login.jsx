import LoginPage from "../components/pages/LoginPage";
import { createPageMeta } from "../utils/page-info";

export function meta() {
  const title = "Login";
  const description =
    "Log in to book volleyball courts, manage your reservations, and update your profile.";
  return createPageMeta(title, description);
}

export default function Login() {
  return <LoginPage />;
}
