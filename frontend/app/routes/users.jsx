import UsersPage from "../components/pages/UsersPage";
import { createPageMeta } from "../utils/page-info";

export function meta() {
  const title = "Users";
  const description =
    "Browse and manage registered users of Chania BV. View profiles, reservations, and account details.";
  return createPageMeta(title, description);
}

export default function Users() {
  return <UsersPage />;
}
