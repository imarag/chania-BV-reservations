import ReservePage from "../components/pages/ReservePage";
import { useSearchParams } from "react-router";
import ProtectedPage from "../components/utils/ProtectedPage";

export function meta() {
  return [
    { title: "Register - React Router App" },
    {
      name: "description",
      content:
        "Create an account to access your data and manage your preferences.",
    },
  ];
}

export default function Reserve() {
  const [reserveParams] = useSearchParams();

  return (
    <ProtectedPage>
      <ReservePage
        courtId={reserveParams.get("court_id")}
        timeslotId={reserveParams.get("timeslot_id")}
        userId={reserveParams.get("user_id")}
      />
    </ProtectedPage>
  );
}
