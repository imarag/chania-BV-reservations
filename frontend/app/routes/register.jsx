import RegisterPage from "../components/pages/RegisterPage";
import { createPageMeta } from "../utils/page-info";

export function meta() {
  const title = "Create your account | Chania BV";
  const description =
    "Register to book courts, manage reservations, and update your profile.";
  return createPageMeta(title, description);
}

export default function Register() {
  return <RegisterPage />;
}
