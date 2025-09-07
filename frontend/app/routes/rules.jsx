import RulesPage from "../components/pages/RulesPage";
import { createPageMeta } from "../utils/page-info";

export function meta() {
  const title = "Rules of BV | Chania BV";
  const description =
    "Register to book courts, manage reservations, and update your profile.";
  return createPageMeta(title, description);
}

export default function Login() {
  return <RulesPage />;
}
