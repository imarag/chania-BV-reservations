import SchedulePage from "../components/pages/SchedulePage";
import { createPageMeta } from "../utils/page-info";

export function meta() {
  const title = "Schedule";
  const description =
    "View the volleyball court schedule and book your preferred time slot with Chania BV.";
  return createPageMeta(title, description);
}

export default function Schedule() {
  return <SchedulePage />;
}
