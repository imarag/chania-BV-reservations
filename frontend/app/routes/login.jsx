import LoginPage from "../components/pages/LoginPage";
import { createPageMeta } from "../utils/page-info";

export function meta() {
  const title = "Log into your acount | Chania BV";
  const description =
    "Register to book courts, manage reservations, and update your profile.";
  return createPageMeta(title, description);
}

export default function Login() {
  return <LoginPage />;
}
