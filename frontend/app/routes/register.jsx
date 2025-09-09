import RegisterPage from "../components/pages/RegisterPage";
import { createPageMeta } from "../utils/page-info";

export function meta() {
  const title = "Register";
  const description =
    "Create an account to book volleyball courts, manage your reservations, and update your profile.";
  return createPageMeta(title, description);
}

export default function Register() {
  return <RegisterPage />;
}
