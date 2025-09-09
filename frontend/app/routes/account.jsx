import AccountPage from "../components/pages/AccountPage";
import { createPageMeta } from "../utils/page-info";

export function meta() {
  const title = "My Account";
  const description =
    "View and update your profile, manage your bookings, and keep track of your volleyball court reservations.";
  return createPageMeta(title, description);
}

export default function Account() {
  return <AccountPage />;
}
