import RulesPage from "../components/pages/RulesPage";
import { createPageMeta } from "../utils/page-info";

export function meta() {
  const title = "Rules";
  const description =
    "Read the rules and guidelines for playing and booking volleyball courts at Chania BV.";
  return createPageMeta(title, description);
}

export default function Rules() {
  return <RulesPage />;
}
