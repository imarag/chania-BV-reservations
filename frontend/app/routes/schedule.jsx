import SchedulePage from "../components/pages/SchedulePage";
import { createPageMeta } from "../utils/page-info";

export function meta() {
  const title = "Log into your acount | Chania BV";
  const description =
    "Register to book courts, manage reservations, and update your profile.";
  return createPageMeta(title, description);
}
export default function Schedule() {
  return <SchedulePage />;
}
