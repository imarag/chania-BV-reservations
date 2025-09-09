import HomePage from "../components/pages/HomePage";
import { createPageMeta } from "../utils/page-info";

export function meta() {
  const title = "Home";
  const description =
    "Welcome to Chania BV. Book volleyball courts, manage your reservations, and stay connected with the community.";
  return createPageMeta(title, description);
}

export default function Home() {
  return <HomePage />;
}
