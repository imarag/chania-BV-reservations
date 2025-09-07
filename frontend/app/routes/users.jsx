import UsersPage from "../components/pages/UsersPage";
import { createPageMeta } from "../utils/page-info";

export function meta() {
  const title = "Log into your acount | Chania BV";
  const description =
    "Register to book courts, manage reservations, and update your profile.";
  return createPageMeta(title, description);
}
export default function Home() {
  return <UsersPage />;
}
